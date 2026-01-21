/*
  Warnings:

  - You are about to drop the `TagArticles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TagArticles";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TagArtifacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artifactId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TagArtifacts_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifacts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TagArtifacts_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
