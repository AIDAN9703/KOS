require('dotenv').config();
const { Boat } = require('./src/models');
const sequelize = require('./src/config/database');

const locations = [
  'Miami', 'Fort Lauderdale', 'New Jersey', 'Key Largo', 'Connecticut', 'Dominican Republic'
];

const boatTypes = ['Yacht', 'Catamaran', 'Speedboat', 'Sailboat', 'Motor Yacht', 'Fishing Boat', 'Pontoon', 'Jet Ski'];

// Add a set of real boat image filenames
const boatImages = [
  'yacht1.jpg', 'yacht2.jpg', 'yacht3.jpg', 'catamaran1.jpg', 'catamaran2.jpg',
  'speedboat1.jpg', 'speedboat2.jpg', 'sailboat1.jpg', 'sailboat2.jpg', 'motor-yacht1.jpg'
];

const manufacturers = ['Sea Ray', 'Beneteau', 'Lagoon', 'Azimut', 'Sunseeker', 'Boston Whaler', 'Jeanneau', 'Princess'];

const features = ['WiFi', 'Air Conditioning', 'Jacuzzi', 'Jet Ski', 'Kayaks', 'Fishing Gear', 'Snorkeling Equipment', 'BBQ Grill', 'Satellite TV', 'Underwater Lights'];

// Function to generate a random phone number
function generatePhoneNumber() {
  return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function generateRandomBoat(index) {
  // Randomly select 5-10 images for each boat
  const numImages = Math.floor(Math.random() * 6) + 5;
  const boatImageSet = Array.from({ length: numImages }, () => boatImages[Math.floor(Math.random() * boatImages.length)]);
  const numFeatures = Math.floor(Math.random() * 5) + 3;
  const boatFeatures = Array.from({ length: numFeatures }, () => features[Math.floor(Math.random() * features.length)]);

  const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
  const year = Math.floor(Math.random() * (2024 - 2000)) + 2000;
  const availableFrom = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  const availableTo = new Date(availableFrom.getTime() + Math.random() * 10000000000);

  return {
    name: `${manufacturer} ${year}`,
    type: boatTypes[Math.floor(Math.random() * boatTypes.length)],
    length: Math.floor(Math.random() * 100) + 20,
    beam: Math.floor(Math.random() * 20) + 5,
    draft: Math.floor(Math.random() * 10) + 2,
    year: year,
    manufacturer: manufacturer,
    model: `Model ${Math.floor(Math.random() * 100)}`,
    capacity: Math.floor(Math.random() * 20) + 2,
    cabins: Math.floor(Math.random() * 5) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    description: `A beautiful ${manufacturer} ${year} ${boatTypes[Math.floor(Math.random() * boatTypes.length)]} for your adventures on the water.`,
    images: boatImageSet.map(img => `/images/boats/${img}`),
    pricePerDay: Math.floor(Math.random() * 5000) + 500,
    location: locations[Math.floor(Math.random() * locations.length)],
    features: boatFeatures,
    availableFrom: availableFrom,
    availableTo: availableTo,
    maintenanceDate: new Date(year + 1, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    licenseNumber: `LIC-${Math.floor(Math.random() * 10000)}`,
    ownerName: `Owner ${index + 1}`,
    ownerPhoneNumber: generatePhoneNumber(),
    ownerEmail: `owner${index + 1}@example.com`
  };
}

const sampleBoats = Array.from({ length: 210 }, (_, i) => generateRandomBoat(i));

async function seedBoats() {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it exists
    await Boat.bulkCreate(sampleBoats);
    console.log('Sample boats have been added to the database');
  } catch (error) {
    console.error('Error seeding boats:', error);
  } finally {
    await sequelize.close();
  }
}

seedBoats();
