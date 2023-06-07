/*
  Warnings:

  - You are about to drop the column `description` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `fnbDescription` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `vibeDescription` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `compensationDescription` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `cultureDescription` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `guestDescription` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `idealFor` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `lastEdited` on the `workplace_reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewId]` on the table `experience_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[overallDescriptionCommentId]` on the table `experience_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fnbDescriptionCommentId]` on the table `experience_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vibeDescriptionCommentId]` on the table `experience_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reviewId]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[overallDescriptionCommentId]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[compensationDescriptionCommentId]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guestDescriptionCommentId]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cultureDescriptionCommentId]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idealForCommentId]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `overallDescriptionCommentId` to the `experience_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewId` to the `experience_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallDescriptionCommentId` to the `workplace_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewId` to the `workplace_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "experience_reviews" DROP COLUMN "description",
DROP COLUMN "fnbDescription",
DROP COLUMN "vibeDescription",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fnbDescriptionCommentId" TEXT,
ADD COLUMN     "overallDescriptionCommentId" TEXT NOT NULL,
ADD COLUMN     "reviewId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "vibeDescriptionCommentId" TEXT;

-- AlterTable
ALTER TABLE "workplace_reviews" DROP COLUMN "compensationDescription",
DROP COLUMN "cultureDescription",
DROP COLUMN "description",
DROP COLUMN "guestDescription",
DROP COLUMN "idealFor",
DROP COLUMN "lastEdited",
ADD COLUMN     "compensationDescriptionCommentId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "cultureDescriptionCommentId" TEXT,
ADD COLUMN     "guestDescriptionCommentId" TEXT,
ADD COLUMN     "idealForCommentId" TEXT,
ADD COLUMN     "overallDescriptionCommentId" TEXT NOT NULL,
ADD COLUMN     "reviewId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_comments" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "text" VARCHAR(2048) NOT NULL,
    "numberOfAgreements" INTEGER NOT NULL DEFAULT 0,
    "numberOfReactions" INTEGER NOT NULL DEFAULT 0,
    "reactionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "review_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_comment_reactions" (
    "id" TEXT NOT NULL,
    "reviewCommentId" TEXT NOT NULL,
    "agree" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "review_comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_comment_reactions_reviewCommentId_userId_key" ON "review_comment_reactions"("reviewCommentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "experience_reviews_reviewId_key" ON "experience_reviews"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "experience_reviews_overallDescriptionCommentId_key" ON "experience_reviews"("overallDescriptionCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "experience_reviews_fnbDescriptionCommentId_key" ON "experience_reviews"("fnbDescriptionCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "experience_reviews_vibeDescriptionCommentId_key" ON "experience_reviews"("vibeDescriptionCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_reviewId_key" ON "workplace_reviews"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_overallDescriptionCommentId_key" ON "workplace_reviews"("overallDescriptionCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_compensationDescriptionCommentId_key" ON "workplace_reviews"("compensationDescriptionCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_guestDescriptionCommentId_key" ON "workplace_reviews"("guestDescriptionCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_cultureDescriptionCommentId_key" ON "workplace_reviews"("cultureDescriptionCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_idealForCommentId_key" ON "workplace_reviews"("idealForCommentId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comment_reactions" ADD CONSTRAINT "review_comment_reactions_reviewCommentId_fkey" FOREIGN KEY ("reviewCommentId") REFERENCES "review_comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comment_reactions" ADD CONSTRAINT "review_comment_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_overallDescriptionCommentId_fkey" FOREIGN KEY ("overallDescriptionCommentId") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_compensationDescriptionCommentId_fkey" FOREIGN KEY ("compensationDescriptionCommentId") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_guestDescriptionCommentId_fkey" FOREIGN KEY ("guestDescriptionCommentId") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_cultureDescriptionCommentId_fkey" FOREIGN KEY ("cultureDescriptionCommentId") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_idealForCommentId_fkey" FOREIGN KEY ("idealForCommentId") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_overallDescriptionCommentId_fkey" FOREIGN KEY ("overallDescriptionCommentId") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_fnbDescriptionCommentId_fkey" FOREIGN KEY ("fnbDescriptionCommentId") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_vibeDescriptionCommentId_fkey" FOREIGN KEY ("vibeDescriptionCommentId") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
