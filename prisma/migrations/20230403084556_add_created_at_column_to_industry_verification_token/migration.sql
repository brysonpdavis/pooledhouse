/*
  Warnings:

  - You are about to drop the column `expires` on the `industry_verification_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "industry_verification_tokens" DROP COLUMN "expires",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
