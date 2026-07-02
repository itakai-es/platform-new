-- AlterEnum: extend ActivityType with behavior_applied, shop_purchased, shop_item_used
ALTER TYPE "ActivityType" ADD VALUE 'behavior_applied';
ALTER TYPE "ActivityType" ADD VALUE 'shop_purchased';
ALTER TYPE "ActivityType" ADD VALUE 'shop_item_used';
