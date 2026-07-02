-- AlterTable
ALTER TABLE "student_enigma_progress" ADD COLUMN     "coins_earned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mana_earned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "percentage" INTEGER NOT NULL DEFAULT 100;
