CREATE DATABASE  IF NOT EXISTS `ebook` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ebook`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
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
-- Table structure for table `user_shipping_infos`
--

DROP TABLE IF EXISTS `user_shipping_infos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_shipping_infos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `method_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_shipping_infos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_shipping_infos`
--

LOCK TABLES `user_shipping_infos` WRITE;
/*!40000 ALTER TABLE `user_shipping_infos` DISABLE KEYS */;
INSERT INTO `user_shipping_infos` VALUES (1,1,'宅配','台北市中正區1號'),(2,2,'宅配','台北市大安區2號'),(3,3,'超商取貨','7-11 大安門市'),(4,4,'超商取貨','全家 信義門市'),(5,5,'宅配','新北市板橋區3號'),(6,6,'宅配','新北市新店區4號'),(7,7,'超商取貨','OK 雙和門市'),(8,8,'宅配','桃園市中壢區5號'),(9,9,'宅配','桃園市桃園區6號'),(10,10,'超商取貨','7-11 桃園門市'),(11,11,'宅配','台中市西屯區7號'),(12,12,'宅配','台中市北區8號'),(13,13,'超商取貨','全家 台中門市'),(14,14,'宅配','台南市東區9號'),(15,15,'宅配','台南市中西區10號'),(16,16,'超商取貨','7-11 台南門市'),(17,17,'宅配','高雄市鼓山區11號'),(18,18,'宅配','高雄市前鎮區12號'),(19,19,'超商取貨','全家 高雄門市'),(20,20,'宅配','基隆市仁愛區13號'),(21,21,'宅配','新竹市東區14號'),(22,22,'宅配','宜蘭縣宜蘭市15號'),(23,23,'超商取貨','7-11 宜蘭門市'),(24,24,'宅配','花蓮縣花蓮市16號'),(25,25,'宅配','台東縣台東市17號');
/*!40000 ALTER TABLE `user_shipping_infos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 11:46:34
