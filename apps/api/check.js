const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const res = await prisma.reservation.findMany();
  console.log(res);
}

check().finally(() => prisma.$disconnect());
