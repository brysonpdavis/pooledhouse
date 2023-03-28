/*
  Warnings:

  - You are about to drop the column `emailVerifiedAt` on the `contact_verifications` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `contact_verifications` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerifiedAt` on the `contact_verifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact_verifications" DROP COLUMN "emailVerifiedAt",
DROP COLUMN "expiresAt",
DROP COLUMN "phoneVerifiedAt",
ADD COLUMN     "email_verification_code_sent_at" TEXT,
ADD COLUMN     "email_verified_at" TIMESTAMP(3),
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "phone_verification_code_sent_at" TEXT,
ADD COLUMN     "phone_verified_at" TIMESTAMP(3);
