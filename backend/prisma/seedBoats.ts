import { PrismaClient, BoatStatus, CancellationPolicy, FuelType } from '@prisma/client';
const prisma = new PrismaClient();

const boatTypes = ['Yacht', 'Sailboat', 'Pontoon', 'Speedboat', 'Catamaran'];
const locations = ['Miami, FL', 'San Diego, CA', 'Seattle, WA', 'New York, NY', 'Chicago, IL'];
const makes = ['Sea Ray', 'Beneteau', 'Boston Whaler', 'Chaparral', 'Yamaha'];
const models = ['Sundancer', 'Oceanis', 'Outrage', 'SSX', 'AR'];
const years = Array.from({ length: 10 }, (_, i) => 2015 + i); // 2015-2024

async function seedBoats() {
  try {
    // Get existing features to assign to boats
    const features = await prisma.boatFeature.findMany();
    
    // Get first user as owner (assuming you have users)
    const owner = await prisma.users.findFirst();
    if (!owner) throw new Error('No users found to assign as boat owner');

    for (let i = 0; i < 30; i++) {
      const randomFeatures = features
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 5) + 3); // 3-7 random features

      await prisma.boats.create({
        data: {
          name: `${makes[Math.floor(Math.random() * makes.length)]} ${i + 1}`,
          description: `Beautiful boat for rent with great amenities and stunning views.`,
          type: boatTypes[Math.floor(Math.random() * boatTypes.length)],
          make: makes[Math.floor(Math.random() * makes.length)],
          model: models[Math.floor(Math.random() * models.length)],
          year: years[Math.floor(Math.random() * years.length)],
          length: `${Math.floor(Math.random() * 40) + 20}`, // 20-60 feet
          capacity: Math.floor(Math.random() * 12) + 4, // 4-15 people
          location: locations[Math.floor(Math.random() * locations.length)],
          images: ['/images/boats/default.jpg'],
          status: BoatStatus.ACTIVE,
          cancellationPolicy: CancellationPolicy.MODERATE,
          amenities: ['WiFi', 'Bathroom', 'Kitchen', 'Sound System'],
          rules: ['No smoking', 'No pets', 'No parties'],
          allowedActivities: ['Swimming', 'Fishing', 'Sunset Cruising'],
          features: {
            connect: randomFeatures.map(f => ({ id: f.id }))
          },
          boatPrices: {
            create: [
              {
                hours: 4,
                price: Math.floor(Math.random() * 300) + 200, // $200-500
                effectiveDate: new Date(),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              {
                hours: 8,
                price: Math.floor(Math.random() * 500) + 400, // $400-900
                effectiveDate: new Date(),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]
          },
          user: {
            connect: { id: owner.id }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    console.log('Successfully seeded 30 boats');
  } catch (error) {
    console.error('Error seeding boats:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBoats()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 