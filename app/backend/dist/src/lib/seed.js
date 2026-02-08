import { execSync } from 'node:child_process';
import path from 'node:path';
const providerType = process.env.PROVIDER_TYPE ?? 'sqlserver';
console.log(`🌱 Seeding for provider: ${providerType}`);
const seedFilePath = path.join('prisma', providerType, 'seed.ts');
try {
    execSync(`tsx ${seedFilePath}`, {
        stdio: 'inherit',
        env: process.env,
    });
}
catch (error) {
    console.error(error);
}
