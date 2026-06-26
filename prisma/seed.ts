import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding locations and vehicles...');

  const loc = await prisma.location.create({
    data: {
      name: 'Casablanca Aéroport (CMN)',
      type: 'AIRPORT',
      city: 'Casablanca',
      code: 'CMN',
    },
  });

  const loc2 = await prisma.location.create({
    data: {
      name: 'Rabat Ville',
      type: 'AGENCY',
      city: 'Rabat',
    },
  });

  await prisma.vehicle.create({
    data: {
      brand: 'Mercedes-Benz',
      model: 'Classe G',
      year: 2024,
      fuel: 'GASOLINE',
      transmission: 'AUTOMATIC',
      mileage: 15000,
      licensePlate: '12345-A-1',
      pricePerDay: 4500,
      depositAmount: 15000,
      category: 'LUXURY',
      locationId: loc.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800']),
    },
  });

  await prisma.vehicle.create({
    data: {
      brand: 'Range Rover',
      model: 'Sport',
      year: 2023,
      fuel: 'DIESEL',
      transmission: 'AUTOMATIC',
      mileage: 20000,
      licensePlate: '54321-B-2',
      pricePerDay: 3800,
      depositAmount: 12000,
      category: 'SUV',
      locationId: loc.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800']),
    },
  });
  
  await prisma.vehicle.create({
    data: {
      brand: 'Porsche',
      model: 'Macan',
      year: 2024,
      fuel: 'GASOLINE',
      transmission: 'AUTOMATIC',
      mileage: 5000,
      licensePlate: '99999-C-3',
      pricePerDay: 4200,
      depositAmount: 14000,
      category: 'SUV',
      locationId: loc2.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1503376713356-2b8dcb394838?auto=format&fit=crop&q=80&w=800']),
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
