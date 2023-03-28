/*
  Warnings:

  - You are about to drop the `IndustryVerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IndustryVerificationToken" DROP CONSTRAINT "IndustryVerificationToken_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_industryVerificationToken_fkey";

-- DropTable
DROP TABLE "IndustryVerificationToken";

-- CreateTable
CREATE TABLE "industry_verification_tokens" (
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_by_user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "contact_verifications" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "phone" TEXT NOT NULL,
    "phoneVerifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "industry_verification_tokens_token_key" ON "industry_verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "contact_verifications_email_phone_key" ON "contact_verifications"("email", "phone");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_industryVerificationToken_fkey" FOREIGN KEY ("industryVerificationToken") REFERENCES "industry_verification_tokens"("token") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_verification_tokens" ADD CONSTRAINT "industry_verification_tokens_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
