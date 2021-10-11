-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `country` VARCHAR(15) NOT NULL,
    `contact` INTEGER NOT NULL,
    `discount` VARCHAR(191) NOT NULL,
    `select_plan` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `Product_company_key`(`company`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
