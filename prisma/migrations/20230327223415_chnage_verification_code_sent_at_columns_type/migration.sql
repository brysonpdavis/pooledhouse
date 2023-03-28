/*
  Warnings:

  - The `email_verification_code_sent_at` column on the `contact_verifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `phone_verification_code_sent_at` column on the `contact_verifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "contact_verifications" DROP COLUMN "email_verification_code_sent_at",
ADD COLUMN     "email_verification_code_sent_at" TIMESTAMP(3),
DROP COLUMN "phone_verification_code_sent_at",
ADD COLUMN     "phone_verification_code_sent_at" TIMESTAMP(3);
