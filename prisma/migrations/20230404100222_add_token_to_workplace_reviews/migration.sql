/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `workplace_reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `workplace_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workplace_reviews" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workplace_reviews_token_key" ON "workplace_reviews"("token");

-- AddForeignKey
ALTER TABLE "workplace_reviews" ADD CONSTRAINT "workplace_reviews_token_fkey" FOREIGN KEY ("token") REFERENCES "workplace_review_tokens"("token") ON DELETE RESTRICT ON UPDATE CASCADE;
