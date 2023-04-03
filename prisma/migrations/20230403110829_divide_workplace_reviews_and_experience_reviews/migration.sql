/*
  Warnings:

  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "industry_verification_tokens" DROP CONSTRAINT "industry_verification_tokens_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_place_id_fkey";

-- DropTable
DROP TABLE "reviews";

-- CreateTable
CREATE TABLE "workplace_reviews" (
    "id" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "lastEdited" TIMESTAMP(3),

    CONSTRAINT "workplace_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_reviews" (
    "id" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,

    CONSTRAINT "experience_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workplace_review_tokens" (
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "associated_by_user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "workplace_review_tokens_token_key" ON "workplace_review_tokens"("token");

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_reviews" ADD CONSTRAINT "experience_reviews_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_verification_tokens" ADD CONSTRAINT "industry_verification_tokens_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_review_tokens" ADD CONSTRAINT "workplace_review_tokens_associated_by_user_id_fkey" FOREIGN KEY ("associated_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
