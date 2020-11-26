-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: localhost    Database: wcw
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `Assignment`
--

DROP TABLE IF EXISTS `Assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Assignment` (
  `name` char(15) NOT NULL,
  `orderNumber` int NOT NULL,
  PRIMARY KEY (`orderNumber`,`name`),
  KEY `number_idx` (`orderNumber`),
  CONSTRAINT `assignment_number_FK` FOREIGN KEY (`orderNumber`) REFERENCES `orders` (`number`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Assignment`
--

LOCK TABLES `Assignment` WRITE;
/*!40000 ALTER TABLE `Assignment` DISABLE KEYS */;
INSERT INTO `Assignment` VALUES ('Kevin',10061);
/*!40000 ALTER TABLE `Assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notes`
--

DROP TABLE IF EXISTS `Notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notes` (
  `noteID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `note` text NOT NULL,
  `postDate` datetime NOT NULL,
  PRIMARY KEY (`noteID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notes`
--

LOCK TABLES `Notes` WRITE;
/*!40000 ALTER TABLE `Notes` DISABLE KEYS */;
INSERT INTO `Notes` VALUES (3,'Here is a message','Do a new print','2020-11-25 19:41:29'),(6,'asdf','asdf','2020-11-25 19:43:52'),(8,'asdf2','asdf2','2020-11-25 19:47:01');
/*!40000 ALTER TABLE `Notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `number` int NOT NULL AUTO_INCREMENT,
  `product` varchar(100) NOT NULL,
  `color` char(20) NOT NULL,
  `status` char(10) NOT NULL DEFAULT 'NEW',
  `retrieveSTL` char(15) NOT NULL DEFAULT 'Not Complete',
  `startPrint` char(15) NOT NULL DEFAULT 'Not Complete',
  `sand` char(15) NOT NULL DEFAULT 'Not Complete',
  `package` char(15) NOT NULL DEFAULT 'Not Complete',
  `ship` char(15) NOT NULL DEFAULT 'Not Complete',
  `printTime` float NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  UNIQUE KEY `number_UNIQUE` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=10064 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (10054,'Jazz Classic bari standard+','yellow','SHIPPED','Complete','Complete','Complete','Complete','Complete',6.5,'New Note Here'),(10055,'Jazz Bright soprano closed+','yellow','SHIPPED','Complete','Complete','Complete','Complete','Complete',6.5,'New Note '),(10056,'Jazz Bright tenor ','bone white','SHIPPED','Complete','Complete','Complete','Complete','Complete',6.5,'Note'),(10057,'Jazz Bright tenor ','green','SHIPPED','Complete','Complete','Complete','Complete','Complete',6.5,'a;sldkf'),(10058,'Jazz Bright alto closed+','green','SHIPPED','Not Complete','Not Complete','Not Complete','Not Complete','Not Complete',6.5,'new note'),(10060,'Concert Series bari closed+','light purple','SHIPPED','Complete','Complete','Complete','Complete','Complete',6.5,'No new notes'),(10061,'End Cap','turquoise','ASSIGNED','Not Complete','Not Complete','Not Complete','Not Complete','Not Complete',6.5,'None'),(10062,'Jazz Classic soprano closed+','red','SHIPPED','Complete','Complete','Complete','Complete','Complete',6.5,'asdf'),(10063,'Jazz Bright bari standard','berry blue','NEW','Not Complete','Not Complete','Not Complete','Not Complete','Not Complete',6.5,'asdf');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Printer`
--

DROP TABLE IF EXISTS `Printer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Printer` (
  `name` char(20) NOT NULL,
  `orderNumber` int DEFAULT NULL,
  `product` varchar(45) DEFAULT NULL,
  `printTime` float DEFAULT NULL,
  `startTime` datetime DEFAULT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `printer_number_idx` (`orderNumber`),
  CONSTRAINT `printer_number` FOREIGN KEY (`orderNumber`) REFERENCES `orders` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Printer`
--

LOCK TABLES `Printer` WRITE;
/*!40000 ALTER TABLE `Printer` DISABLE KEYS */;
INSERT INTO `Printer` VALUES ('Mt. Rushmore',NULL,NULL,NULL,NULL),('Old Faithful',NULL,NULL,NULL,NULL),('Prusa Mini',NULL,NULL,NULL,NULL),('Yosemite',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Printer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Shipped`
--

DROP TABLE IF EXISTS `Shipped`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Shipped` (
  `orderNumber` int NOT NULL,
  `shipDate` datetime NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `number_idx` (`orderNumber`),
  CONSTRAINT `shipped_number` FOREIGN KEY (`orderNumber`) REFERENCES `orders` (`number`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Shipped`
--

LOCK TABLES `Shipped` WRITE;
/*!40000 ALTER TABLE `Shipped` DISABLE KEYS */;
INSERT INTO `Shipped` VALUES (10062,'2020-11-26 11:01:25',2),(10056,'2020-11-26 11:06:01',3);
/*!40000 ALTER TABLE `Shipped` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `userID` char(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` char(30) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userID_UNIQUE` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('ngxu','Neil','wcwNeil'),('test','windycity','test1'),('wcw','Company','wcw');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-26 16:07:00
