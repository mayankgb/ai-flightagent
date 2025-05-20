import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'Mayank Agrawal'
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma'
    },
  });

  // Create flights
  const flight1 = await prisma.flights.create({
    data: {
      name: 'SpiceJet 101',
      from: 'AJMER',
      to: 'DELHI',
      time: new Date('2025-06-01T10:00:00Z'),
      availableSeats: 10,
    },
  });

  const flight2 = await prisma.flights.create({
    data: {
      name: 'IndiGo 202',
      from: 'DELHI',
      to: 'GWALIOR',
      time: new Date('2025-06-02T14:30:00Z'),
      availableSeats: 5,
    },
  });

  const flight3 = await prisma.flights.create({
    data: {
      name: 'Air India 303',
      from: 'CHANDIGARH',
      to: 'AJMER',
      time: new Date('2025-06-03T09:15:00Z'),
      availableSeats: 8,
    },
  });

  // Book seats
  await prisma.bookSeats.create({
    data: {
      userId: user1.id,
      flightId: flight1.id,
      status: 'CONFIRMED'
    }
  });

  await prisma.bookSeats.create({
    data: {
      userId: user1.id,
      flightId: flight2.id,
      status: 'WAITING'
    }
  });

  await prisma.bookSeats.create({
    data: {
      userId: user2.id,
      flightId: flight2.id,
      status: 'CONFIRMED'
    }
  });

  await prisma.bookSeats.create({
    data: {
      userId: user2.id,
      flightId: flight3.id,
      status: 'CANCELLED'
    }
  });

  console.log('🌱 Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
