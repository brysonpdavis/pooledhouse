/*
  Warnings:

  - You are about to alter the column `description` on the `experience_reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `description` on the `workplace_reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.

*/
-- AlterTable
ALTER TABLE "experience_reviews" ADD COLUMN     "fnbDescription" VARCHAR(1024),
ADD COLUMN     "fnbRating" INTEGER,
ADD COLUMN     "vibeDescription" VARCHAR(1024),
ADD COLUMN     "vibeRating" INTEGER,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(2048);

-- AlterTable
ALTER TABLE "places" ADD COLUMN     "experienceScore" DOUBLE PRECISION,
ADD COLUMN     "workplaceScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "workplace_reviews" ADD COLUMN     "compensationDescription" VARCHAR(1024),
ADD COLUMN     "compensationRating" INTEGER,
ADD COLUMN     "cultureDescription" VARCHAR(1024),
ADD COLUMN     "guestDescription" VARCHAR(1024),
ADD COLUMN     "idealFor" VARCHAR(1024),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(2048);
