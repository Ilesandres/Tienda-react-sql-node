/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 10.4.28-MariaDB : Database - store_dani
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`store_dani` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `store_dani`;

/*Table structure for table `category` */

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` tinytext DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `category` */

insert  into `category`(`id`,`name`,`description`,`uuid`) values 
(10,'granos','granos como arroz, frijol, arveja..','2fe05665-87e5-11ef-9451-0ae0afa00364'),
(11,'Bedidas enbotelladas','bebidas de todo tipo consumo humano','2fe166ca-87e5-11ef-9451-0ae0afa00364'),
(12,'frutas y verduras','verduras y demas naturales','2fe16828-87e5-11ef-9451-0ae0afa00364'),
(13,'carnes','carnes de cerdo, res, pollo y demas\n','2fe168c6-87e5-11ef-9451-0ae0afa00364'),
(14,'abarrotes','productos generales de uso diario','2fe1695d-87e5-11ef-9451-0ae0afa00364'),
(15,'mascotas','alimentos para mascotas','2fe169f3-87e5-11ef-9451-0ae0afa00364'),
(16,'mecato xunidad','mecato por paquetes unitarios','2fe16a96-87e5-11ef-9451-0ae0afa00364'),
(17,'ropa','ropas de todo tipo','2fe16b2d-87e5-11ef-9451-0ae0afa00364');

/*Table structure for table `documenttype` */

DROP TABLE IF EXISTS `documenttype`;

CREATE TABLE `documenttype` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `documenttype` */

insert  into `documenttype`(`id`,`type`,`uuid`) values 
(4,'T.I','5edbe3a6-8804-11ef-ade4-0ae0afa00364'),
(5,'C.C','5edbe5dc-8804-11ef-ade4-0ae0afa00364'),
(6,'C.E','5edbe67d-8804-11ef-ade4-0ae0afa00364');

/*Table structure for table `invoice` */

DROP TABLE IF EXISTS `invoice`;

CREATE TABLE `invoice` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `statusId` int(20) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` datetime DEFAULT NULL,
  `peopleId` int(20) DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `statusId` (`statusId`),
  KEY `peopleId` (`peopleId`),
  CONSTRAINT `invoice_ibfk_2` FOREIGN KEY (`statusId`) REFERENCES `invoicestatus` (`id`),
  CONSTRAINT `invoice_ibfk_3` FOREIGN KEY (`peopleId`) REFERENCES `people` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `invoice` */

insert  into `invoice`(`id`,`statusId`,`createdAt`,`updatedAt`,`peopleId`,`uuid`) values 
(1,1,'2024-10-11 14:37:58',NULL,1,'51f3c79f-8808-11ef-ade4-0ae0afa00364'),
(2,2,'2024-10-11 14:38:24',NULL,1,'61648a95-8808-11ef-ade4-0ae0afa00364');

/*Table structure for table `invoiceproduct` */

DROP TABLE IF EXISTS `invoiceproduct`;

CREATE TABLE `invoiceproduct` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `productId` int(20) DEFAULT NULL,
  `invoiceId` int(20) DEFAULT NULL,
  `uuid` char(36) DEFAULT NULL,
  `cant` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `productId` (`productId`),
  KEY `invoiceId` (`invoiceId`),
  CONSTRAINT `invoiceproduct_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
  CONSTRAINT `invoiceproduct_ibfk_2` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `invoiceproduct` */

insert  into `invoiceproduct`(`id`,`productId`,`invoiceId`,`uuid`,`cant`) values 
(1,11,1,'aa1651a3-880b-11ef-ade4-0ae0afa00364',2);

/*Table structure for table `invoicestatus` */

DROP TABLE IF EXISTS `invoicestatus`;

CREATE TABLE `invoicestatus` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` tinytext DEFAULT NULL,
  `uuid` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `uuid_2` (`uuid`),
  UNIQUE KEY `uuid_3` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `invoicestatus` */

insert  into `invoicestatus`(`id`,`name`,`description`,`uuid`) values 
(1,'pagado',NULL,'7c5bf6dd-880d-11ef-ade4-0ae0afa00364'),
(2,'cancelado',NULL,'841f461f-880d-11ef-ade4-0ae0afa00364');

/*Table structure for table `order` */

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `invoiceId` int(20) DEFAULT NULL,
  `statusId` int(20) DEFAULT NULL,
  `details` tinytext DEFAULT NULL,
  `uuid` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoiceId` (`invoiceId`),
  KEY `statusId` (`statusId`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`),
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`statusId`) REFERENCES `orderstatus` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `order` */

/*Table structure for table `orderstatus` */

DROP TABLE IF EXISTS `orderstatus`;

CREATE TABLE `orderstatus` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `orderstatus` */

/*Table structure for table `people` */

DROP TABLE IF EXISTS `people`;

CREATE TABLE `people` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `address` varchar(70) DEFAULT NULL,
  `documentTypeId` int(20) DEFAULT NULL,
  `documentNumber` varchar(12) DEFAULT NULL,
  `phone` varchar(12) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` datetime DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 0,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `documentTypeId` (`documentTypeId`),
  CONSTRAINT `people_ibfk_1` FOREIGN KEY (`documentTypeId`) REFERENCES `documenttype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `people` */

insert  into `people`(`id`,`firstName`,`lastName`,`address`,`documentTypeId`,`documentNumber`,`phone`,`createdAt`,`updatedAt`,`isActive`,`uuid`) values 
(1,'Juan','Perez','Calle 45 22-33',4,'1234567890','32132145','2024-10-14 17:09:19','2024-10-10 16:33:31',0,'f5e18d0a-8a78-11ef-9c33-0ae0afa00364'),
(2,'Camilo','Rendon','Vereda Palermo norte',5,'12536842','3215324830','2024-10-14 17:09:19','2024-10-10 16:33:35',1,'f5e21893-8a78-11ef-9c33-0ae0afa00364'),
(3,'Camilo','Calderon','calle 5 #3 sur',5,'1256891','3227569852','2024-10-14 17:09:19','2024-10-10 16:33:32',1,'f5e2198a-8a78-11ef-9c33-0ae0afa00364'),
(4,'Sarah','mandrogan','centro',5,'1245002','3226440156','2024-10-14 17:09:19',NULL,0,'f5e21a2f-8a78-11ef-9c33-0ae0afa00364');

/*Table structure for table `peoplerol` */

DROP TABLE IF EXISTS `peoplerol`;

CREATE TABLE `peoplerol` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `peopleId` int(20) DEFAULT NULL,
  `rolId` int(20) DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `peopleId` (`peopleId`),
  KEY `rolId` (`rolId`),
  CONSTRAINT `peoplerol_ibfk_1` FOREIGN KEY (`peopleId`) REFERENCES `people` (`id`),
  CONSTRAINT `peoplerol_ibfk_2` FOREIGN KEY (`rolId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `peoplerol` */

insert  into `peoplerol`(`id`,`peopleId`,`rolId`,`uuid`) values 
(1,1,1,'1a7ecf23-8a7a-11ef-9c33-0ae0afa00364'),
(2,2,1,'1a7f75f5-8a7a-11ef-9c33-0ae0afa00364'),
(3,3,1,'1a7f7702-8a7a-11ef-9c33-0ae0afa00364'),
(4,4,2,'1a7f7794-8a7a-11ef-9c33-0ae0afa00364'),
(5,1,2,'a40fbf87-8a7b-11ef-907d-0ae0afa00364');

/*Table structure for table `product` */

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `product` */

insert  into `product`(`id`,`name`,`stock`,`price`,`createdAt`,`updatedAt`,`isActive`,`uuid`) values 
(2,'Leche',25,4000,'2024-10-02 10:01:00','2024-10-02 10:01:00',1,'52a9da61-8a7c-11ef-907d-0ae0afa00364'),
(3,'Pollo (kg)',15,8000,'2024-10-02 10:02:00','2024-10-02 10:02:00',1,'52a9ed50-8a7c-11ef-907d-0ae0afa00364'),
(4,'Carne de Res (kg)',10,18000,'2024-10-02 10:03:00','2024-10-02 10:03:00',1,'52a9ee30-8a7c-11ef-907d-0ae0afa00364'),
(5,'Manzana (unidad)',50,2000,'2024-10-02 10:04:00','2024-10-02 10:04:00',1,'52a9eed3-8a7c-11ef-907d-0ae0afa00364'),
(6,'Jugo (botella)',20,3000,'2024-10-02 10:05:00','2024-10-02 10:05:00',1,'52a9ef69-8a7c-11ef-907d-0ae0afa00364'),
(7,'Huevo (docena)',30,5000,'2024-10-02 10:06:00','2024-10-02 10:06:00',1,'52a9f001-8a7c-11ef-907d-0ae0afa00364'),
(8,'Tetra Pak',40,3000,'2024-10-02 10:07:00','2024-10-02 10:07:00',1,'52a9f094-8a7c-11ef-907d-0ae0afa00364'),
(9,'Hueso perro',10,2500,'2024-10-02 10:08:00','2024-10-02 10:08:00',1,'52a9f123-8a7c-11ef-907d-0ae0afa00364'),
(11,'Galletas xunidad',18,1200,'2024-10-02 16:33:00',NULL,1,'52a9f1b4-8a7c-11ef-907d-0ae0afa00364'),
(12,'agua xL(botella)',18,1500,'2024-10-03 21:26:59',NULL,1,'52a9f24e-8a7c-11ef-907d-0ae0afa00364'),
(14,'Arroz 1000g',10,4500,'2024-10-10 16:35:32',NULL,1,'52a9f2df-8a7c-11ef-907d-0ae0afa00364');

/*Table structure for table `productcategory` */

DROP TABLE IF EXISTS `productcategory`;

CREATE TABLE `productcategory` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `categoryId` int(20) DEFAULT NULL,
  `productId` int(20) DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `categoryId` (`categoryId`),
  KEY `productId` (`productId`),
  CONSTRAINT `productcategory_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`),
  CONSTRAINT `productcategory_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `productcategory` */

insert  into `productcategory`(`id`,`categoryId`,`productId`,`uuid`) values 
(29,11,2,'5d877d12-8a7d-11ef-907d-0ae0afa00364'),
(30,16,3,'5d878db0-8a7d-11ef-907d-0ae0afa00364'),
(31,13,4,'5d878e8b-8a7d-11ef-907d-0ae0afa00364'),
(32,12,5,'5d878f21-8a7d-11ef-907d-0ae0afa00364'),
(33,11,6,'5d878fb0-8a7d-11ef-907d-0ae0afa00364'),
(34,15,7,'5d87903b-8a7d-11ef-907d-0ae0afa00364'),
(35,14,8,'5d8790c3-8a7d-11ef-907d-0ae0afa00364'),
(36,15,9,'5d87914c-8a7d-11ef-907d-0ae0afa00364'),
(38,16,11,'5d8791d3-8a7d-11ef-907d-0ae0afa00364'),
(39,11,12,'5d879260-8a7d-11ef-907d-0ae0afa00364'),
(41,10,14,'5d8792e8-8a7d-11ef-907d-0ae0afa00364');

/*Table structure for table `productdesc` */

DROP TABLE IF EXISTS `productdesc`;

CREATE TABLE `productdesc` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `productId` int(20) DEFAULT NULL,
  `discount` tinyint(1) DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `productId` (`productId`),
  CONSTRAINT `productdesc_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `productdesc` */

insert  into `productdesc`(`id`,`productId`,`discount`,`uuid`) values 
(1,2,127,'46bd3154-8afb-11ef-b3f0-0ae0afa00364'),
(2,3,100,'46be083f-8afb-11ef-b3f0-0ae0afa00364'),
(4,4,127,'48bfaaff-8afd-11ef-b3f0-0ae0afa00364');

/*Table structure for table `productsupplier` */

DROP TABLE IF EXISTS `productsupplier`;

CREATE TABLE `productsupplier` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `productId` int(20) DEFAULT NULL,
  `peopleId` int(20) DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `productId` (`productId`),
  KEY `peopleId` (`peopleId`),
  CONSTRAINT `productsupplier_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
  CONSTRAINT `productsupplier_ibfk_2` FOREIGN KEY (`peopleId`) REFERENCES `people` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `productsupplier` */

insert  into `productsupplier`(`id`,`productId`,`peopleId`,`uuid`) values 
(1,2,1,'2a310bab-8afe-11ef-b3f0-0ae0afa00364');

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` tinytext DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `roles` */

insert  into `roles`(`id`,`name`,`description`,`uuid`) values 
(1,'clientes',NULL,'aecaf99d-8afe-11ef-b3f0-0ae0afa00364'),
(2,'Vendedor',NULL,'aecbd866-8afe-11ef-b3f0-0ae0afa00364'),
(3,'Admin',NULL,'329b4608-8aff-11ef-b3f0-0ae0afa00364'),
(4,'Surtidor',NULL,'497669ad-8aff-11ef-b3f0-0ae0afa00364');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(30) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` datetime DEFAULT NULL,
  `peopleId` int(20) DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `peopleId` (`peopleId`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`peopleId`) REFERENCES `people` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user` */

/* Trigger structure for table `category` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_category` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_category` BEFORE INSERT ON `category` FOR EACH ROW 
begin
	IF NEW.uuid IS NULL OR NEW.uuid ='' THEN 
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `documenttype` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_typeDni` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_typeDni` BEFORE INSERT ON `documenttype` FOR EACH ROW 
BEGIN 
	if NEW.uuid IS NULL OR NEW.uuid ='' THEN
	SET NEW.uuid =UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `invoice` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_invoice` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_invoice` BEFORE INSERT ON `invoice` FOR EACH ROW 
BEGIN
  IF NEW.uuid IS NULL OR NEW.uuid = '' THEN
    SET NEW.uuid = UUID();
  END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `invoiceproduct` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_productInvoice` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_productInvoice` BEFORE INSERT ON `invoiceproduct` FOR EACH ROW 
BEGIN 
IF NEW.uuid IS NULL OR NEW.uuid='' THEN
SET NEW.uuid=UUID();
END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `invoicestatus` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_invoiceStatus` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_invoiceStatus` BEFORE INSERT ON `invoicestatus` FOR EACH ROW 
BEGIN 
IF NEW.uuid IS NULL OR NEW.uuid= '' THEN
 SET NEW.uuid=UUID();
END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `order` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_order` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_order` BEFORE INSERT ON `order` FOR EACH ROW 
BEGIN 
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `people` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_people` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_people` BEFORE INSERT ON `people` FOR EACH ROW 
BEGIN
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN 
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `peoplerol` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_peopl_rol` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_peopl_rol` BEFORE INSERT ON `peoplerol` FOR EACH ROW 
BEGIN
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN 
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `peoplerol` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_people_rol` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_people_rol` BEFORE INSERT ON `peoplerol` FOR EACH ROW 
BEGIN
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN 
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `product` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_product` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_product` BEFORE INSERT ON `product` FOR EACH ROW 
BEGIN
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN
		set NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `productcategory` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_product_category` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_product_category` BEFORE INSERT ON `productcategory` FOR EACH ROW 
BEGIN 
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN
	 SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `productdesc` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_product_desc` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_product_desc` BEFORE INSERT ON `productdesc` FOR EACH ROW 
BEGIN 
	IF NEW.uuid IS NULL OR NEW.uuid ='' THEN
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `productsupplier` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_producsupplier` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_producsupplier` BEFORE INSERT ON `productsupplier` FOR EACH ROW 
BEGIN
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN 
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `roles` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_rol` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_rol` BEFORE INSERT ON `roles` FOR EACH ROW 
BEGIN
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/* Trigger structure for table `user` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `before_insert_user` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `before_insert_user` BEFORE INSERT ON `user` FOR EACH ROW 
BEGIN
	IF NEW.uuid IS NULL OR NEW.uuid='' THEN
		SET NEW.uuid=UUID();
	END IF;
END */$$


DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
