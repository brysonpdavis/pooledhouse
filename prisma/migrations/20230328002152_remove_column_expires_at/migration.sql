/*
  Warnings:

  - You are about to drop the column `expires_at` on the `contact_verifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact_verifications" DROP COLUMN "expires_at";
