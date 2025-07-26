import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    const user = await prisma.user.create({
        data: {
            email: 'demo@example.com',
            passwordHash,
        },
    });

    await prisma.note.createMany({
        data: [
            {
                userId: user.id,
                title: 'first note',
                body: 'this is test note for testing API',
            },
            {
                userId: user.id,
                title: 'second note',
                body: 'once more note for testing API',
            },
        ],
    });
}

main().finally(() => prisma.$disconnect());