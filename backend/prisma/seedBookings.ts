import { PrismaClient, BookingStatus, PaymentStatus } from '@prisma/client';
import { addDays, subDays, addHours } from 'date-fns';

const prisma = new PrismaClient();

async function createMockBookings() {
  // First, ensure we have users and boats
  const users = await prisma.users.findMany({ take: 5 });
  const boats = await prisma.boats.findMany({ 
    include: { boatPrices: true },
    take: 3 
  });

  if (!users.length || !boats.length) {
    console.log('Please seed users and boats first');
    return;
  }

  const bookings = [];
  const now = new Date();

  // Create different types of bookings
  const mockBookings = [
    // Pending Bookings
    {
      startDate: addDays(now, 7),
      status: BookingStatus.PENDING,
      totalPrice: 500.00
    },
    {
      startDate: addDays(now, 14),
      status: BookingStatus.PENDING,
      totalPrice: 750.00
    },
    // Confirmed Bookings
    {
      startDate: addDays(now, 3),
      status: BookingStatus.CONFIRMED,
      totalPrice: 1000.00
    },
    {
      startDate: addDays(now, 5),
      status: BookingStatus.CONFIRMED,
      totalPrice: 1200.00
    },
    // Completed Bookings
    {
      startDate: subDays(now, 7),
      status: BookingStatus.COMPLETED,
      totalPrice: 800.00
    },
    {
      startDate: subDays(now, 14),
      status: BookingStatus.COMPLETED,
      totalPrice: 950.00
    },
    // Cancelled Bookings
    {
      startDate: subDays(now, 3),
      status: BookingStatus.CANCELLED,
      totalPrice: 600.00,
      cancellationReason: 'Weather conditions'
    }
  ];

  for (const mockBooking of mockBookings) {
    const user = users[Math.floor(Math.random() * users.length)];
    const boat = boats[Math.floor(Math.random() * boats.length)];
    const boatPrice = boat.boatPrices[0];

    const startDate = mockBooking.startDate;
    const endDate = addHours(startDate, 4);

    bookings.push({
      userId: user.id,
      boatId: boat.id,
      boatPriceId: boatPrice.id,
      startDate,
      endDate,
      startTime: '09:00',
      endTime: '13:00',
      duration: 4,
      totalPrice: mockBooking.totalPrice,
      status: mockBooking.status,
      paymentStatus: PaymentStatus.COMPLETED,
      specialRequests: 'No special requests',
      createdAt: new Date(),
      updatedAt: new Date(),
      guestCount: Math.floor(Math.random() * 5) + 1,
      checkinTime: startDate,
      checkoutTime: endDate,
      cancellationReason: mockBooking.cancellationReason || null,
      weatherConditions: { temperature: '75°F', conditions: 'Sunny' },
      crewMembers: ['John Doe', 'Jane Smith'],
      itinerary: { route: 'Coastal Tour', stops: ['Beach A', 'Beach B'] },
      insuranceDetails: { provider: 'SafeBoat Insurance', policyNumber: '12345' },
      checklistCompleted: true,
      contractSigned: true,
      securityDepositPaid: true,
      insuranceVerified: true
    });
  }

  // Create the bookings
  for (const booking of bookings) {
    await prisma.bookings.create({
      data: booking
    });
  }

  console.log(`Created ${bookings.length} mock bookings`);
}

createMockBookings()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 