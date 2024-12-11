import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const features = [
  {
    name: 'Air Conditioning',
    category: 'Comfort',
    icon: 'FaSnowflake'
  },
  {
    name: 'WiFi',
    category: 'Technology',
    icon: 'FaWifi'
  },
  {
    name: 'Jet Ski',
    category: 'Water Toys',
    icon: 'FaWater'
  },
  {
    name: 'Underwater Lights',
    category: 'Lighting',
    icon: 'FaLightbulb'
  },
  {
    name: 'BBQ Grill',
    category: 'Entertainment',
    icon: 'FaHotdog'
  },
  {
    name: 'Satellite TV',
    category: 'Entertainment',
    icon: 'FaSatellite'
  },
  {
    name: 'Kayaks',
    category: 'Water Toys',
    icon: 'FaShip'
  },
  {
    name: 'Paddleboards',
    category: 'Water Toys',
    icon: 'FaWater'
  },
  {
    name: 'Fishing Equipment',
    category: 'Activities',
    icon: 'FaFish'
  },
  {
    name: 'Diving Equipment',
    category: 'Activities',
    icon: 'FaSwimmer'
  },
  {
    name: 'Wine Cooler',
    category: 'Luxury',
    icon: 'FaWineGlass'
  },
  {
    name: 'Surround Sound',
    category: 'Entertainment',
    icon: 'FaMusic'
  },
  {
    name: 'Stabilizers',
    category: 'Safety',
    icon: 'FaAnchor'
  },
  {
    name: 'Jacuzzi',
    category: 'Luxury',
    icon: 'FaHotTub'
  },
  {
    name: 'Beach Club',
    category: 'Entertainment',
    icon: 'FaUmbrella'
  },
  {
    name: 'Gym Equipment',
    category: 'Fitness',
    icon: 'FaDumbbell'
  },
  {
    name: 'Cinema Room',
    category: 'Entertainment',
    icon: 'FaFilm'
  },
  {
    name: 'Helicopter Pad',
    category: 'Luxury',
    icon: 'FaHelicopter'
  },
  {
    name: 'Underwater Camera',
    category: 'Technology',
    icon: 'FaCamera'
  },
  {
    name: 'Glass Bottom',
    category: 'Unique',
    icon: 'FaWater'
  }
];

async function seedFeatures() {
  try {
    for (const feature of features) {
      const existingFeature = await prisma.boatFeature.findUnique({
        where: {
          name: feature.name
        }
      });

      if (!existingFeature) {
        await prisma.boatFeature.create({
          data: {
            name: feature.name,
            category: feature.category,
            icon: feature.icon,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log(`Created feature: ${feature.name}`);
      } else {
        console.log(`Skipping existing feature: ${feature.name}`);
      }
    }

    console.log('Successfully completed feature seeding');
  } catch (error) {
    console.error('Error seeding features:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFeatures()
  .catch((e) => {
    console.error(e);
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
  }); 