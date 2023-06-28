-- AlterTable
ALTER TABLE "industry_verification_tokens" ADD CONSTRAINT "industry_verification_tokens_pkey" PRIMARY KEY ("token");

-- AlterTable
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("token");

-- AlterTable
ALTER TABLE "workplace_review_tokens" ADD CONSTRAINT "workplace_review_tokens_pkey" PRIMARY KEY ("token");
