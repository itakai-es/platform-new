-- Rename AssistantId enum value posido -> poseidon
ALTER TYPE "AssistantId" RENAME VALUE 'posido' TO 'poseidon';

-- Backfill avatar URLs in class_enrollments to match real SVG filenames
UPDATE "class_enrollments" SET "avatar_url" = REPLACE("avatar_url", '/app/avatars/odisseu.svg', '/app/avatars/odiseo.svg') WHERE "avatar_url" LIKE '%/app/avatars/odisseu.svg%';
UPDATE "class_enrollments" SET "avatar_url" = REPLACE("avatar_url", '/app/avatars/polifem.svg', '/app/avatars/polifemo.svg') WHERE "avatar_url" LIKE '%/app/avatars/polifem.svg%';
UPDATE "class_enrollments" SET "avatar_url" = REPLACE("avatar_url", '/app/avatars/posido.svg', '/app/avatars/poseidon.svg') WHERE "avatar_url" LIKE '%/app/avatars/posido.svg%';

-- Backfill avatar URLs in activities (Activity.avatar)
UPDATE "activities" SET "avatar" = REPLACE("avatar", '/app/avatars/odisseu.svg', '/app/avatars/odiseo.svg') WHERE "avatar" LIKE '%/app/avatars/odisseu.svg%';
UPDATE "activities" SET "avatar" = REPLACE("avatar", '/app/avatars/polifem.svg', '/app/avatars/polifemo.svg') WHERE "avatar" LIKE '%/app/avatars/polifem.svg%';
UPDATE "activities" SET "avatar" = REPLACE("avatar", '/app/avatars/posido.svg', '/app/avatars/poseidon.svg') WHERE "avatar" LIKE '%/app/avatars/posido.svg%';
