-- Valentina Studio --
-- MySQL dump --
-- ---------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
-- ---------------------------------------------------------


-- CREATE TABLE "Expense" --------------------------------------
CREATE TABLE `Expense`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`date` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`type` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`amount` Decimal( 12, 2 ) NOT NULL,
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`createdBy` Int( 0 ) NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "Item" -----------------------------------------
CREATE TABLE `Item`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`name` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`unit` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`minStock` Decimal( 10, 3 ) NOT NULL DEFAULT 0.000,
	`stock` Decimal( 12, 3 ) NOT NULL DEFAULT 0.000,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`updatedAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB;
-- -------------------------------------------------------------


-- CREATE TABLE "Production" -----------------------------------
CREATE TABLE `Production`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`name` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`producedAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`createdById` Int( 0 ) NULL DEFAULT NULL,
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`updatedAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "ProductionItem" -------------------------------
CREATE TABLE `ProductionItem`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`productionId` Int( 0 ) NOT NULL,
	`itemId` Int( 0 ) NOT NULL,
	`qtyUsed` Decimal( 12, 3 ) NOT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "PurchaseOrder" --------------------------------
CREATE TABLE `PurchaseOrder`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`itemId` Int( 0 ) NOT NULL,
	`qtyOrdered` Decimal( 12, 3 ) NOT NULL,
	`status` Enum( 'PENDING', 'APPROVED', 'REJECTED', 'RECEIVED', 'CANCELLED' ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
	`createdById` Int( 0 ) NULL DEFAULT NULL,
	`approvedById` Int( 0 ) NULL DEFAULT NULL,
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`updatedAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`resolvedAt` DateTime NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "PurchaseRequest" ------------------------------
CREATE TABLE `PurchaseRequest`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`itemId` Int( 0 ) NOT NULL,
	`qty` Decimal( 12, 3 ) NOT NULL,
	`requestedBy` Int( 0 ) NULL DEFAULT NULL,
	`status` Enum( 'REQUESTED', 'APPROVED', 'REJECTED', 'ORDERED', 'CANCELLED' ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REQUESTED',
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`updatedAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "Sale" -----------------------------------------
CREATE TABLE `Sale`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`date` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`createdBy` Int( 0 ) NULL DEFAULT NULL,
	`total` Decimal( 12, 2 ) NOT NULL,
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "SaleItem" -------------------------------------
CREATE TABLE `SaleItem`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`saleId` Int( 0 ) NOT NULL,
	`itemId` Int( 0 ) NULL DEFAULT NULL,
	`name` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`qty` Decimal( 12, 3 ) NOT NULL,
	`unitPrice` Decimal( 12, 2 ) NOT NULL,
	`total` Decimal( 12, 2 ) NOT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "ShoppingLog" ----------------------------------
CREATE TABLE `ShoppingLog`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`buyerId` Int( 0 ) NULL DEFAULT NULL,
	`date` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`total` Decimal( 12, 2 ) NOT NULL DEFAULT 0.00,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "ShoppingLogItem" ------------------------------
CREATE TABLE `ShoppingLogItem`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`shoppingLogId` Int( 0 ) NOT NULL,
	`itemId` Int( 0 ) NULL DEFAULT NULL,
	`name` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`qty` Decimal( 12, 3 ) NOT NULL,
	`unitPrice` Decimal( 12, 2 ) NOT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "StockOpname" ----------------------------------
CREATE TABLE `StockOpname`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`date` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`createdBy` Int( 0 ) NULL DEFAULT NULL,
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "StockOpnameItem" ------------------------------
CREATE TABLE `StockOpnameItem`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`stockOpnameId` Int( 0 ) NOT NULL,
	`itemId` Int( 0 ) NOT NULL,
	`qtyPhysical` Decimal( 12, 3 ) NOT NULL,
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "StockTransaction" -----------------------------
CREATE TABLE `StockTransaction`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`itemId` Int( 0 ) NOT NULL,
	`qty` Decimal( 12, 3 ) NOT NULL,
	`type` Enum( 'IN', 'OUT' ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`unitPrice` Decimal( 12, 2 ) NULL DEFAULT NULL,
	`note` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`createdBy` Int( 0 ) NULL DEFAULT NULL,
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- CREATE TABLE "User" -----------------------------------------
CREATE TABLE `User`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`email` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`password` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`name` VarChar( 191 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`role` Enum( 'ADMIN', 'WAREHOUSE', 'KITCHEN' ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WAREHOUSE',
	`createdAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`updatedAt` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	PRIMARY KEY ( `id` ),
	CONSTRAINT `User_email_key` UNIQUE( `email` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB;
-- -------------------------------------------------------------


-- CREATE TABLE "_prisma_migrations" ---------------------------
CREATE TABLE `_prisma_migrations`( 
	`id` VarChar( 36 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`checksum` VarChar( 64 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`finished_at` DateTime NULL DEFAULT NULL,
	`migration_name` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`logs` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`rolled_back_at` DateTime NULL DEFAULT NULL,
	`started_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(3)',
	`applied_steps_count` Int( 0 ) UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB;
-- -------------------------------------------------------------


-- Dump data of "Expense" ----------------------------------
BEGIN;

INSERT INTO `Expense`(`id`,`date`,`type`,`amount`,`note`,`createdAt`,`createdBy`) VALUES 
( '1', '2025-12-02 11:29:34.000', 'Utilities', '300000.00', 'Listrik & gas', '2025-12-02 11:29:34.306', '1' ),
( '2', '2025-12-02 11:29:34.000', 'Transport', '50000.00', 'Ongkos belanja', '2025-12-02 11:29:34.306', '3' ),
( '3', '2025-12-02 11:29:34.000', 'Packaging', '75000.00', 'Plastik & box roti', '2025-12-02 11:29:34.306', '2' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "Item" -------------------------------------
BEGIN;

INSERT INTO `Item`(`id`,`name`,`unit`,`minStock`,`stock`,`createdAt`,`updatedAt`) VALUES 
( '1', 'Tepung Terigu', 'kg', '10.000', '80.000', '2025-12-02 11:27:24.138', '2025-12-03 02:18:15.017' ),
( '2', 'Gula Pasir', 'kg', '5.000', '19.500', '2025-12-02 11:27:24.138', '2025-12-03 02:18:15.054' ),
( '3', 'Telur Ayam', 'butir', '30.000', '210.000', '2025-12-02 11:27:24.138', '2025-12-02 21:04:01.519' ),
( '4', 'Mentega', 'kg', '3.000', '15.000', '2025-12-02 11:27:24.138', '2025-12-02 11:27:24.138' ),
( '5', 'Roti Sobek', 'pcs', '0.000', '0.000', '2025-12-02 11:27:24.138', '2025-12-02 11:27:24.138' ),
( '6', 'Kue Coklat', 'pcs', '0.000', '0.000', '2025-12-02 11:27:24.138', '2025-12-02 11:27:24.138' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "Production" -------------------------------
BEGIN;

INSERT INTO `Production`(`id`,`name`,`producedAt`,`createdById`,`note`,`createdAt`,`updatedAt`) VALUES 
( '1', 'Produksi Roti Sobek 100 pcs', '2025-12-02 11:29:05.000', '3', 'Produksi pagi', '2025-12-02 11:29:05.120', '2025-12-02 11:29:05.120' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "ProductionItem" ---------------------------
BEGIN;

INSERT INTO `ProductionItem`(`id`,`productionId`,`itemId`,`qtyUsed`) VALUES 
( '1', '1', '1', '10.000' ),
( '2', '1', '2', '2.000' ),
( '3', '1', '3', '30.000' ),
( '4', '1', '4', '2.000' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "PurchaseOrder" ----------------------------
BEGIN;

INSERT INTO `PurchaseOrder`(`id`,`itemId`,`qtyOrdered`,`status`,`createdById`,`approvedById`,`note`,`createdAt`,`updatedAt`,`resolvedAt`) VALUES 
( '1', '4', '5.000', 'APPROVED', '2', '1', 'PO Mentega setelah request gudang', '2025-12-02 11:28:20.781', '2025-12-02 11:28:20.781', NULL ),
( '2', '3', '10.000', 'RECEIVED', '2', '1', 'Pemesanan dari PR #1', '2025-12-02 20:59:47.135', '2025-12-02 21:04:01.532', '2025-12-02 21:04:01.526' ),
( '3', '1', '20.000', 'RECEIVED', '2', '1', 'Pemesanan dari PR #3', '2025-12-02 21:12:42.519', '2025-12-02 21:13:30.329', '2025-12-02 21:13:30.324' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "PurchaseRequest" --------------------------
BEGIN;

INSERT INTO `PurchaseRequest`(`id`,`itemId`,`qty`,`requestedBy`,`status`,`note`,`createdAt`,`updatedAt`) VALUES 
( '1', '4', '5.000', '2', 'APPROVED', 'Request restock mentega untuk produksi minggu depan', '2025-12-02 11:28:05.123', '2025-12-02 11:28:12.000' ),
( '2', '3', '10.000', '2', 'APPROVED', 'Disetujui oleh owner', '2025-12-02 17:24:09.212', '2025-12-02 20:59:03.502' ),
( '3', '1', '20.000', '2', 'APPROVED', 'Disetujui oleh owner', '2025-12-02 21:11:07.026', '2025-12-02 21:11:50.974' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "Sale" -------------------------------------
BEGIN;

INSERT INTO `Sale`(`id`,`date`,`createdBy`,`total`,`note`,`createdAt`) VALUES 
( '1', '2025-12-02 11:29:27.000', '1', '550000.00', 'Penjualan harian', '2025-12-02 11:29:27.481' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "SaleItem" ---------------------------------
BEGIN;

INSERT INTO `SaleItem`(`id`,`saleId`,`itemId`,`name`,`qty`,`unitPrice`,`total`) VALUES 
( '1', '1', '5', 'Roti Sobek', '80.000', '5000.00', '400000.00' ),
( '2', '1', '6', 'Kue Coklat', '15.000', '10000.00', '150000.00' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "ShoppingLog" ------------------------------
BEGIN;

INSERT INTO `ShoppingLog`(`id`,`buyerId`,`date`,`note`,`total`,`createdAt`) VALUES 
( '1', '3', '2025-12-02 11:28:30.000', 'Belanja harian tambahan gula & telur', '155000.00', '2025-12-02 11:28:30.089' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "ShoppingLogItem" --------------------------
BEGIN;

INSERT INTO `ShoppingLogItem`(`id`,`shoppingLogId`,`itemId`,`name`,`qty`,`unitPrice`) VALUES 
( '1', '1', '2', 'Gula Pasir', '5.000', '15000.00' ),
( '2', '1', '3', 'Telur Ayam', '30.000', '3500.00' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "StockOpname" ------------------------------
BEGIN;

INSERT INTO `StockOpname`(`id`,`date`,`createdBy`,`note`,`createdAt`) VALUES 
( '1', '2025-12-02 11:27:34.000', '2', 'Opname Mingguan - Minggu Ke-1', '2025-12-02 11:27:34.087' ),
( '2', '2025-12-03 02:18:14.922', '2', 'Opname minggu ke-2', '2025-12-03 02:18:14.938' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "StockOpnameItem" --------------------------
BEGIN;

INSERT INTO `StockOpnameItem`(`id`,`stockOpnameId`,`itemId`,`qtyPhysical`,`note`) VALUES 
( '1', '1', '1', '48.000', 'Selisih -2 kg' ),
( '2', '1', '2', '19.000', 'Selisih -1 kg' ),
( '3', '1', '3', '195.000', 'Selisih -5 butir' ),
( '4', '1', '4', '15.000', 'Cocok, tidak selisih' ),
( '5', '2', '1', '80.000', 'Rak A' ),
( '6', '2', '2', '19.500', 'Rak B' ),
( '7', '2', '3', '210.000', 'New' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "StockTransaction" -------------------------
BEGIN;

INSERT INTO `StockTransaction`(`id`,`itemId`,`qty`,`type`,`unitPrice`,`note`,`createdBy`,`createdAt`) VALUES 
( '1', '1', '2.000', 'OUT', NULL, 'Koreksi opname: Tepung -2 kg', '2', '2025-12-02 11:27:56.332' ),
( '2', '2', '1.000', 'OUT', NULL, 'Koreksi opname: Gula -1 kg', '2', '2025-12-02 11:27:56.332' ),
( '3', '3', '5.000', 'OUT', NULL, 'Koreksi opname: Telur -5', '2', '2025-12-02 11:27:56.332' ),
( '4', '2', '5.000', 'IN', '15000.00', 'Penerimaan belanja gula (Shopping Log)', '2', '2025-12-02 11:28:47.891' ),
( '5', '3', '30.000', 'IN', '3500.00', 'Penerimaan belanja telur (Shopping Log)', '2', '2025-12-02 11:28:47.891' ),
( '6', '4', '5.000', 'IN', '80000.00', 'Penerimaan PO Mentega', '2', '2025-12-02 11:28:58.110' ),
( '7', '1', '10.000', 'OUT', NULL, 'Pemakaian produksi roti sobek', '2', '2025-12-02 11:29:14.819' ),
( '8', '2', '2.000', 'OUT', NULL, 'Pemakaian produksi roti sobek', '2', '2025-12-02 11:29:14.819' ),
( '9', '3', '30.000', 'OUT', NULL, 'Pemakaian produksi roti sobek', '2', '2025-12-02 11:29:14.819' ),
( '10', '4', '2.000', 'OUT', NULL, 'Pemakaian produksi roti sobek', '2', '2025-12-02 11:29:14.819' ),
( '11', '5', '100.000', 'IN', NULL, 'Hasil produksi roti sobek', '2', '2025-12-02 11:29:20.630' ),
( '12', '1', '10.000', 'IN', '12000.00', 'Barang masuk dari supplier A', '2', '2025-12-02 16:59:53.868' ),
( '13', '1', '5.000', 'OUT', '12000.00', 'Dikasih orang', '2', '2025-12-02 17:01:57.115' ),
( '14', '3', '10.000', 'IN', NULL, 'Diterima dari PO#2', '1', '2025-12-02 21:04:01.492' ),
( '15', '1', '20.000', 'IN', '12000.00', 'Diterima dari PO#3', '1', '2025-12-02 21:13:30.283' ),
( '16', '1', '5.000', 'IN', NULL, 'Opname#2 koreksi (physical 80 vs system 75)', '2', '2025-12-03 02:18:14.998' ),
( '17', '2', '0.500', 'OUT', NULL, 'Opname#2 koreksi (physical 19.5 vs system 20)', '2', '2025-12-03 02:18:15.045' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "User" -------------------------------------
BEGIN;

INSERT INTO `User`(`id`,`email`,`password`,`name`,`role`,`createdAt`,`updatedAt`) VALUES 
( '1', 'admin@toko.com', '$2b$12$k/my.CYzgVLyKziJ.abDmerhTpNOaPC1OQyx34gzr7Y2W72.Cir0O', 'Pemilik Toko', 'ADMIN', '2025-12-02 11:27:09.755', '2025-12-02 11:27:09.755' ),
( '2', 'warehouse@toko.com', '$2b$12$k/my.CYzgVLyKziJ.abDmerhTpNOaPC1OQyx34gzr7Y2W72.Cir0O', 'Tim Gudang', 'WAREHOUSE', '2025-12-02 11:27:09.755', '2025-12-02 11:27:09.755' ),
( '3', 'kitchen@toko.com', '$2b$12$k/my.CYzgVLyKziJ.abDmerhTpNOaPC1OQyx34gzr7Y2W72.Cir0O', 'Tim Dapur', 'KITCHEN', '2025-12-02 11:27:09.755', '2025-12-02 11:27:09.755' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "_prisma_migrations" -----------------------
BEGIN;

INSERT INTO `_prisma_migrations`(`id`,`checksum`,`finished_at`,`migration_name`,`logs`,`rolled_back_at`,`started_at`,`applied_steps_count`) VALUES 
( '2e03c1b7-bd93-441f-9a81-2c060477e682', '6cc61b073022791371cae16be747c89fc055d9143ebc1b94131f604f78969826', '2025-12-02 11:10:32.245', '20251202111032_update_at_default_value', NULL, NULL, '2025-12-02 11:10:32.132', '1' ),
( 'f540cade-a382-463e-a4f0-3e84e2550b8c', 'd1627a894006ca1d5b154d642eff7a4ac5dbb66160dd4264d556fa7d938a526a', '2025-12-02 10:31:26.286', '20251202103124_init', NULL, NULL, '2025-12-02 10:31:24.849', '1' );
COMMIT;
-- ---------------------------------------------------------


-- CREATE INDEX "Expense_createdBy_fkey" -----------------------
CREATE INDEX `Expense_createdBy_fkey` USING BTREE ON `Expense`( `createdBy` );
-- -------------------------------------------------------------


-- CREATE INDEX "Expense_date_idx" -----------------------------
CREATE INDEX `Expense_date_idx` USING BTREE ON `Expense`( `date` );
-- -------------------------------------------------------------


-- CREATE INDEX "Item_name_idx" --------------------------------
CREATE INDEX `Item_name_idx` USING BTREE ON `Item`( `name` );
-- -------------------------------------------------------------


-- CREATE INDEX "Production_createdById_fkey" ------------------
CREATE INDEX `Production_createdById_fkey` USING BTREE ON `Production`( `createdById` );
-- -------------------------------------------------------------


-- CREATE INDEX "ProductionItem_itemId_idx" --------------------
CREATE INDEX `ProductionItem_itemId_idx` USING BTREE ON `ProductionItem`( `itemId` );
-- -------------------------------------------------------------


-- CREATE INDEX "ProductionItem_productionId_idx" --------------
CREATE INDEX `ProductionItem_productionId_idx` USING BTREE ON `ProductionItem`( `productionId` );
-- -------------------------------------------------------------


-- CREATE INDEX "PurchaseOrder_approvedById_fkey" --------------
CREATE INDEX `PurchaseOrder_approvedById_fkey` USING BTREE ON `PurchaseOrder`( `approvedById` );
-- -------------------------------------------------------------


-- CREATE INDEX "PurchaseOrder_createdById_fkey" ---------------
CREATE INDEX `PurchaseOrder_createdById_fkey` USING BTREE ON `PurchaseOrder`( `createdById` );
-- -------------------------------------------------------------


-- CREATE INDEX "PurchaseOrder_itemId_idx" ---------------------
CREATE INDEX `PurchaseOrder_itemId_idx` USING BTREE ON `PurchaseOrder`( `itemId` );
-- -------------------------------------------------------------


-- CREATE INDEX "PurchaseOrder_status_idx" ---------------------
CREATE INDEX `PurchaseOrder_status_idx` USING BTREE ON `PurchaseOrder`( `status` );
-- -------------------------------------------------------------


-- CREATE INDEX "PurchaseRequest_itemId_idx" -------------------
CREATE INDEX `PurchaseRequest_itemId_idx` USING BTREE ON `PurchaseRequest`( `itemId` );
-- -------------------------------------------------------------


-- CREATE INDEX "PurchaseRequest_requestedBy_fkey" -------------
CREATE INDEX `PurchaseRequest_requestedBy_fkey` USING BTREE ON `PurchaseRequest`( `requestedBy` );
-- -------------------------------------------------------------


-- CREATE INDEX "PurchaseRequest_status_idx" -------------------
CREATE INDEX `PurchaseRequest_status_idx` USING BTREE ON `PurchaseRequest`( `status` );
-- -------------------------------------------------------------


-- CREATE INDEX "Sale_createdBy_fkey" --------------------------
CREATE INDEX `Sale_createdBy_fkey` USING BTREE ON `Sale`( `createdBy` );
-- -------------------------------------------------------------


-- CREATE INDEX "Sale_date_idx" --------------------------------
CREATE INDEX `Sale_date_idx` USING BTREE ON `Sale`( `date` );
-- -------------------------------------------------------------


-- CREATE INDEX "SaleItem_itemId_idx" --------------------------
CREATE INDEX `SaleItem_itemId_idx` USING BTREE ON `SaleItem`( `itemId` );
-- -------------------------------------------------------------


-- CREATE INDEX "SaleItem_saleId_idx" --------------------------
CREATE INDEX `SaleItem_saleId_idx` USING BTREE ON `SaleItem`( `saleId` );
-- -------------------------------------------------------------


-- CREATE INDEX "ShoppingLog_buyerId_fkey" ---------------------
CREATE INDEX `ShoppingLog_buyerId_fkey` USING BTREE ON `ShoppingLog`( `buyerId` );
-- -------------------------------------------------------------


-- CREATE INDEX "ShoppingLog_date_idx" -------------------------
CREATE INDEX `ShoppingLog_date_idx` USING BTREE ON `ShoppingLog`( `date` );
-- -------------------------------------------------------------


-- CREATE INDEX "ShoppingLogItem_itemId_idx" -------------------
CREATE INDEX `ShoppingLogItem_itemId_idx` USING BTREE ON `ShoppingLogItem`( `itemId` );
-- -------------------------------------------------------------


-- CREATE INDEX "ShoppingLogItem_shoppingLogId_idx" ------------
CREATE INDEX `ShoppingLogItem_shoppingLogId_idx` USING BTREE ON `ShoppingLogItem`( `shoppingLogId` );
-- -------------------------------------------------------------


-- CREATE INDEX "StockOpname_createdBy_fkey" -------------------
CREATE INDEX `StockOpname_createdBy_fkey` USING BTREE ON `StockOpname`( `createdBy` );
-- -------------------------------------------------------------


-- CREATE INDEX "StockOpname_date_idx" -------------------------
CREATE INDEX `StockOpname_date_idx` USING BTREE ON `StockOpname`( `date` );
-- -------------------------------------------------------------


-- CREATE INDEX "StockOpnameItem_itemId_idx" -------------------
CREATE INDEX `StockOpnameItem_itemId_idx` USING BTREE ON `StockOpnameItem`( `itemId` );
-- -------------------------------------------------------------


-- CREATE INDEX "StockOpnameItem_stockOpnameId_idx" ------------
CREATE INDEX `StockOpnameItem_stockOpnameId_idx` USING BTREE ON `StockOpnameItem`( `stockOpnameId` );
-- -------------------------------------------------------------


-- CREATE INDEX "StockTransaction_createdBy_idx" ---------------
CREATE INDEX `StockTransaction_createdBy_idx` USING BTREE ON `StockTransaction`( `createdBy` );
-- -------------------------------------------------------------


-- CREATE INDEX "StockTransaction_itemId_idx" ------------------
CREATE INDEX `StockTransaction_itemId_idx` USING BTREE ON `StockTransaction`( `itemId` );
-- -------------------------------------------------------------


-- CREATE INDEX "StockTransaction_type_idx" --------------------
CREATE INDEX `StockTransaction_type_idx` USING BTREE ON `StockTransaction`( `type` );
-- -------------------------------------------------------------


-- CREATE LINK "Expense_createdBy_fkey" ------------------------
ALTER TABLE `Expense`
	ADD CONSTRAINT `Expense_createdBy_fkey` FOREIGN KEY ( `createdBy` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "ProductionItem_itemId_fkey" --------------------
ALTER TABLE `ProductionItem`
	ADD CONSTRAINT `ProductionItem_itemId_fkey` FOREIGN KEY ( `itemId` )
	REFERENCES `Item`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "ProductionItem_productionId_fkey" --------------
ALTER TABLE `ProductionItem`
	ADD CONSTRAINT `ProductionItem_productionId_fkey` FOREIGN KEY ( `productionId` )
	REFERENCES `Production`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "Production_createdById_fkey" -------------------
ALTER TABLE `Production`
	ADD CONSTRAINT `Production_createdById_fkey` FOREIGN KEY ( `createdById` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "PurchaseOrder_approvedById_fkey" ---------------
ALTER TABLE `PurchaseOrder`
	ADD CONSTRAINT `PurchaseOrder_approvedById_fkey` FOREIGN KEY ( `approvedById` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "PurchaseOrder_createdById_fkey" ----------------
ALTER TABLE `PurchaseOrder`
	ADD CONSTRAINT `PurchaseOrder_createdById_fkey` FOREIGN KEY ( `createdById` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "PurchaseOrder_itemId_fkey" ---------------------
ALTER TABLE `PurchaseOrder`
	ADD CONSTRAINT `PurchaseOrder_itemId_fkey` FOREIGN KEY ( `itemId` )
	REFERENCES `Item`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "PurchaseRequest_itemId_fkey" -------------------
ALTER TABLE `PurchaseRequest`
	ADD CONSTRAINT `PurchaseRequest_itemId_fkey` FOREIGN KEY ( `itemId` )
	REFERENCES `Item`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "PurchaseRequest_requestedBy_fkey" --------------
ALTER TABLE `PurchaseRequest`
	ADD CONSTRAINT `PurchaseRequest_requestedBy_fkey` FOREIGN KEY ( `requestedBy` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "SaleItem_itemId_fkey" --------------------------
ALTER TABLE `SaleItem`
	ADD CONSTRAINT `SaleItem_itemId_fkey` FOREIGN KEY ( `itemId` )
	REFERENCES `Item`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "SaleItem_saleId_fkey" --------------------------
ALTER TABLE `SaleItem`
	ADD CONSTRAINT `SaleItem_saleId_fkey` FOREIGN KEY ( `saleId` )
	REFERENCES `Sale`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "Sale_createdBy_fkey" ---------------------------
ALTER TABLE `Sale`
	ADD CONSTRAINT `Sale_createdBy_fkey` FOREIGN KEY ( `createdBy` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "ShoppingLogItem_itemId_fkey" -------------------
ALTER TABLE `ShoppingLogItem`
	ADD CONSTRAINT `ShoppingLogItem_itemId_fkey` FOREIGN KEY ( `itemId` )
	REFERENCES `Item`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "ShoppingLogItem_shoppingLogId_fkey" ------------
ALTER TABLE `ShoppingLogItem`
	ADD CONSTRAINT `ShoppingLogItem_shoppingLogId_fkey` FOREIGN KEY ( `shoppingLogId` )
	REFERENCES `ShoppingLog`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "ShoppingLog_buyerId_fkey" ----------------------
ALTER TABLE `ShoppingLog`
	ADD CONSTRAINT `ShoppingLog_buyerId_fkey` FOREIGN KEY ( `buyerId` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "StockOpnameItem_itemId_fkey" -------------------
ALTER TABLE `StockOpnameItem`
	ADD CONSTRAINT `StockOpnameItem_itemId_fkey` FOREIGN KEY ( `itemId` )
	REFERENCES `Item`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "StockOpnameItem_stockOpnameId_fkey" ------------
ALTER TABLE `StockOpnameItem`
	ADD CONSTRAINT `StockOpnameItem_stockOpnameId_fkey` FOREIGN KEY ( `stockOpnameId` )
	REFERENCES `StockOpname`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "StockOpname_createdBy_fkey" --------------------
ALTER TABLE `StockOpname`
	ADD CONSTRAINT `StockOpname_createdBy_fkey` FOREIGN KEY ( `createdBy` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "StockTransaction_createdBy_fkey" ---------------
ALTER TABLE `StockTransaction`
	ADD CONSTRAINT `StockTransaction_createdBy_fkey` FOREIGN KEY ( `createdBy` )
	REFERENCES `User`( `id` )
	ON DELETE Set NULL
	ON UPDATE Cascade;
-- -------------------------------------------------------------


-- CREATE LINK "StockTransaction_itemId_fkey" ------------------
ALTER TABLE `StockTransaction`
	ADD CONSTRAINT `StockTransaction_itemId_fkey` FOREIGN KEY ( `itemId` )
	REFERENCES `Item`( `id` )
	ON DELETE Cascade
	ON UPDATE Cascade;
-- -------------------------------------------------------------


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- ---------------------------------------------------------


