-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('pendiente', 'aprobada');
ALTER TABLE "enigma_submissions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "enigma_submissions" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
ALTER TABLE "enigma_submissions" ALTER COLUMN "status" SET DEFAULT 'pendiente';
COMMIT;
