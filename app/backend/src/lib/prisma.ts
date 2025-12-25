import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from './../../generated/prisma/client.js'
import { env } from './env.js'

const connectionString = env.DATABASE_URL

const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
