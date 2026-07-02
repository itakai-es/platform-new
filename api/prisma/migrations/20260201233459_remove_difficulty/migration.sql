-- AlterTable: Remove difficulty column from missions
ALTER TABLE "missions" DROP COLUMN "difficulty";

-- DropEnum: Remove MissionDifficulty enum
DROP TYPE "MissionDifficulty";
