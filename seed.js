const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@discoteca.com' },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@discoteca.com',
      passwordHash: hash,
      role: 'ADMIN'
    }
  });
  
  console.log('Admin user seeded successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
