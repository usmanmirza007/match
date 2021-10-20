/*
  Warnings:

  - You are about to drop the column `merchantId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_merchantId_fkey`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `merchantId`,
    ADD COLUMN `adminId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
