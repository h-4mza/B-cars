const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.reservation.findMany({ include: { user: true } }).then(r => console.log(JSON.stringify(r, null, 2))).finally(() => prisma.$disconnect());
