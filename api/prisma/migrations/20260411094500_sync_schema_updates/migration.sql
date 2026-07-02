-- CreateEnum
CREATE TYPE "SystemLogLevel" AS ENUM ('info', 'warning', 'error', 'success');

-- CreateEnum
CREATE TYPE "SystemLogCategory" AS ENUM ('health_check', 'service_status', 'security', 'performance', 'maintenance', 'backup');

-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'student_enrolled';
ALTER TYPE "ActivityType" ADD VALUE 'progress_milestone';

-- DropForeignKey
ALTER TABLE "student_achievements" DROP CONSTRAINT "student_achievements_achievement_id_fkey";

-- DropForeignKey
ALTER TABLE "student_achievements" DROP CONSTRAINT "student_achievements_student_id_fkey";

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "achievement_name" TEXT,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "badge_image" TEXT,
ADD COLUMN     "badge_name" TEXT,
ADD COLUMN     "badge_rarity" TEXT,
ADD COLUMN     "class_id" TEXT,
ADD COLUMN     "class_name" TEXT,
ADD COLUMN     "enigma_title" TEXT,
ADD COLUMN     "enigma_xp" INTEGER,
ADD COLUMN     "mission_title" TEXT,
ADD COLUMN     "mission_xp" INTEGER,
ADD COLUMN     "new_level" INTEGER,
ADD COLUMN     "new_title" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "teacher_name" TEXT,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "xp_amount" INTEGER;

-- AlterTable
ALTER TABLE "chat_conversations" ADD COLUMN     "class_id" TEXT,
ADD COLUMN     "mission_id" TEXT;

-- AlterTable
ALTER TABLE "class_enrollments" DROP COLUMN "guide_id";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "description",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "narrative" TEXT;

-- AlterTable
ALTER TABLE "mission_enigmas" ADD COLUMN     "is_optional" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "missions" DROP COLUMN "xp_reward";

-- DropTable
DROP TABLE "achievements";

-- DropTable
DROP TABLE "student_achievements";

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "mission_reminders" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'es',
    "theme" TEXT NOT NULL DEFAULT 'college',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "level" "SystemLogLevel" NOT NULL,
    "category" "SystemLogCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "service" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "system_logs_created_at_idx" ON "system_logs"("created_at");

-- CreateIndex
CREATE INDEX "system_logs_level_idx" ON "system_logs"("level");

-- CreateIndex
CREATE INDEX "system_logs_category_idx" ON "system_logs"("category");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
