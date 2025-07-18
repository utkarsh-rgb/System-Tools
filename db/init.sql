-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: tools_user
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
-- Table structure for table `contact_message`
--

DROP TABLE IF EXISTS `contact_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_message`
--

LOCK TABLES `contact_message` WRITE;
/*!40000 ALTER TABLE `contact_message` DISABLE KEYS */;
INSERT INTO `contact_message` VALUES (1,'jhh','utkarshgupta.976274@gmail.com','hh','2025-06-05 10:25:14'),(2,'xys','xyz@gmail.com','nice\n','2025-06-06 08:33:23'),(3,'xys','xyz@gmail.com','nice\n','2025-06-06 08:33:24'),(4,'xys','xyz@gmail.com','nice\n','2025-06-06 08:33:26'),(5,'xys','xyz@gmail.com','nice\n','2025-06-06 08:33:26'),(6,'xys','xyz@gmail.com','nice\n','2025-06-06 08:33:27'),(7,'xys','xyz@gmail.com','nice\n','2025-06-06 08:33:27'),(8,'xys','xyz@gmail.com','nice\n','2025-06-06 08:34:20'),(9,'xys','xyz@gmail.com','nice\n','2025-06-06 08:34:20'),(10,'xys','xyz@gmail.com','nice\n','2025-06-06 08:34:20'),(11,'xys','xyz@gmail.com','nice\n','2025-06-06 08:34:20'),(12,'Nandini Singh','utkarshgupta.976274@gmail.com','nice\n','2025-06-06 11:04:21'),(13,'Utkarsh Gupta','utkarshgupta.976274@gmail.com','1234567uhgfdfghnhgf','2025-06-06 12:18:24');
/*!40000 ALTER TABLE `contact_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (34,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:12'),(35,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:17'),(36,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:17'),(37,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:18'),(38,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:18'),(39,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:18'),(40,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:18'),(41,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:22'),(42,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:23'),(43,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:27'),(44,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:27'),(45,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:45'),(46,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:46'),(47,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:46'),(48,'abcd','Your order #38 has been shipped.','2025-06-09 11:47:58'),(49,'abcd','Your order #38 has been shipped.','2025-06-09 11:48:00'),(50,'abcd','Your order #38 has been shipped.','2025-06-09 11:49:35'),(51,'abcd','Your order #38 has been shipped.','2025-06-09 11:57:42'),(52,'abcd','Your order #38 has been shipped.','2025-06-09 12:02:23'),(53,'abcd','Your order #38 has been shipped.','2025-06-09 12:05:00'),(54,'abcd','Your order #38 has been shipped.','2025-06-09 12:05:46'),(55,'abcd','Your order #38 has been shipped.','2025-06-09 12:05:47'),(56,'abcd','Your order #38 has been shipped.','2025-06-09 12:05:48'),(57,'abcd','Your order #38 has been shipped.','2025-06-09 12:10:59'),(58,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:08'),(59,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:09'),(60,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:09'),(61,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:10'),(62,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:10'),(63,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:11'),(64,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:11'),(65,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:18'),(66,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:19'),(67,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:43'),(68,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:44'),(69,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:45'),(70,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:56'),(71,'abcd','Your order #38 has been shipped.','2025-06-09 12:11:57'),(72,'abcd','Your order #38 has been shipped.','2025-06-09 12:12:18'),(73,'abcd','Your order #38 has been shipped.','2025-06-09 12:12:19'),(74,'abcd','Your order #38 has been shipped.','2025-06-09 12:23:25'),(75,'abcd','Your order #38 has been shipped.','2025-06-09 12:24:28'),(76,'abcd','Your order #38 has been shipped.','2025-06-09 12:25:40'),(77,'abcd','Your order #38 has been shipped.','2025-06-09 12:25:45'),(78,'abcd','Your order #38 has been shipped.','2025-06-09 12:26:59'),(79,'abcd','Your order #38 has been shipped.','2025-06-09 12:27:35'),(80,'abcd','Your order #38 has been shipped.','2025-06-09 12:31:54'),(81,'abcd','Your order #38 has been successfully delivered.','2025-06-09 12:33:38'),(82,'abcd','Your order #38 has been successfully delivered.','2025-06-10 04:35:02'),(83,'abcd','Your order #38 has been successfully delivered.','2025-06-10 04:45:06'),(84,'abcd','Your order #38 has been cancelled.','2025-06-10 04:45:12'),(85,'abcd','Your order #38 is being processed.','2025-06-10 04:45:16'),(86,'abcd','Your order #38 has been successfully delivered.','2025-06-10 04:45:22'),(87,'abcd','Your order #38 has been cancelled.','2025-06-10 04:46:42'),(88,'abcd','Your order #38 has been successfully delivered.','2025-06-10 04:46:50'),(89,'abcd','Your order #38 has been shipped.','2025-06-10 04:48:32'),(90,'abcd','Your order #38 has been successfully delivered.','2025-06-10 04:48:48'),(107,'mln123','Your order #42 has been successfully delivered.','2025-06-11 11:10:02'),(108,'mln123','Your order #42 has been successfully delivered.','2025-06-11 11:10:33'),(109,'mln123','Your order #42 has been shipped.','2025-06-11 11:10:56'),(110,'mln123','Your order #42 has been cancelled.','2025-06-11 11:11:01');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `price_per_unit` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,6,'Antivirus',9902.00,1),(2,1,5,'VPN',1595.00,2),(3,2,6,'Antivirus',9902.00,1),(4,2,5,'VPN',1595.00,2),(5,3,6,'Antivirus',9902.00,1),(6,3,5,'VPN',1595.00,2),(7,4,6,'Antivirus',9902.00,1),(8,4,5,'VPN',1595.00,2),(9,5,6,'Antivirus',9902.00,1),(10,5,5,'VPN',1595.00,2),(11,6,6,'Antivirus',9902.00,1),(12,6,5,'VPN',1595.00,2),(13,7,6,'Antivirus',9902.00,1),(14,7,5,'VPN',1595.00,2),(15,8,9,'Web Crawler',452.00,1),(16,15,9,'Web Crawler',452.00,1),(17,15,5,'VPN',1595.00,1),(18,16,5,'VPN',159.00,1),(19,17,5,'VPN',159.00,1),(20,18,5,'VPN',159.00,1),(21,18,4,'Firewall',99.00,1),(22,19,5,'VPN',159.00,1),(23,19,6,'Antivirus',9902.00,1),(24,19,4,'Firewall',99.00,1),(25,20,5,'VPN',159.00,2),(26,20,6,'Antivirus',9902.00,1),(27,20,4,'Firewall',99.00,1),(28,21,5,'VPN',159.00,2),(29,21,6,'Antivirus',9902.00,8),(30,21,4,'Firewall',99.00,1),(31,22,5,'VPN',159.00,2),(32,22,6,'Antivirus',9902.00,3),(33,22,4,'Firewall',99.00,1),(34,22,9,'Web Crawler',452.00,1),(35,22,7,'Backup Tool',450.00,1),(36,23,5,'VPN',159.00,2),(37,23,6,'Antivirus',9902.00,3),(38,23,4,'Firewall',99.00,1),(39,23,9,'Web Crawler',452.00,1),(40,23,7,'Backup Tool',450.00,1),(41,24,5,'VPN',159.00,2),(42,24,6,'Antivirus',9902.00,3),(43,24,4,'Firewall',99.00,1),(44,24,9,'Web Crawler',452.00,1),(45,24,7,'Backup Tool',450.00,1),(46,25,4,'Firewall',99.00,1),(47,25,5,'VPN',159.00,1),(48,25,6,'Antivirus',9902.00,1),(49,26,4,'Firewall',99.00,1),(50,27,4,'Firewall',99.00,1),(51,28,5,'VPN',159.00,1),(52,29,5,'VPN',159.00,1),(53,30,5,'VPN',159.00,1),(54,31,6,'Antivirus',9902.00,1),(55,32,5,'VPN',159.00,1),(56,33,5,'VPN',159.00,1),(57,34,10,'Forensic Tool',150.00,1),(58,35,5,'VPN',159.00,1),(59,35,6,'Antivirus',9902.00,1),(60,35,4,'Firewall',99.00,1),(62,37,4,'Firewall',99.00,1),(63,38,4,'Firewall',99.00,1),(64,39,6,'Antivirus',887.00,1),(65,40,4,'Firewall',99.00,2),(66,40,5,'VPN',159.00,2),(67,41,4,'Firewall',99.00,1),(68,42,4,'Firewall',99.00,1),(69,42,19,'Wireshark',456.00,1),(70,42,5,'VPN',159.00,1);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `total_order_price` decimal(10,2) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'Processing',
  `status_timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'Utkarshh',13092.00,'2025-06-04 08:53:42','Shipped','2025-06-11 17:34:02'),(2,'Utkarshh',13092.00,'2025-06-04 09:45:36','Processing',NULL),(3,'Utkarshh',13092.00,'2025-06-04 09:48:28','Processing',NULL),(4,'Utkarshh',13092.00,'2025-06-04 10:02:34','Processing',NULL),(5,'Utkarshh',13092.00,'2025-06-04 10:03:05','Cancelled',NULL),(6,'Utkarshh',13092.00,'2025-06-04 10:03:27','Processing',NULL),(7,'Utkarshh',13092.00,'2025-06-04 10:06:01','Processing',NULL),(8,'Utkarshh',452.00,'2025-06-04 10:21:48','Delivered',NULL),(15,'nandini',0.00,'2025-06-04 10:37:54','Processing',NULL),(16,'nandini',0.00,'2025-06-04 11:41:22','Processing',NULL),(17,'nandini',159.00,'2025-06-04 11:47:42','Processing',NULL),(18,'nandini',258.00,'2025-06-04 11:48:01','Processing',NULL),(19,'Utkarshh',10160.00,'2025-06-04 12:16:51','Processing',NULL),(20,'Utkarshh',10319.00,'2025-06-05 04:39:24','Delivered',NULL),(21,'Utkarshh',79633.00,'2025-06-05 07:09:04','Processing',NULL),(22,'Utkarshh',31025.00,'2025-06-05 07:09:30','Processing',NULL),(23,'Utkarshh',31025.00,'2025-06-05 07:20:16','Processing',NULL),(24,'Utkarshh',31025.00,'2025-06-05 07:25:38','Shipped','2025-06-11 12:58:49'),(25,'Utkarshh',10160.00,'2025-06-05 07:26:25','Processing',NULL),(26,'Utkarshh',99.00,'2025-06-05 07:27:31','Processing',NULL),(27,'Utkarshh',99.00,'2025-06-05 07:28:05','Processing',NULL),(28,'Utkarshh',159.00,'2025-06-05 07:28:43','Processing',NULL),(29,'Utkarshh',159.00,'2025-06-05 07:34:25','Processing',NULL),(30,'Utkarshh',159.00,'2025-06-05 09:52:29','Processing',NULL),(31,'Utkarshh',9902.00,'2025-06-05 09:52:48','Processing',NULL),(32,'Utkarshh',159.00,'2025-06-05 10:26:11','Processing',NULL),(33,'Utkarshh',159.00,'2025-06-06 08:25:30','Processing',NULL),(34,'Utkarshh',150.00,'2025-06-06 08:32:44','Processing',NULL),(35,'Utkarshh',10160.00,'2025-06-06 09:55:02','Processing',NULL),(37,'Utkarshh',99.00,'2025-06-07 05:44:35','Processing',NULL),(38,'abcd',99.00,'2025-06-09 11:46:43','Delivered',NULL),(39,'Utkarshh',887.00,'2025-06-10 07:45:29','Delivered','2025-06-11 13:15:52'),(40,'Utkarshh',516.00,'2025-06-10 10:40:14','Cancelled','2025-06-11 12:32:07'),(41,'Utkarshh',99.00,'2025-06-11 08:07:02','Processing',NULL),(42,'mln123',714.00,'2025-06-11 11:06:18','Cancelled','2025-06-11 16:41:01');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` varchar(50) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (4,'Firewall','Firewall tools monitor and control incoming and outgoing network traffic based on security rules. They act as a barrier between your computer and potentially harmful external networks.','99','/uploads/1748674500755.png'),(5,'VPN','VPN (Virtual Private Network) tools encrypt your internet connection and mask your IP address, ensuring secure and private browsing. They help access geo-restricted content and protect data on public Wi-Fi.','159','/uploads/1748674536938.jpg'),(6,'Antivirus','Antivirus tools detect, prevent, and remove malicious software such as viruses, worms, and trojans. They provide real-time protection and regular scanning to secure your system.','887','/uploads/1748674581457.png'),(7,'Backup Tool','Backup tools automatically create copies of your important files or system data to prevent loss due to hardware failure, accidental deletion, or malware. They support recovery of data in case of unexpected disasters.','450','/uploads/1748675164015.png'),(9,'Web Crawler','\n Crawl the Site ','452','/uploads/1749032462742.png'),(10,'Forensic Tool','Digital Forensic','150','/uploads/1749198739878.jpeg'),(16,'Bitdefender','Antivirus software providing real-time protection against malware and ransomware.','299.00','/uploads/bitdefender.png'),(17,'pfSense','Open-source firewall/router for network protection and traffic filtering.','478','/uploads/pfsense.png'),(18,'Snort','Intrusion detection system for monitoring and analyzing network traffic.','789','/uploads/snort.png'),(19,'Wireshark','Network protocol analyzer for troubleshooting and inspecting packets.','456','/uploads/wireshark.png'),(20,'Nessus','Vulnerability scanner to identify security weaknesses in systems.','1599.00','/uploads/nessus.png'),(21,'Splunk','SIEM platform for analyzing logs and detecting cyber threats.','9500.00','/uploads/splunk.png'),(22,'VeraCrypt','Encryption tool to secure files and full disk volumes.','736','/uploads/veracrypt.png'),(23,'Metasploit','Penetration testing framework for identifying and exploiting vulnerabilities.','4500.00','/uploads/metasploit.png'),(24,'Okta','Identity and access management tool with SSO and MFA capabilities.','12999.00','/uploads/okta.png'),(25,'OpenVAS','Open-source vulnerability scanning tool for networks and servers.','450','/uploads/openvas.png');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `flag` int NOT NULL DEFAULT '2',
  `resetToken` varchar(255) DEFAULT NULL,
  `tokenExpiry` datetime DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('abcd','abcd','abcd@gmail.com','$2b$10$hrN0y0fNBwOXWbMGc/RTZeHBtmxVhwbnJYmJQxc0ZQpzIus3nifAi',2,NULL,NULL),('admin','Admin Name','admin@tools.com','admin',1,NULL,NULL),('admin_tools','admins','admins@yahoo.com','$2b$10$7X76Re2sgB/pnnDE4rxmw.9LKwZkuREeS5vgrN0WrBxoW1ENQJqn2',1,NULL,NULL),('admins','admin gupta','admin@gmail.com','$2b$10$T75KdHfN.Prm4U2rUw9ck.4tQNcAw2VDngl92rXeQJe4vUDpcCBBW',2,NULL,NULL),('jatin','jatin','jatin@gmail.com','$2b$10$TiAU0pVBXELEXc4ITgrMYOG8cWIjSX1mWNsVQzHegtOX4wBHOuZ4u',2,NULL,NULL),('milan_sir','Milan','milansyst@gmail.com','$2b$10$xk.sLcFc00qNQBHe5wYB8OWGqLltR5q9x2fkyekDVnlPfTPmBV4ka',2,NULL,NULL),('mln123','milan','mlnkumar269@gmail.com','$2b$10$3hjUB7vCiRGZP.AGbEgjTe6SUFYITeRaLdIGBMJrufVhLJmLRnuBS',2,NULL,NULL),('nandini','nandini singh','nandini@gmial.com','$2b$10$bILqcDi/a8yyoeuo3ypNoOZf57peL59iBEKrgT1C4raB0EvlstM6m',2,NULL,NULL),('utkarsh','Utkarsh Gupta','utkarshgupta.976274@gmail.com','utkarsh',2,NULL,NULL),('utkarsh_gupta','Utkarsh Gupta','utkarsh.gupta200204@gmail.com','$2b$10$4bWoLggNAk4HscKJ.CK8euBW7B68BGZ26QtE3zDPT8IxV7mq6Fvsm',2,NULL,NULL),('Utkarshh','Utkarsh Gupta','utkarshgupta.97274@gmai.com','$2b$10$ZVfclUKICTedVlkJRxncuORJwDosEJt01XR5WN2THC8i7fMcfQdkW',2,NULL,NULL);
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

-- Dump completed on 2025-06-23 14:17:36
