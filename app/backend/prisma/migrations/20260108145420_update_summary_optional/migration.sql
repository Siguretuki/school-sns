-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artifacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "summaryByAI" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Artifacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Artifacts" ("body", "createdAt", "id", "publishedAt", "status", "summaryByAI", "title", "updatedAt", "userId") SELECT "body", "createdAt", "id", "publishedAt", "status", "summaryByAI", "title", "updatedAt", "userId" FROM "Artifacts";
DROP TABLE "Artifacts";
ALTER TABLE "new_Artifacts" RENAME TO "Artifacts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
