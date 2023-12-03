// 예제 코드
import { PrismaClient } from './prisma/generated/client'
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.wallet.findMany();
    console.log(users);
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    throw error;
  });