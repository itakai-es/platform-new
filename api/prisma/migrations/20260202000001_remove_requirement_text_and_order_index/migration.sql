-- AlterTable: Remove requirement_text and order_index columns from missions
ALTER TABLE "missions" DROP COLUMN "requirement_text";
ALTER TABLE "missions" DROP COLUMN "order_index";
