-- AlterTable
ALTER TABLE "contact_verifications" ADD COLUMN     "industryVerificationToken" TEXT;

-- AddForeignKey
ALTER TABLE "contact_verifications" ADD CONSTRAINT "contact_verifications_industryVerificationToken_fkey" FOREIGN KEY ("industryVerificationToken") REFERENCES "industry_verification_tokens"("token") ON DELETE SET NULL ON UPDATE CASCADE;
