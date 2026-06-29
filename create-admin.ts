import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await argon2.hash('admin123', { type: argon2.argon2id });
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@carjet.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@carjet.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created successfully:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
