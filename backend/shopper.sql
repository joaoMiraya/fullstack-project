-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: shopper
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `coordinates` point NOT NULL /*!80003 SRID 4326 */,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  SPATIAL KEY `coordinates` (`coordinates`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `u_id` varchar(100) NOT NULL,
  `car` varchar(100) NOT NULL,
  `cnh` varchar(15) NOT NULL,
  `description` varchar(255) NOT NULL,
  `fee` int NOT NULL,
  `min_km` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_drivers_users` (`u_id`),
  CONSTRAINT `fk_drivers_users` FOREIGN KEY (`u_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (3,'fc1RBZASZ','Hyundai HB20','70215601570','Lorem ipsum odor amet, consectetuer adipiscing elit. Odio volutpat penatibus ipsum morbi malesuada. Malesuada dolor elit scelerisque proin ridiculus magna donec',500,1000,'2024-11-26 23:34:37'),(4,'slIIxXCO2','Renault Kwid','45947740186','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',750,1000,'2024-11-27 15:00:12');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_address`
--

DROP TABLE IF EXISTS `favorite_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `u_id` int NOT NULL,
  `addr_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `u_id` (`u_id`),
  KEY `addr_id` (`addr_id`),
  CONSTRAINT `favorite_address_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `users` (`id`),
  CONSTRAINT `favorite_address_ibfk_2` FOREIGN KEY (`addr_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_address`
--

LOCK TABLES `favorite_address` WRITE;
/*!40000 ALTER TABLE `favorite_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `racing`
--

DROP TABLE IF EXISTS `racing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `racing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `r_id` varchar(150) NOT NULL,
  `driver_id` varchar(100) NOT NULL,
  `passenger_id` varchar(100) NOT NULL,
  `origin` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `status` enum('PENDING','DONE','CANCELED') NOT NULL DEFAULT 'PENDING',
  `distance` decimal(10,2) NOT NULL,
  `duration` varchar(100) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `car` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_racing_rid` (`r_id`),
  KEY `fk_driver_uid` (`driver_id`),
  KEY `fk_user_uid` (`passenger_id`),
  CONSTRAINT `fk_driver_uid` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_uid` FOREIGN KEY (`passenger_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `racing`
--

LOCK TABLES `racing` WRITE;
/*!40000 ALTER TABLE `racing` DISABLE KEYS */;
INSERT INTO `racing` VALUES (19,'5OPO7eyJh','fc1RBZASZ','AYy6wNI8x','[{\"lat\":-22.078227,\"lng\":-51.4740895}]','[{\"lat\":-23.5557714,\"lng\":-46.6395571}]','DONE',567654.00,'25070s',2838.27,'Hyundai HB20','2024-11-26 23:54:43','2024-11-26 23:55:42'),(20,'AzlTwIkrL','fc1RBZASZ','AYy6wNI8x','[{\"lat\":-22.1205939,\"lng\":-51.3874076}]','[{\"lat\":-22.078227,\"lng\":-51.4740895}]','DONE',13461.00,'1001s',67.31,'Hyundai HB20','2024-11-27 02:02:40','2024-11-27 02:05:11'),(21,'LK17K5VJJ','slIIxXCO2','AYy6wNI8x','[{\"lat\":-22.078227,\"lng\":-51.4740895}]','[{\"lat\":-23.5557714,\"lng\":-46.6395571}]','DONE',567654.00,'24859s',4257.41,'Renault Kwid','2024-11-27 15:00:43','2024-11-27 15:01:09'),(22,'Z3OxxoEpe','fc1RBZASZ','slIIxXCO2','[{\"lat\":-22.078227,\"lng\":-51.4740895}]','[{\"lat\":-23.5557714,\"lng\":-46.6395571}]','DONE',567654.00,'24686s',2838.27,'Hyundai HB20','2024-11-27 15:18:56','2024-11-27 15:19:05'),(23,'S9KNK7ww2','slIIxXCO2','AYy6wNI8x','[{\"lat\":-22.078227,\"lng\":-51.4740895}]','[{\"lat\":-23.5557714,\"lng\":-46.6395571}]','DONE',567654.00,'24857s',4257.41,'Renault Kwid','2024-11-28 01:49:43','2024-11-28 01:49:52');
/*!40000 ALTER TABLE `racing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_id` varchar(100) NOT NULL,
  `to_id` varchar(100) NOT NULL,
  `racing_id` varchar(100) NOT NULL,
  `stars` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `driver_uid` (`to_id`),
  KEY `fk_racing_rid` (`racing_id`),
  KEY `fk_costumer_id` (`from_id`),
  CONSTRAINT `driver_uid` FOREIGN KEY (`to_id`) REFERENCES `drivers` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_costumer_id` FOREIGN KEY (`from_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_racing_rid` FOREIGN KEY (`racing_id`) REFERENCES `racing` (`r_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (5,'AYy6wNI8x','fc1RBZASZ','AzlTwIkrL','5','Otimo motorista','2024-11-27 14:19:21'),(6,'slIIxXCO2','fc1RBZASZ','Z3OxxoEpe','4','Otimo motorista e educado!','2024-11-27 15:19:21'),(7,'AYy6wNI8x','slIIxXCO2','S9KNK7ww2','3','Quase atropelou dois pedestres mas de resto foi bom','2024-11-28 01:50:31');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (38,'AYy6wNI8x','Passageiro','pass@email.com','$2a$12$5yshmO7P3iE78Pa9JdDUkOO9w4yr8jovBT1vneXTD58OYLmvI9JKy','2024-11-26 23:31:21'),(39,'fc1RBZASZ','Motorista','moto@email.com','$2a$12$XbUAs9kyq2mFsrhPZNkYr.Ew5I5hAFvQw53UsAjGPfdTSEr4f2H8a','2024-11-26 23:34:37'),(40,'qA0u4LorI','Exemplo','exem@email.com','$2a$12$yzrY5Zc74hzyw3zfcD2oue.43mnIiQzIuFHdfYD0MeC4qMs82YoJO','2024-11-27 03:15:44'),(41,'slIIxXCO2','Teste','test@test.com','$2a$12$gTRplev/byoyM8h2fZdD8uc8wXt5VWcKyloGetT9iWAc4tPGW19He','2024-11-27 15:00:12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-28  2:31:26
