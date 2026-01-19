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
-- Temporary view structure for view `v_sales_ranking`
--

DROP TABLE IF EXISTS `v_sales_ranking`;
/*!50001 DROP VIEW IF EXISTS `v_sales_ranking`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_sales_ranking` AS SELECT 
 1 AS `銷售排名`,
 1 AS `書名`,
 1 AS `主分類`,
 1 AS `總銷售數量`,
 1 AS `當前庫存`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_new_arrivals`
--

DROP TABLE IF EXISTS `v_new_arrivals`;
/*!50001 DROP VIEW IF EXISTS `v_new_arrivals`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_new_arrivals` AS SELECT 
 1 AS `書名`,
 1 AS `出版社`,
 1 AS `出版日期`,
 1 AS `系統上架時間`,
 1 AS `已出版天數`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_pricing_strategy`
--

DROP TABLE IF EXISTS `v_pricing_strategy`;
/*!50001 DROP VIEW IF EXISTS `v_pricing_strategy`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_pricing_strategy` AS SELECT 
 1 AS `書名`,
 1 AS `庫存量`,
 1 AS `原價`,
 1 AS `建議促銷價`,
 1 AS `策略建議`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_sales_ranking`
--

/*!50001 DROP VIEW IF EXISTS `v_sales_ranking`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_sales_ranking` AS select dense_rank() OVER (ORDER BY coalesce(sum(`od`.`quantity`),0) desc )  AS `銷售排名`,`b`.`title` AS `書名`,`cat`.`name` AS `主分類`,coalesce(sum(`od`.`quantity`),0) AS `總銷售數量`,`b`.`stock` AS `當前庫存` from (((`books` `b` left join `order_details` `od` on((`b`.`id` = `od`.`book_id`))) join `sub_categories` `sub` on((`b`.`sub_category_id` = `sub`.`id`))) join `categories` `cat` on((`sub`.`category_id` = `cat`.`id`))) group by `b`.`id`,`b`.`title`,`cat`.`name`,`b`.`stock` order by `總銷售數量` desc,`b`.`stock` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_new_arrivals`
--

/*!50001 DROP VIEW IF EXISTS `v_new_arrivals`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_new_arrivals` AS select `b`.`title` AS `書名`,`p`.`name` AS `出版社`,`b`.`publish_date` AS `出版日期`,`b`.`created_at` AS `系統上架時間`,(to_days(now()) - to_days(`b`.`publish_date`)) AS `已出版天數` from (`books` `b` join `publishers` `p` on((`b`.`publisher_id` = `p`.`id`))) order by `b`.`publish_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_pricing_strategy`
--

/*!50001 DROP VIEW IF EXISTS `v_pricing_strategy`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_pricing_strategy` AS select `b`.`title` AS `書名`,`b`.`stock` AS `庫存量`,`b`.`price` AS `原價`,(case when (`b`.`stock` > 50) then round((`b`.`price` * 0.79),0) when (`b`.`stock` between 10 and 50) then round((`b`.`price` * 0.90),0) when (`b`.`stock` between 1 and 9) then `b`.`price` else 0 end) AS `建議促銷價`,(case when (`b`.`stock` > 50) then '庫存積壓-大促銷(79折)' when (`b`.`stock` between 10 and 50) then '正常銷售-優惠(9折)' when (`b`.`stock` between 1 and 9) then '庫存緊張-原價惜售' else '已售完-補貨中' end) AS `策略建議` from `books` `b` order by `b`.`stock` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 11:46:34
