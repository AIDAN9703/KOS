-- CreateEnum
CREATE TYPE "BoatStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('DIESEL', 'GASOLINE', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "CancellationPolicy" AS ENUM ('FLEXIBLE', 'MODERATE', 'STRICT');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('ROUTINE', 'REPAIR', 'EMERGENCY', 'INSPECTION');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_REQUEST', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'PAYMENT_RECEIVED', 'REVIEW_RECEIVED', 'MAINTENANCE_DUE', 'INSURANCE_EXPIRING', 'SYSTEM_NOTIFICATION');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FLAGGED', 'REMOVED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VerificationCodeType" AS ENUM ('REGISTRATION', 'LOGIN');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "InsuranceStatus" AS ENUM ('PENDING', 'VALID', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('GOLD', 'PLATINUM', 'DIAMOND', 'ELITE', 'VIP');

-- CreateTable
CREATE TABLE "BoatPrices" (
    "id" SERIAL NOT NULL,
    "boatId" INTEGER NOT NULL,
    "hours" SMALLINT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "effectiveDate" TIMESTAMPTZ(6) NOT NULL,
    "expiryDate" TIMESTAMPTZ(6),
    "description" VARCHAR(255),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "BoatPrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boats" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "make" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "year" SMALLINT NOT NULL,
    "sleeps" SMALLINT,
    "staterooms" SMALLINT,
    "bathrooms" SMALLINT,
    "beds" SMALLINT,
    "engineCount" SMALLINT,
    "enginePower" VARCHAR(255),
    "fuelType" "FuelType",
    "cruisingSpeed" SMALLINT,
    "maxSpeed" SMALLINT,
    "beam" VARCHAR(255),
    "draft" VARCHAR(255),
    "lastServiced" TIMESTAMPTZ(6),
    "amenities" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
    "documents" JSONB DEFAULT '{}',
    "specifications" JSONB DEFAULT '{}',
    "rules" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
    "cancellationPolicy" "CancellationPolicy" DEFAULT 'MODERATE',
    "securityDeposit" DECIMAL(10,2),
    "insuranceStatus" "InsuranceStatus" DEFAULT 'PENDING',
    "videoTour" VARCHAR(255),
    "virtualTour" VARCHAR(255),
    "length" VARCHAR(255) NOT NULL,
    "capacity" SMALLINT NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "images" VARCHAR(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "status" "BoatStatus" DEFAULT 'ACTIVE',
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "averageRating" DECIMAL(3,2),
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "coordinates" JSONB,
    "availability" JSONB DEFAULT '{}',
    "minimumNotice" INTEGER NOT NULL DEFAULT 24,
    "maximumDuration" INTEGER,
    "minimumDuration" INTEGER,
    "seasonalRates" JSONB DEFAULT '{}',
    "allowedActivities" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Boats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "boatId" INTEGER NOT NULL,
    "boatPriceId" INTEGER NOT NULL,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "duration" INTEGER NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "specialRequests" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "paymentIntentId" VARCHAR(255),
    "stripeSessionId" VARCHAR(255),
    "addOns" JSONB DEFAULT '{}',
    "guestCount" SMALLINT,
    "checkinTime" TIMESTAMPTZ(6),
    "checkoutTime" TIMESTAMPTZ(6),
    "cancellationReason" TEXT,
    "refundAmount" DECIMAL(10,2),
    "weatherConditions" JSONB DEFAULT '{}',
    "crewMembers" JSONB DEFAULT '[]',
    "itinerary" JSONB DEFAULT '{}',
    "insuranceDetails" JSONB DEFAULT '{}',
    "checklistCompleted" BOOLEAN NOT NULL DEFAULT false,
    "weatherAlert" BOOLEAN DEFAULT false,
    "contractSigned" BOOLEAN NOT NULL DEFAULT false,
    "securityDepositPaid" BOOLEAN NOT NULL DEFAULT false,
    "insuranceVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenances" (
    "id" SERIAL NOT NULL,
    "boatId" INTEGER NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2),
    "scheduledDate" TIMESTAMPTZ(6) NOT NULL,
    "completedDate" TIMESTAMPTZ(6),
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "serviceProvider" VARCHAR(255),
    "documents" VARCHAR(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "notes" TEXT,
    "nextMaintenanceDate" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "partsCost" DECIMAL(10,2),
    "laborCost" DECIMAL(10,2),
    "warranty" JSONB DEFAULT '{}',
    "technician" VARCHAR(255),
    "diagnosis" TEXT,
    "resolution" TEXT,
    "partsReplaced" JSONB DEFAULT '[]',
    "engineHours" INTEGER,
    "priority" "MaintenancePriority" DEFAULT 'NORMAL',

    CONSTRAINT "Maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "NotificationPriority" DEFAULT 'LOW',
    "isRead" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "stripePaymentIntentId" VARCHAR(255),
    "stripeCustomerId" VARCHAR(255),
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(255) DEFAULT 'usd',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" VARCHAR(255),
    "refundAmount" DECIMAL(10,2) DEFAULT 0,
    "refundReason" VARCHAR(255),
    "stripeRefundId" VARCHAR(255),
    "metadata" JSONB DEFAULT '{}',
    "receiptUrl" VARCHAR(255),
    "paymentDate" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "reviewerId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "response" TEXT,
    "responseDate" TIMESTAMPTZ(6),
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "helpful" INTEGER DEFAULT 0,
    "photos" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
    "verified" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "cleanliness" SMALLINT,
    "communication" SMALLINT,
    "accuracy" SMALLINT,
    "value" SMALLINT,
    "location" SMALLINT,
    "experience" SMALLINT,
    "recommended" BOOLEAN NOT NULL DEFAULT true,
    "tripDetails" JSONB DEFAULT '{}',
    "moderationNotes" TEXT,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(320),
    "password" VARCHAR(255),
    "phoneNumber" VARCHAR(20) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isPhoneVerified" BOOLEAN DEFAULT false,
    "isEmailVerified" BOOLEAN DEFAULT false,
    "isProfileComplete" BOOLEAN DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "dateOfBirth" TIMESTAMPTZ(6),
    "address" VARCHAR(255),
    "profileImage" VARCHAR(255),
    "preferences" JSON DEFAULT '{}',
    "bio" TEXT,
    "emergencyContact" JSON DEFAULT '{}',
    "stripeCustomerId" VARCHAR(255),
    "verifiedId" BOOLEAN DEFAULT false,
    "idDocuments" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
    "boatingLicense" VARCHAR(255),
    "licenseExpiry" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "languagePreference" VARCHAR(50),
    "timezone" VARCHAR(50),
    "socialLinks" JSONB DEFAULT '{}',
    "verificationStatus" JSONB DEFAULT '{}',
    "paymentMethods" JSONB DEFAULT '[]',
    "favoriteBoats" JSONB DEFAULT '[]',
    "searchHistory" JSONB DEFAULT '[]',
    "membershipTier" "MembershipTier" NOT NULL DEFAULT 'GOLD',
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT,
    "referredBy" INTEGER,
    "lastLoginAt" TIMESTAMP(3),
    "deviceTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCodes" (
    "id" UUID NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "type" "VerificationCodeType" NOT NULL,
    "used" BOOLEAN DEFAULT false,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VerificationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoatPrices_boatId_isActive_effectiveDate_expiryDate_idx" ON "BoatPrices"("boatId", "isActive", "effectiveDate", "expiryDate");

-- CreateIndex
CREATE INDEX "BoatPrices_effectiveDate_expiryDate_idx" ON "BoatPrices"("effectiveDate", "expiryDate");

-- CreateIndex
CREATE INDEX "Boats_status_location_idx" ON "Boats"("status", "location");

-- CreateIndex
CREATE INDEX "Boats_ownerId_status_idx" ON "Boats"("ownerId", "status");

-- CreateIndex
CREATE INDEX "Boats_make_model_year_idx" ON "Boats"("make", "model", "year");

-- CreateIndex
CREATE INDEX "Boats_type_capacity_idx" ON "Boats"("type", "capacity");

-- CreateIndex
CREATE INDEX "Boats_averageRating_idx" ON "Boats"("averageRating");

-- CreateIndex
CREATE INDEX "Boats_coordinates_idx" ON "Boats"("coordinates");

-- CreateIndex
CREATE INDEX "Boats_totalBookings_idx" ON "Boats"("totalBookings");

-- CreateIndex
CREATE INDEX "Bookings_userId_status_idx" ON "Bookings"("userId", "status");

-- CreateIndex
CREATE INDEX "Bookings_boatId_startDate_idx" ON "Bookings"("boatId", "startDate");

-- CreateIndex
CREATE INDEX "Bookings_paymentStatus_idx" ON "Bookings"("paymentStatus");

-- CreateIndex
CREATE INDEX "Bookings_createdAt_idx" ON "Bookings"("createdAt");

-- CreateIndex
CREATE INDEX "Bookings_startDate_endDate_idx" ON "Bookings"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_bookingId_key" ON "Payments"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_stripePaymentIntentId_key" ON "Payments"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "payments_booking_id" ON "Payments"("bookingId");

-- CreateIndex
CREATE INDEX "payments_stripe_payment_intent_id" ON "Payments"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_bookingId_key" ON "Reviews"("bookingId");

-- CreateIndex
CREATE INDEX "Reviews_reviewerId_idx" ON "Reviews"("reviewerId");

-- CreateIndex
CREATE INDEX "Reviews_targetId_idx" ON "Reviews"("targetId");

-- CreateIndex
CREATE INDEX "Reviews_bookingId_idx" ON "Reviews"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phoneNumber_key" ON "Users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Users_stripeCustomerId_key" ON "Users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_referralCode_key" ON "Users"("referralCode");

-- CreateIndex
CREATE INDEX "Users_role_status_idx" ON "Users"("role", "status");

-- CreateIndex
CREATE INDEX "Users_phoneNumber_status_idx" ON "Users"("phoneNumber", "status");

-- CreateIndex
CREATE INDEX "Users_stripeCustomerId_idx" ON "Users"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Users_referredBy_idx" ON "Users"("referredBy");

-- CreateIndex
CREATE INDEX "verification_codes_phone_number_type_used_expires_at" ON "VerificationCodes"("phoneNumber", "type", "used", "expiresAt");

-- AddForeignKey
ALTER TABLE "BoatPrices" ADD CONSTRAINT "BoatPrices_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boats" ADD CONSTRAINT "Boats_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_boatPriceId_fkey" FOREIGN KEY ("boatPriceId") REFERENCES "BoatPrices"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenances" ADD CONSTRAINT "Maintenances_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Boats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bookings"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
