import { PrismaClient, UserRole, UserStatus, BoatStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First, create an admin user
  const admin = await prisma.users.upsert({
    where: { email: 'admin@kosyachts.com' },
    update: {},
    create: {
      email: 'admin@kosyachts.com',
      phoneNumber: '+12345678901',
      role: 'ADMIN',
      status: 'ACTIVE',
      firstName: 'Admin',
      lastName: 'User',
      isPhoneVerified: true,
      isEmailVerified: true,
      isProfileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  // Create some boat features
  const features = await Promise.all([
    prisma.boatFeature.create({
      data: {
        name: 'WiFi',
        category: 'Amenities',
        icon: 'wifi'
      }
    }),
    prisma.boatFeature.create({
      data: {
        name: 'Air Conditioning',
        category: 'Comfort',
        icon: 'ac'
      }
    }),
    prisma.boatFeature.create({
      data: {
        name: 'Kitchen',
        category: 'Amenities',
        icon: 'kitchen'
      }
    })
  ])

  // Create test boats
  const boats = await Promise.all([
    prisma.boats.create({
      data: {
        name: 'Luxury Yacht 1',
        type: 'Yacht',
        make: 'Sunseeker',
        model: 'Manhattan 68',
        year: 2023,
        length: '68',
        capacity: 12,
        location: 'Miami Beach Marina',
        description: 'Luxurious yacht perfect for day trips and overnight stays.',
        images: ['yacht1.jpg'],
        status: 'ACTIVE',
        ownerId: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: {
          connect: features.map(f => ({ id: f.id }))
        },
        boatPrices: {
          create: [
            {
              hours: 4,
              price: 2500,
              effectiveDate: new Date(),
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              hours: 8,
              price: 4500,
              effectiveDate: new Date(),
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      }
    }),
    prisma.boats.create({
      data: {
        name: 'Sport Fishing Boat',
        type: 'Fishing',
        make: 'Boston Whaler',
        model: 'Outrage 380',
        year: 2022,
        length: '38',
        capacity: 8,
        location: 'Key West Harbor',
        description: 'Perfect for deep sea fishing adventures.',
        images: ['fishing1.jpg'],
        status: 'ACTIVE',
        ownerId: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: {
          connect: [{ id: features[0].id }] // Just WiFi
        },
        boatPrices: {
          create: [
            {
              hours: 4,
              price: 1500,
              effectiveDate: new Date(),
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      }
    }),
    prisma.boats.create({
      data: {
        name: 'Party Catamaran',
        type: 'Catamaran',
        make: 'Lagoon',
        model: '52',
        year: 2021,
        length: '52',
        capacity: 20,
        location: 'Miami Beach Marina',
        description: 'Spacious catamaran perfect for group events.',
        images: ['catamaran1.jpg'],
        status: 'ACTIVE',
        ownerId: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: {
          connect: features.map(f => ({ id: f.id }))
        },
        boatPrices: {
          create: [
            {
              hours: 4,
              price: 2000,
              effectiveDate: new Date(),
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              hours: 8,
              price: 3500,
              effectiveDate: new Date(),
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      }
    })
  ])

  console.log(`Database has been seeded. 🌱`)
  console.log(`Created admin user with id: ${admin.id}`)
  console.log(`Created ${features.length} features`)
  console.log(`Created ${boats.length} boats`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 