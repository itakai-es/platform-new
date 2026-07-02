-- AlterTable
ALTER TABLE "class_enrollments" ADD COLUMN     "lives" INTEGER NOT NULL DEFAULT 100;

-- CreateTable
CREATE TABLE "behavior_templates" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "xp_delta" INTEGER NOT NULL DEFAULT 0,
    "coin_delta" INTEGER NOT NULL DEFAULT 0,
    "life_delta" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "behavior_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_applications" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "behavior_id" TEXT,
    "teacher_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "xp_delta" INTEGER NOT NULL,
    "coin_delta" INTEGER NOT NULL,
    "life_delta" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "behavior_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "behavior_templates_class_id_idx" ON "behavior_templates"("class_id");

-- CreateIndex
CREATE INDEX "behavior_applications_class_id_idx" ON "behavior_applications"("class_id");

-- CreateIndex
CREATE INDEX "behavior_applications_student_id_class_id_idx" ON "behavior_applications"("student_id", "class_id");

-- AddForeignKey
ALTER TABLE "behavior_templates" ADD CONSTRAINT "behavior_templates_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_applications" ADD CONSTRAINT "behavior_applications_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_applications" ADD CONSTRAINT "behavior_applications_behavior_id_fkey" FOREIGN KEY ("behavior_id") REFERENCES "behavior_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_applications" ADD CONSTRAINT "behavior_applications_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_applications" ADD CONSTRAINT "behavior_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
