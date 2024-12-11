import twilio from 'twilio';

interface VerificationAttempt {
  count: number;
  timestamp: number;
}

export class SMSService {
  private client: twilio.Twilio;
  private verifyServiceSid: string;
  private verificationAttempts: Map<string, VerificationAttempt>;

  constructor() {
    const requiredVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_VERIFY_SERVICE_SID'];
    const missingVars = requiredVars.filter(envVar => !process.env[envVar]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required Twilio credentials: ${missingVars.join(', ')}`);
    }

    this.client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
    this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;
    this.verificationAttempts = new Map();
  }

  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return `+1${cleaned}`;
  }

  isRateLimited(phoneNumber: string): boolean {
    const attempts = this.verificationAttempts.get(phoneNumber);
    if (!attempts) return false;

    const now = Date.now();
    if (now - attempts.timestamp > 15 * 60 * 1000) {
      this.verificationAttempts.delete(phoneNumber);
      return false;
    }

    return attempts.count >= 3 && (now - attempts.timestamp) < 15 * 60 * 1000;
  }

  recordAttempt(phoneNumber: string): void {
    const now = Date.now();
    const current = this.verificationAttempts.get(phoneNumber) || { count: 0, timestamp: now };

    if (now - current.timestamp > 15 * 60 * 1000) {
      current.count = 1;
      current.timestamp = now;
    } else {
      current.count += 1;
    }

    this.verificationAttempts.set(phoneNumber, current);
  }

  async sendVerificationCode(phoneNumber: string): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);

      if (this.isRateLimited(formattedNumber)) {
        const error = new Error('Please wait 15 minutes before requesting another code');
        error.name = 'RateLimitError';
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, 3000));

      const verification = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verifications
        .create({
          to: formattedNumber,
          channel: 'sms',
          locale: 'en'
        });

      this.recordAttempt(formattedNumber);

      return verification.status === 'pending';
    } catch (error: any) {
      if (error.code === 20429) {
        const customError = new Error('Please wait before requesting another code');
        customError.name = 'RateLimitError';
        throw customError;
      }

      if (error.name === 'RateLimitError') {
        throw error;
      }

      console.error('Twilio error:', error);
      throw new Error('Failed to send verification code. Please try again.');
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);

      const verificationCheck = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks
        .create({
          to: formattedNumber,
          code
        });

      if (verificationCheck.status === 'approved') {
        this.verificationAttempts.delete(formattedNumber);
      }

      return verificationCheck.status === 'approved';
    } catch (error: any) {
      console.error('Verification check error:', error);
      
      if (error.code === 20429) {
        throw new Error('Too many verification attempts. Please wait and try again.');
      }

      throw new Error('Failed to verify code. Please try again.');
    }
  }

  public cleanupOldAttempts(): void {
    const now = Date.now();
    for (const [phoneNumber, data] of this.verificationAttempts.entries()) {
      if (now - data.timestamp > 15 * 60 * 1000) {
        this.verificationAttempts.delete(phoneNumber);
      }
    }
  }
}

// Create instance
const smsService = new SMSService();

// Use the public method for cleanup
setInterval(() => {
  smsService.cleanupOldAttempts();
}, 15 * 60 * 1000);

export default smsService; 