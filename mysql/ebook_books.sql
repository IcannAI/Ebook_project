-- MySQL dump 10.13  Distrib 8.0.43, for macos15 (arm64)
--
-- Host: localhost    Database: ebook
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isbn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `publisher_id` int DEFAULT NULL,
  `sub_category_id` int DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `discount` decimal(10,2) DEFAULT '1.00',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` BOOLEAN DEFAULT TRUE COMMENT 'true:上架, false:下架',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by_admin_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `publisher_id` (`publisher_id`),
  KEY `sub_category_id` (`sub_category_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`id`),
  CONSTRAINT `books_ibfk_2` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'978000000001','Java 入門實戰',10,1,'2020-01-01',650.00,50,1.00,'Java 初學者指南','image1.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',1),(2,'978000000002','Spring Boot 網站開發',10,4,'2021-03-15',780.00,40,1.00,'使用 Spring Boot 建立 REST API','image2.png',0,'2025-11-22 23:21:46','2025-11-22 23:21:46',1),(3,'978000000003','Python 資料分析',11,2,'2019-07-10',720.00,35,0.90,'以實例帶你學 Pandas 與 NumPy','image3.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',2),(4,'978000000004','Python 機器學習',11,7,'2020-09-05',820.00,30,0.95,'機器學習基礎與實作','image4.png',0,'2025-11-22 23:21:46','2025-11-22 23:21:46',2),(5,'978000000005','深度學習入門',12,9,'2021-05-20',900.00,25,1.00,'深度學習基本概念','image5.png',0,'2025-11-22 23:21:46','2025-11-22 23:21:46',3),(6,'978000000006','HTML & CSS 網頁設計',13,5,'2018-11-01',550.00,60,1.00,'從零開始學網頁切版','image6.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',3),(7,'978000000007','JavaScript 網頁互動',13,6,'2019-02-14',600.00,55,1.00,'網頁前端 JavaScript 實作','image7.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',4),(8,'978000000008','React 前端開發',13,6,'2021-01-08',780.00,32,0.90,'使用 React 建立 SPA','image8.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',4),(9,'978000000009','Clean Code 中文版',11,1,'2017-06-01',850.00,20,1.00,'寫出可讀性高的程式碼','image9.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',5),(10,'978000000010','Effective Java 第三版',11,1,'2018-12-01',900.00,18,1.00,'進階 Java 開發必讀','image10.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',5),(11,'978000000011','人類大歷史',5,25,'2014-01-01',500.00,45,1.00,'從遠古到21世紀的人類故事','image11.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',6),(12,'978000000012','思考，快與慢',6,18,'2011-01-01',520.00,38,1.00,'行為經濟學經典','image12.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',6),(13,'978000000013','原子習慣',8,22,'2018-10-01',420.00,70,1.00,'建立好習慣的實用指南','image13.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',7),(14,'978000000014','一路向前',4,22,'2013-05-01',380.00,25,1.00,'專注最重要的一件事','image14.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',7),(15,'978000000015','精實創業',4,11,'2011-09-01',450.00,33,0.90,'創業者必讀手冊','image15.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',8),(16,'978000000016','從 0 到 1',4,11,'2014-09-01',480.00,40,1.00,'創業與創新的思維','image16.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',8),(17,'978000000017','ETF 指數投資',3,14,'2019-01-01',420.00,50,1.00,'適合上班族的被動投資法','image17.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',9),(18,'978000000018','股票價值投資',3,13,'2018-01-01',450.00,47,1.00,'以基本面選股','image18.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',9),(19,'978000000019','海龜交易法則',3,13,'2010-01-01',430.00,29,0.95,'經典趨勢交易策略','image19.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',10),(20,'978000000020','東野圭吾推理精選',5,15,'2015-07-01',360.00,60,1.00,'多篇短篇推理小說','image20.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',10),(21,'978000000021','哈利波特全集(上)',5,16,'2005-01-01',1200.00,15,1.00,'魔法世界冒險故事','image21.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',11),(22,'978000000022','哈利波特全集(下)',5,16,'2007-01-01',1200.00,13,1.00,'魔法世界冒險故事完結篇','image22.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',11),(23,'978000000023','時間簡史',9,23,'1988-01-01',380.00,22,1.00,'宇宙與時間的故事','image23.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',12),(24,'978000000024','料理聖經：烘焙篇',17,28,'2019-08-01',600.00,30,1.00,'從入門到進階烘焙技巧','image24.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',12),(25,'978000000025','親子教養的 50 個關鍵',8,27,'2020-03-01',380.00,44,1.00,'陪伴孩子成長的技巧','image25.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',13),(26,'978000000026','有效簡報技巧',20,29,'2016-04-01',420.00,36,1.00,'讓簡報更有說服力','image26.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',13),(27,'978000000027','職場溝通實戰',19,30,'2017-05-01',420.00,33,1.00,'提升溝通與協調能力','image27.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',14),(28,'978000000028','深度工作',14,22,'2016-01-01',450.00,39,1.00,'專注的重要性','image28.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',14),(29,'978000000029','Web 全端開發實務',10,6,'2022-01-01',880.00,28,1.00,'一次掌握前後端','image29.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',15),(30,'978000000030','Java 資料結構與演算法',10,1,'2020-10-01',780.00,26,1.00,'以 Java 學演算法','image30.png',1,'2025-11-22 23:21:46','2025-11-22 23:21:46',15);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET S-- Dump completed on 2026-01-24 17:56:59
leted on 2026-01-24 15:47:43
