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
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordhash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'user01','hash01','pass01','王小明','user01@test.com','0911000001',NULL,1,'2025-11-23 18:47:17','2025-11-22 23:21:46','2025-11-23 18:47:17',NULL),(2,'user02','hash02','pass02','李小華','user02@test.com','0911000002',NULL,1,'2025-11-23 18:47:24','2025-11-22 23:21:46','2025-11-23 18:47:24',NULL),(3,'user03','hash03','pass03','陳大雄','user03@test.com','0911000003',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(4,'user04','hash04','pass04','林美麗','user04@test.com','0911000004',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(5,'user05','hash05','pass05','張曉君','user05@test.com','0911000005',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(6,'user06','hash06','pass06','黃子軒','user06@test.com','0911000006',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(7,'user07','hash07','pass07','吳冠宇','user07@test.com','0911000007',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(8,'user08','hash08','pass08','何庭瑜','user08@test.com','0911000008',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(9,'user09','hash09','pass09','趙依林','user09@test.com','0911000009',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(10,'user10','hash10','pass10','邱品妍','user10@test.com','0911000010',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(11,'user11','hash11','pass11','簡志豪','user11@test.com','0911000011',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(12,'user12','hash12','pass12','蔡芷晴','user12@test.com','0911000012',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(13,'user13','hash13','pass13','鄭雅涵','user13@test.com','0911000013',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(14,'user14','hash14','pass14','許彥廷','user14@test.com','0911000014',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(15,'user15','hash15','pass15','周沛文','user15@test.com','0911000015',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(16,'user16','hash16','pass16','柯怡君','user16@test.com','0911000016',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(17,'user17','hash17','pass17','管雅筑','user17@test.com','0911000017',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(18,'user18','hash18','pass18','謝柏宇','user18@test.com','0911000018',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(19,'user19','hash19','pass19','邵亭妤','user19@test.com','0911000019',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(20,'user20','hash20','pass20','范志成','user20@test.com','0911000020',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(21,'user21','hash21','pass21','高立安','user21@test.com','0911000021',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(22,'user22','hash22','pass22','鍾易廷','user22@test.com','0911000022',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(23,'user23','hash23','pass23','江宛蓉','user23@test.com','0911000023',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(24,'user24','hash24','pass24','廖冠霖','user24@test.com','0911000024',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(25,'user25','hash25','pass25','劉怡萱','user25@test.com','0911000025',NULL,1,'2025-11-22 23:21:46','2025-11-22 23:21:46','2025-11-22 23:21:46',NULL),(26,'testUser01',NULL,'Newpass12','測試會員',NULL,'0912345678','台北市',1,'2025-11-23 17:37:36',NULL,'2025-11-23 17:37:36',NULL),(27,'testUser02',NULL,'Abcdef13','測試會員',NULL,'0912345673','台北市',1,'2025-11-23 12:13:56','2025-11-23 00:45:22','2025-11-23 12:13:56',NULL);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-24 18:48:22
