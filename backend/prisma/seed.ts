import { PrismaClient, UserRole, UserStatus, MembershipTier } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.users.deleteMany()

  // Create admin users
  const adminUsers = await Promise.all([
    createUser({
      email: 'admin@example.com',
      password: 'admin123',
      phoneNumber: '+1234567890',
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
      membershipTier: MembershipTier.ELITE,
      loyaltyPoints: 1000
    }),
    createUser({
      email: 'sarah.admin@example.com',
      password: 'admin123',
      phoneNumber: '+1234567891',
      role: UserRole.ADMIN,
      firstName: 'Sarah',
      lastName: 'Johnson',
      membershipTier: MembershipTier.ELITE,
      loyaltyPoints: 900
    })
  ])

  // Create boat owners
  const boatOwners = await Promise.all([
    createOwnerWithBoats({
      email: 'owner@example.com',
      password: 'owner123',
      phoneNumber: '+1234567892',
      firstName: 'John',
      lastName: 'Smith',
      boats: [
        {
          name: 'Luxury Yacht',
          type: 'YACHT',
          prices: [{ hours: 4, price: 1000 }, { hours: 8, price: 1800 }]
        }
      ]
    }),
    createOwnerWithBoats({
      email: 'michael@boats.com',
      password: 'owner123',
      phoneNumber: '+1234567893',
      firstName: 'Michael',
      lastName: 'Brown',
      boats: [
        {
          name: 'Ocean Explorer',
          type: 'CATAMARAN',
          prices: [{ hours: 4, price: 800 }, { hours: 8, price: 1500 }]
        }
      ]
    }),
    createOwnerWithBoats({
      email: 'emma@yachts.com',
      password: 'owner123',
      phoneNumber: '+1234567894',
      firstName: 'Emma',
      lastName: 'Davis',
      boats: [
        {
          name: 'Sunset Cruiser',
          type: 'SAILBOAT',
          prices: [{ hours: 4, price: 600 }, { hours: 8, price: 1100 }]
        }
      ]
    })
  ])

  // Create regular users with different membership tiers
  const regularUsers = await Promise.all([
    createUser({
      email: 'user@example.com',
      password: 'user123',
      phoneNumber: '+1234567895',
      role: UserRole.USER,
      firstName: 'Regular',
      lastName: 'User',
      membershipTier: MembershipTier.GOLD,
      loyaltyPoints: 100
    }),
    createUser({
      email: 'james@example.com',
      password: 'user123',
      phoneNumber: '+1234567896',
      role: UserRole.USER,
      firstName: 'James',
      lastName: 'Wilson',
      membershipTier: MembershipTier.PLATINUM,
      loyaltyPoints: 250
    }),
    createUser({
      email: 'sophia@example.com',
      password: 'user123',
      phoneNumber: '+1234567897',
      role: UserRole.USER,
      firstName: 'Sophia',
      lastName: 'Garcia',
      membershipTier: MembershipTier.DIAMOND,
      loyaltyPoints: 500
    }),
    createUser({
      email: 'oliver@example.com',
      password: 'user123',
      phoneNumber: '+1234567898',
      role: UserRole.USER,
      firstName: 'Oliver',
      lastName: 'Taylor',
      membershipTier: MembershipTier.ELITE,
      loyaltyPoints: 750
    }),
    createUser({
      email: 'ava@example.com',
      password: 'user123',
      phoneNumber: '+1234567899',
      role: UserRole.USER,
      firstName: 'Ava',
      lastName: 'Martinez',
      membershipTier: MembershipTier.VIP,
      loyaltyPoints: 1000
    }),
    createUser({
      email: 'william@example.com',
      password: 'user123',
      phoneNumber: '+1234567900',
      role: UserRole.USER,
      firstName: 'William',
      lastName: 'Anderson',
      membershipTier: MembershipTier.GOLD,
      loyaltyPoints: 150
    }),
    createUser({
      email: 'isabella@example.com',
      password: 'user123',
      phoneNumber: '+1234567901',
      role: UserRole.USER,
      firstName: 'Isabella',
      lastName: 'Thomas',
      membershipTier: MembershipTier.PLATINUM,
      loyaltyPoints: 300
    }),
    createUser({
      email: 'lucas@example.com',
      password: 'user123',
      phoneNumber: '+1234567902',
      role: UserRole.USER,
      firstName: 'Lucas',
      lastName: 'Jackson',
      membershipTier: MembershipTier.DIAMOND,
      loyaltyPoints: 450
    }),
    createUser({
      email: 'mia@example.com',
      password: 'user123',
      phoneNumber: '+1234567903',
      role: UserRole.USER,
      firstName: 'Mia',
      lastName: 'White',
      membershipTier: MembershipTier.ELITE,
      loyaltyPoints: 800
    }),
    createUser({
      email: 'ethan@example.com',
      password: 'user123',
      phoneNumber: '+1234567904',
      role: UserRole.USER,
      firstName: 'Ethan',
      lastName: 'Harris',
      membershipTier: MembershipTier.VIP,
      loyaltyPoints: 950
    })
  ])

  console.log({
    admins: adminUsers.length,
    owners: boatOwners.length,
    users: regularUsers.length,
    total: adminUsers.length + boatOwners.length + regularUsers.length
  })
}

async function createUser(data: any) {
  const hashedPassword = await hash(data.password, 10)
  return prisma.users.create({
    data: {
      ...data,
      password: hashedPassword,
      status: UserStatus.ACTIVE,
      isPhoneVerified: true,
      isEmailVerified: true,
      isProfileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
}

async function createOwnerWithBoats(data: any) {
  const hashedPassword = await hash(data.password, 10)
  return prisma.users.create({
    data: {
      ...data,
      password: hashedPassword,
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
      membershipTier: MembershipTier.PLATINUM,
      isPhoneVerified: true,
      isEmailVerified: true,
      isProfileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      loyaltyPoints: 500,
      boats: {
        create: data.boats.map((boat: any) => ({
          name: boat.name,
          description: `Beautiful ${boat.type.toLowerCase()} for rent`,
          type: boat.type,
          make: 'Premium Brand',
          model: 'Luxury Model',
          year: 2023,
          length: '65ft',
          capacity: 10,
          location: 'Miami Beach Marina',
          images: ['/images/boats/default.jpg'],
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
          boatPrices: {
            create: boat.prices.map((price: any) => ({
              hours: price.hours,
              price: price.price,
              effectiveDate: new Date(),
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }))
          }
        }))
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 