-- AlterTable
ALTER TABLE "class_enrollments" ADD COLUMN     "mana" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "mission_enigmas" ADD COLUMN     "coin_reward" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mana_reward" INTEGER NOT NULL DEFAULT 0;
