const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function del() { 
  await prisma.reservation.deleteMany(); 
  console.log('deleted'); 
} 
del().finally(() => prisma.$disconnect());
