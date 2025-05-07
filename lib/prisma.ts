import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};


const prismaSingleton: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ['query'], // Descomente para logar queries em desenvolvimento
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaSingleton;
}

export default prismaSingleton;