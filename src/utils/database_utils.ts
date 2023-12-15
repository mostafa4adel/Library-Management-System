import { PrismaClient } from "@prisma/client";
import { DEFAULT_ADMIN_USERNAME } from "../config";
import { DEFAULT_ADMIN_PASSWORD } from "../config";
import bcrypt from 'bcrypt';

const database_client = new PrismaClient();

export const initialize_database = async () => {
    try {
        await database_client.$connect();

        const default_admin = await database_client.admin.findFirst({
            where: {
                username: DEFAULT_ADMIN_USERNAME
            }
        });

        if (!default_admin) {
            await database_client.admin.create({
                data: {
                    username: DEFAULT_ADMIN_USERNAME,
                    password: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)
                }
            });
        }
    } catch (error) {
        console.error(error);

        // Gracefully shutdown the application
        process.on('exit', () => {
            database_client.$disconnect();
        });

        process.exit(1);
    }
}

export { database_client ,  };