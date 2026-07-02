-- Add auto-unlock trigger columns to Badge.
-- System badges (teacher_id IS NULL) use these to auto-award when a student
-- crosses the threshold. Teacher-owned badges leave them NULL.
ALTER TABLE "badges" ADD COLUMN "trigger_type" TEXT;
ALTER TABLE "badges" ADD COLUMN "trigger_value" INTEGER;

CREATE INDEX "badges_trigger_type_trigger_value_idx" ON "badges" ("trigger_type", "trigger_value");
