-- AlterTable
ALTER TABLE "shop_items" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'reward',
ADD COLUMN     "mana_cost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" TEXT NOT NULL DEFAULT 'single';

-- CreateTable
CREATE TABLE "shop_item_uses" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "item_id" TEXT,
    "student_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "mana_cost" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shop_item_uses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shop_item_uses_class_id_idx" ON "shop_item_uses"("class_id");

-- CreateIndex
CREATE INDEX "shop_item_uses_student_id_class_id_idx" ON "shop_item_uses"("student_id", "class_id");

-- AddForeignKey
ALTER TABLE "shop_item_uses" ADD CONSTRAINT "shop_item_uses_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_item_uses" ADD CONSTRAINT "shop_item_uses_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "shop_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_item_uses" ADD CONSTRAINT "shop_item_uses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
