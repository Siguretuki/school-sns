-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TagArtifacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artifactId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TagArtifacts_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifacts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TagArtifacts_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TagArtifacts" ("artifactId", "createdAt", "id", "tagId") SELECT "artifactId", "createdAt", "id", "tagId" FROM "TagArtifacts";
DROP TABLE "TagArtifacts";
ALTER TABLE "new_TagArtifacts" RENAME TO "TagArtifacts";
CREATE TABLE "new_TagScraps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scrapId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TagScraps_scrapId_fkey" FOREIGN KEY ("scrapId") REFERENCES "Scraps" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TagScraps_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TagScraps" ("createdAt", "id", "scrapId", "tagId") SELECT "createdAt", "id", "scrapId", "tagId" FROM "TagScraps";
DROP TABLE "TagScraps";
ALTER TABLE "new_TagScraps" RENAME TO "TagScraps";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
