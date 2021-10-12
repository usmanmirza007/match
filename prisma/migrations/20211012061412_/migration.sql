/*
  Warnings:

  - You are about to alter the column `discount` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `UnsignedInt`.

*/
-- DropIndex
DROP INDEX `Product_company_key` ON `Product`;

-- AlterTable
ALTER TABLE `Product` MODIFY `country` VARCHAR(191) NOT NULL,
    MODIFY `contact` VARCHAR(191) NOT NULL,
    MODIFY `discount` INTEGER UNSIGNED NOT NULL,
    ALTER COLUMN `select_plan` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Merchant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Merchant_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
