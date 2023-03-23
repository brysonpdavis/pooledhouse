/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[industryVerificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_by_user_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "created_by_user_id" TEXT NOT NULL,
ADD COLUMN     "lastEdited" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "industryVerificationToken" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "IndustryVerificationToken" (
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_by_user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "IndustryVerificationToken_token_key" ON "IndustryVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_industryVerificationToken_key" ON "users"("industryVerificationToken");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_industryVerificationToken_fkey" FOREIGN KEY ("industryVerificationToken") REFERENCES "IndustryVerificationToken"("token") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryVerificationToken" ADD CONSTRAINT "IndustryVerificationToken_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
