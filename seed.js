const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('EKtQQBWFTEiO', 10);
  
  await prisma.user.upsert({
    where: { email: 'adhe_24@gmail.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Principal',
      email: 'adhe_24@gmail.com',
      passwordHash: hash,
      role: 'ADMIN'
    }
  });
  
  console.log('Usuario administrador personalizado creado con éxito.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
