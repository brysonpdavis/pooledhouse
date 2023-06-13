/*
  Warnings:

  - You are about to drop the column `createdAt` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `fnbDescriptionCommentId` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `fnbRating` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `overallDescriptionCommentId` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `overallRating` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `vibeDescriptionCommentId` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `vibeRating` on the `experience_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `experienceScore` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `workplaceScore` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCommentId` on the `review_comment_reactions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `review_comment_reactions` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfAgreements` on the `review_comments` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfReactions` on the `review_comments` table. All the data in the column will be lost.
  - You are about to drop the column `reactionScore` on the `review_comments` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `review_comments` table. All the data in the column will be lost.
  - You are about to drop the column `compensationDescriptionCommentId` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `compensationRating` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `cultureDescriptionCommentId` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `guestDescriptionCommentId` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `idealForCommentId` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `overallDescriptionCommentId` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `overallRating` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `workplace_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `workplace_reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[review_id]` on the table `experience_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[overall_description_comment_id]` on the table `experience_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fnb_description_comment_id]` on the table `experience_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vibe_description_comment_id]` on the table `experience_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[review_comment_id,user_id]` on the table `review_comment_reactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[review_id]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[overall_description_comment_id]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[compensation_description_comment_id]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guest_description_comment_id]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[culture_description_comment_id]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ideal_for_comment_id]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `overall_description_comment_id` to the `experience_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overall_rating` to the `experience_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review_id` to the `experience_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review_comment_id` to the `review_comment_reactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `review_comment_reactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review_id` to the `review_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overall_description_comment_id` to the `workplace_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overall_rating` to the `workplace_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review_id` to the `workplace_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "experience_reviews" DROP CONSTRAINT "experience_reviews_fnbDescriptionCommentId_fkey";

-- DropForeignKey
ALTER TABLE "experience_reviews" DROP CONSTRAINT "experience_reviews_overallDescriptionCommentId_fkey";

-- DropForeignKey
ALTER TABLE "experience_reviews" DROP CONSTRAINT "experience_reviews_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "experience_reviews" DROP CONSTRAINT "experience_reviews_vibeDescriptionCommentId_fkey";

-- DropForeignKey
ALTER TABLE "review_comment_reactions" DROP CONSTRAINT "review_comment_reactions_reviewCommentId_fkey";

-- DropForeignKey
ALTER TABLE "review_comment_reactions" DROP CONSTRAINT "review_comment_reactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "review_comments" DROP CONSTRAINT "review_comments_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "workplace_reviews" DROP CONSTRAINT "workplace_reviews_compensationDescriptionCommentId_fkey";

-- DropForeignKey
ALTER TABLE "workplace_reviews" DROP CONSTRAINT "workplace_reviews_cultureDescriptionCommentId_fkey";

-- DropForeignKey
ALTER TABLE "workplace_reviews" DROP CONSTRAINT "workplace_reviews_guestDescriptionCommentId_fkey";

-- DropForeignKey
ALTER TABLE "workplace_reviews" DROP CONSTRAINT "workplace_reviews_idealForCommentId_fkey";

-- DropForeignKey
ALTER TABLE "workplace_reviews" DROP CONSTRAINT "workplace_reviews_overallDescriptionCommentId_fkey";

-- DropForeignKey
ALTER TABLE "workplace_reviews" DROP CONSTRAINT "workplace_reviews_reviewId_fkey";

-- DropIndex
DROP INDEX "experience_reviews_fnbDescriptionCommentId_key";

-- DropIndex
DROP INDEX "experience_reviews_overallDescriptionCommentId_key";

-- DropIndex
DROP INDEX "experience_reviews_reviewId_key";

-- DropIndex
DROP INDEX "experience_reviews_vibeDescriptionCommentId_key";

-- DropIndex
DROP INDEX "review_comment_reactions_reviewCommentId_userId_key";

-- DropIndex
DROP INDEX "workplace_reviews_compensationDescriptionCommentId_key";

-- DropIndex
DROP INDEX "workplace_reviews_cultureDescriptionCommentId_key";

-- DropIndex
DROP INDEX "workplace_reviews_guestDescriptionCommentId_key";

-- DropIndex
DROP INDEX "workplace_reviews_idealForCommentId_key";

-- DropIndex
DROP INDEX "workplace_reviews_overallDescriptionCommentId_key";

-- DropIndex
DROP INDEX "workplace_reviews_reviewId_key";

-- AlterTable
ALTER TABLE "experience_reviews" DROP COLUMN "createdAt",
DROP COLUMN "fnbDescriptionCommentId",
DROP COLUMN "fnbRating",
DROP COLUMN "overallDescriptionCommentId",
DROP COLUMN "overallRating",
DROP COLUMN "reviewId",
DROP COLUMN "updatedAt",
DROP COLUMN "vibeDescriptionCommentId",
DROP COLUMN "vibeRating",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fnb_description_comment_id" TEXT,
ADD COLUMN     "fnb_rating" INTEGER,
ADD COLUMN     "overall_description_comment_id" TEXT NOT NULL,
ADD COLUMN     "overall_rating" INTEGER NOT NULL,
ADD COLUMN     "review_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "vibe_description_comment_id" TEXT,
ADD COLUMN     "vibe_rating" INTEGER;

-- AlterTable
ALTER TABLE "places" DROP COLUMN "experienceScore",
DROP COLUMN "workplaceScore",
ADD COLUMN     "compensation_score" DOUBLE PRECISION,
ADD COLUMN     "experience_score" DOUBLE PRECISION,
ADD COLUMN     "workplace_score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "review_comment_reactions" DROP COLUMN "reviewCommentId",
DROP COLUMN "userId",
ADD COLUMN     "review_comment_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "review_comments" DROP COLUMN "numberOfAgreements",
DROP COLUMN "numberOfReactions",
DROP COLUMN "reactionScore",
DROP COLUMN "reviewId",
ADD COLUMN     "number_of_agreements" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "number_of_reactions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reaction_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "review_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "workplace_reviews" DROP COLUMN "compensationDescriptionCommentId",
DROP COLUMN "compensationRating",
DROP COLUMN "createdAt",
DROP COLUMN "cultureDescriptionCommentId",
DROP COLUMN "guestDescriptionCommentId",
DROP COLUMN "idealForCommentId",
DROP COLUMN "overallDescriptionCommentId",
DROP COLUMN "overallRating",
DROP COLUMN "reviewId",
DROP COLUMN "updatedAt",
ADD COLUMN     "compensation_description_comment_id" TEXT,
ADD COLUMN     "compensation_rating" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "culture_description_comment_id" TEXT,
ADD COLUMN     "guest_description_comment_id" TEXT,
ADD COLUMN     "ideal_for_comment_id" TEXT,
ADD COLUMN     "overall_description_comment_id" TEXT NOT NULL,
ADD COLUMN     "overall_rating" INTEGER NOT NULL,
ADD COLUMN     "review_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "experience_reviews_review_id_key" ON "experience_reviews"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "experience_reviews_overall_description_comment_id_key" ON "experience_reviews"("overall_description_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "experience_reviews_fnb_description_comment_id_key" ON "experience_reviews"("fnb_description_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "experience_reviews_vibe_description_comment_id_key" ON "experience_reviews"("vibe_description_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_comment_reactions_review_comment_id_user_id_key" ON "review_comment_reactions"("review_comment_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_review_id_key" ON "workplace_reviews"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_overall_description_comment_id_key" ON "workplace_reviews"("overall_description_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_compensation_description_comment_id_key" ON "workplace_reviews"("compensation_description_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_guest_description_comment_id_key" ON "workplace_reviews"("guest_description_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_culture_description_comment_id_key" ON "workplace_reviews"("culture_description_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_ideal_for_comment_id_key" ON "workplace_reviews"("ideal_for_comment_id");

-- AddForeignKey
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comment_reactions" ADD CONSTRAINT "review_comment_reactions_review_comment_id_fkey" FOREIGN KEY ("review_comment_id") REFERENCES "review_comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comment_reactions" ADD CONSTRAINT "review_comment_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_overall_description_comment_id_fkey" FOREIGN KEY ("overall_description_comment_id") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_compensation_description_comment_id_fkey" FOREIGN KEY ("compensation_description_comment_id") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_guest_description_comment_id_fkey" FOREIGN KEY ("guest_description_comment_id") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_culture_description_comment_id_fkey" FOREIGN KEY ("culture_description_comment_id") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_ideal_for_comment_id_fkey" FOREIGN KEY ("ideal_for_comment_id") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_overall_description_comment_id_fkey" FOREIGN KEY ("overall_description_comment_id") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_fnb_description_comment_id_fkey" FOREIGN KEY ("fnb_description_comment_id") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_vibe_description_comment_id_fkey" FOREIGN KEY ("vibe_description_comment_id") REFERENCES "review_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
