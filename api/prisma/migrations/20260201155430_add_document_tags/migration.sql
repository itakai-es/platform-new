-- AlterTable
ALTER TABLE "mission_documents" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
