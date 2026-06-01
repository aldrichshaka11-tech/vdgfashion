-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: vgd
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add category',7,'add_category'),(26,'Can change category',7,'change_category'),(27,'Can delete category',7,'delete_category'),(28,'Can view category',7,'view_category'),(29,'Can add category item',8,'add_categoryitem'),(30,'Can change category item',8,'change_categoryitem'),(31,'Can delete category item',8,'delete_categoryitem'),(32,'Can view category item',8,'view_categoryitem'),(33,'Can add hero banner',9,'add_herobanner'),(34,'Can change hero banner',9,'change_herobanner'),(35,'Can delete hero banner',9,'delete_herobanner'),(36,'Can view hero banner',9,'view_herobanner'),(37,'Can add marketing banner',10,'add_marketingbanner'),(38,'Can change marketing banner',10,'change_marketingbanner'),(39,'Can delete marketing banner',10,'delete_marketingbanner'),(40,'Can view marketing banner',10,'view_marketingbanner'),(41,'Can add order',11,'add_order'),(42,'Can change order',11,'change_order'),(43,'Can delete order',11,'delete_order'),(44,'Can view order',11,'view_order'),(45,'Can add product',13,'add_product'),(46,'Can change product',13,'change_product'),(47,'Can delete product',13,'delete_product'),(48,'Can view product',13,'view_product'),(49,'Can add product size',17,'add_productsize'),(50,'Can change product size',17,'change_productsize'),(51,'Can delete product size',17,'delete_productsize'),(52,'Can view product size',17,'view_productsize'),(53,'Can add product feature',16,'add_productfeature'),(54,'Can change product feature',16,'change_productfeature'),(55,'Can delete product feature',16,'delete_productfeature'),(56,'Can view product feature',16,'view_productfeature'),(57,'Can add product detail',15,'add_productdetail'),(58,'Can change product detail',15,'change_productdetail'),(59,'Can delete product detail',15,'delete_productdetail'),(60,'Can view product detail',15,'view_productdetail'),(61,'Can add product color',14,'add_productcolor'),(62,'Can change product color',14,'change_productcolor'),(63,'Can delete product color',14,'delete_productcolor'),(64,'Can view product color',14,'view_productcolor'),(65,'Can add order item',12,'add_orderitem'),(66,'Can change order item',12,'change_orderitem'),(67,'Can delete order item',12,'delete_orderitem'),(68,'Can view order item',12,'view_orderitem'),(69,'Can add payment',18,'add_payment'),(70,'Can change payment',18,'change_payment'),(71,'Can delete payment',18,'delete_payment'),(72,'Can view payment',18,'view_payment');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1200000$i3b0nWEValGdvaguStXBCf$7C8kf82alpxDQ1KUdVtb9MuvFsdRysP2AxBkmPSZ1iY=',NULL,1,'admin','','','jegusselvaraj@gmail.com',1,1,'2026-05-30 23:51:06.621020');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session'),(7,'shop','category'),(8,'shop','categoryitem'),(9,'shop','herobanner'),(10,'shop','marketingbanner'),(11,'shop','order'),(12,'shop','orderitem'),(18,'shop','payment'),(13,'shop','product'),(14,'shop','productcolor'),(15,'shop','productdetail'),(16,'shop','productfeature'),(17,'shop','productsize');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-05-30 23:09:54.698810'),(2,'auth','0001_initial','2026-05-30 23:09:56.898374'),(3,'admin','0001_initial','2026-05-30 23:09:57.299564'),(4,'admin','0002_logentry_remove_auto_add','2026-05-30 23:09:57.314171'),(5,'admin','0003_logentry_add_action_flag_choices','2026-05-30 23:09:57.335549'),(6,'contenttypes','0002_remove_content_type_name','2026-05-30 23:09:57.635600'),(7,'auth','0002_alter_permission_name_max_length','2026-05-30 23:09:57.808157'),(8,'auth','0003_alter_user_email_max_length','2026-05-30 23:09:57.848990'),(9,'auth','0004_alter_user_username_opts','2026-05-30 23:09:57.862362'),(10,'auth','0005_alter_user_last_login_null','2026-05-30 23:09:57.994066'),(11,'auth','0006_require_contenttypes_0002','2026-05-30 23:09:58.004506'),(12,'auth','0007_alter_validators_add_error_messages','2026-05-30 23:09:58.017230'),(13,'auth','0008_alter_user_username_max_length','2026-05-30 23:09:58.218281'),(14,'auth','0009_alter_user_last_name_max_length','2026-05-30 23:09:58.379382'),(15,'auth','0010_alter_group_name_max_length','2026-05-30 23:09:58.414082'),(16,'auth','0011_update_proxy_permissions','2026-05-30 23:09:58.449982'),(17,'auth','0012_alter_user_first_name_max_length','2026-05-30 23:09:58.643932'),(18,'sessions','0001_initial','2026-05-30 23:09:58.744746'),(19,'shop','0001_initial','2026-05-30 23:10:00.735803'),(20,'shop','0002_category_image_path','2026-05-30 23:10:00.887450'),(21,'shop','0003_remove_category_image_path','2026-05-30 23:10:01.031737'),(22,'shop','0004_order_is_active_payment','2026-05-30 23:25:26.337034'),(23,'shop','0005_product_height_product_length_product_product_type_and_more','2026-05-31 00:12:38.446932');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_category`
--

DROP TABLE IF EXISTS `shop_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parent_category` varchar(255) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_category`
--

LOCK TABLES `shop_category` WRITE;
/*!40000 ALTER TABLE `shop_category` DISABLE KEYS */;
INSERT INTO `shop_category` VALUES (2,'Apparel',NULL,'categories/baby_frock_JFa48ub.png',1,1,'2026-05-30 23:30:53.532370'),(3,'Toys',NULL,'categories/wooden_toy.png',2,1,'2026-05-30 23:30:55.572765'),(4,'Books',NULL,'categories/activity_book.png',3,1,'2026-05-30 23:30:57.605465'),(5,'Accessories',NULL,'categories/accessories_category.png',4,1,'2026-05-30 23:30:59.686143');
/*!40000 ALTER TABLE `shop_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_categoryitem`
--

DROP TABLE IF EXISTS `shop_categoryitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_categoryitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `bg` varchar(50) NOT NULL,
  `image` varchar(100) NOT NULL,
  `category_ref` varchar(100) NOT NULL,
  `order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_categoryitem`
--

LOCK TABLES `shop_categoryitem` WRITE;
/*!40000 ALTER TABLE `shop_categoryitem` DISABLE KEYS */;
INSERT INTO `shop_categoryitem` VALUES (1,'New Born (0–3 Months)','bg-amber-100','category_items/baby_frock.png','Apparel',1,1),(2,'Infant (3–12 Months)','bg-teal-50','category_items/tshirt_green.png','Apparel',2,1),(3,'Toddler (1–3 Years)','bg-indigo-50','category_items/wooden_toy.png','Toys',3,1),(4,'Kids (3+ Years)','bg-pink-50','category_items/activity_book.png','Books',4,1);
/*!40000 ALTER TABLE `shop_categoryitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_herobanner`
--

DROP TABLE IF EXISTS `shop_herobanner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_herobanner` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `image` varchar(100) NOT NULL,
  `alt` varchar(255) NOT NULL,
  `link` varchar(500) NOT NULL,
  `order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_herobanner`
--

LOCK TABLES `shop_herobanner` WRITE;
/*!40000 ALTER TABLE `shop_herobanner` DISABLE KEYS */;
INSERT INTO `shop_herobanner` VALUES (1,'New Born Collections','Up to 50% Off on cute organic cotton wear','banners/banner1.png','New Born Collection Banner','/shop?category=Apparel',1,1,'2026-05-30 23:31:22.768099'),(2,'Activity Learning Toys','Creative sensory sets for growing minds','banners/banner2.png','Montessori Toys Banner','/shop?category=Toys',2,1,'2026-05-30 23:31:24.837148'),(3,'Premium Kids Accessories','Durable school bags, shoes, and safety gear','banners/banner3.png','Kids Accessories Banner','/shop?category=Accessories',3,1,'2026-05-30 23:31:26.912756');
/*!40000 ALTER TABLE `shop_herobanner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_marketingbanner`
--

DROP TABLE IF EXISTS `shop_marketingbanner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_marketingbanner` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `bg` varchar(50) NOT NULL,
  `image` varchar(100) NOT NULL,
  `button_text` varchar(100) NOT NULL,
  `category_ref` varchar(100) NOT NULL,
  `order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_marketingbanner`
--

LOCK TABLES `shop_marketingbanner` WRITE;
/*!40000 ALTER TABLE `shop_marketingbanner` DISABLE KEYS */;
INSERT INTO `shop_marketingbanner` VALUES (1,'Playful Montessori Wooden Toys','Inspire your child\'s imagination and early development with safe organic woods.','bg-teal-50','marketing/wooden_toy.png','SHOP WOODS','Toys',1,1),(2,'Premium Cozy Fleece Hoodies','Keep your little ones cozy during breeze times with premium breathable warmth.','bg-pink-50','marketing/hoodie_pink.png','SHOP COZY','Apparel',2,1);
/*!40000 ALTER TABLE `shop_marketingbanner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order`
--

DROP TABLE IF EXISTS `shop_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` varchar(100) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `email` varchar(254) DEFAULT NULL,
  `phone` varchar(50) NOT NULL,
  `street_address` longtext NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `pin_code` varchar(20) NOT NULL,
  `payment_method` varchar(20) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order`
--

LOCK TABLES `shop_order` WRITE;
/*!40000 ALTER TABLE `shop_order` DISABLE KEYS */;
INSERT INTO `shop_order` VALUES (1,'ORD-2026-0001','John Doe','john.doe@example.com','+1 555-0199','123 Cozy Lane','Sunnyvale','California','94085','card',2198.00,200.00,0.00,1998.00,'2026-05-30 23:31:41.331137',1),(2,'ORD-2026-0002','Alice Smith','alice.smith@example.com','+1 555-0144','789 Playful Ave','Austin','Texas','78701','upi',499.00,0.00,50.00,549.00,'2026-05-30 23:31:41.345545',1);
/*!40000 ALTER TABLE `shop_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_orderitem`
--

DROP TABLE IF EXISTS `shop_orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `selected_color` varchar(100) DEFAULT NULL,
  `selected_size` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_orderitem_order_id_2f1b00cf_fk_shop_order_id` (`order_id`),
  KEY `shop_orderitem_product_id_48153f22_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_orderitem_order_id_2f1b00cf_fk_shop_order_id` FOREIGN KEY (`order_id`) REFERENCES `shop_order` (`id`),
  CONSTRAINT `shop_orderitem_product_id_48153f22_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_orderitem`
--

LOCK TABLES `shop_orderitem` WRITE;
/*!40000 ALTER TABLE `shop_orderitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_payment`
--

DROP TABLE IF EXISTS `shop_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(255) NOT NULL,
  `payment_method` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `shop_payment_order_id_20828773_fk_shop_order_id` (`order_id`),
  CONSTRAINT `shop_payment_order_id_20828773_fk_shop_order_id` FOREIGN KEY (`order_id`) REFERENCES `shop_order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_payment`
--

LOCK TABLES `shop_payment` WRITE;
/*!40000 ALTER TABLE `shop_payment` DISABLE KEYS */;
INSERT INTO `shop_payment` VALUES (1,'TXN-9876543210','Credit Card',1998.00,'completed',1,'2026-05-30 23:31:41.339472',1),(2,'TXN-1122334455','UPI Transfer',549.00,'completed',1,'2026-05-30 23:31:41.350456',2);
/*!40000 ALTER TABLE `shop_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_product`
--

DROP TABLE IF EXISTS `shop_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parent_category` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `discount` varchar(50) DEFAULT NULL,
  `tag_type` varchar(50) DEFAULT NULL,
  `rating` double NOT NULL,
  `reviews_count` int NOT NULL,
  `is_new` tinyint(1) NOT NULL,
  `description` longtext NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `color_hex` varchar(50) NOT NULL,
  `cart_btn_color` varchar(100) DEFAULT NULL,
  `stock` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `product_type` varchar(50) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `width` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_product_category_id_14d7eea8_fk_shop_category_id` (`category_id`),
  KEY `shop_product_slug_30bd2d5d` (`slug`),
  CONSTRAINT `shop_product_category_id_14d7eea8_fk_shop_category_id` FOREIGN KEY (`category_id`) REFERENCES `shop_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_product`
--

LOCK TABLES `shop_product` WRITE;
/*!40000 ALTER TABLE `shop_product` DISABLE KEYS */;
INSERT INTO `shop_product` VALUES (1,'Baby Cotton Frock','Girls Clothing',899.00,1199.00,'25% OFF','trending',4.8,120,1,'Cloud-soft baby frock made with 100% premium organic cotton. Features safe back buttons and high breathability for girls.','products/baby_frock.png','#f3d9fa','bg-indigo-600 hover:bg-indigo-700',45,1,'2026-05-30 23:31:01.712223',2,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(2,'Activity Learning Book','Educational',499.00,699.00,'30% OFF','popular',4.9,85,0,'Interactive sensory book helping toddlers learn motor skills, shapes, colors, and basic vocabulary.','products/activity_book.png','#e8f0fe','bg-pink-600 hover:bg-pink-700',60,1,'2026-05-30 23:31:03.830246',4,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(3,'Kids School Backpack','School Supplies',1299.00,1599.00,'18% OFF','new',4.5,32,1,'Ergonomic, lightweight black backpack designed with dual cushioned straps and spacious water-resistant compartments.','products/backpack_black.png','#212529','bg-teal-600 hover:bg-teal-700',15,1,'2026-05-30 23:31:05.925663',5,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(4,'Khaki Cargo Pants','Boys Clothing',799.00,999.00,'20% OFF','casual',4.6,47,0,'Durable khaki cargo trousers with multiple utility pockets and elastic drawstring waist for flexible fit.','products/cargo_pants_khaki.png','#d7ccc8','bg-amber-600 hover:bg-amber-700',35,1,'2026-05-30 23:31:08.037976',2,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(5,'Cotton Pink Hoodie','Unisex Clothing',1199.00,1499.00,'20% OFF','cozy',4.7,58,1,'Super-soft inner fleece cotton hoodie keeping your kids warm and fashionable during cool breeze days.','products/hoodie_pink.png','#f8bbd0','bg-purple-600 hover:bg-purple-700',25,1,'2026-05-30 23:31:10.168765',2,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(6,'Classic Blue Jeans','Boys Clothing',999.00,1299.00,'23% OFF','essential',4.4,92,0,'Stretchable denim classic jeans tailored to resist high-intensity play while maintaining a smart fit.','products/jeans_blue.png','#bbdefb','bg-blue-600 hover:bg-blue-700',40,1,'2026-05-30 23:31:12.282159',2,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(7,'Kids Striped Shirt','Boys Clothing',699.00,899.00,'22% OFF','smart',4.6,24,1,'100% premium woven linen striped shirt with half-sleeves, perfect for summer outings and birthday celebrations.','products/shirt_striped.png','#e0f2f1','bg-teal-500 hover:bg-teal-600',30,1,'2026-05-30 23:31:14.407304',2,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(8,'Urban White Sneakers','Shoes',1499.00,1999.00,'25% OFF','sporty',4.8,73,1,'Anti-slip orthopedic athletic sneakers equipped with soft foam insoles and breathable mesh fabric.','products/sneakers_white.png','#ffffff','bg-slate-700 hover:bg-slate-800',18,1,'2026-05-30 23:31:16.512501',5,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(9,'Organic Green T-Shirt','Boys Clothing',499.00,599.00,'16% OFF','eco',4.3,15,0,'Lightweight combed organic cotton green crewneck tee featuring friendly animal graphics printed with water-based ink.','products/tshirt_green.png','#c8e6c9','bg-emerald-600 hover:bg-emerald-700',50,1,'2026-05-30 23:31:18.600633',2,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(10,'Premium Wooden Toy Set','Montessori',1599.00,1999.00,'20% OFF','premium',4.9,104,1,'Eco-friendly non-toxic natural wood stacker puzzle set supporting hand-eye coordination and spatial reasoning.','products/wooden_toy.png','#ffe0b2','bg-orange-600 hover:bg-orange-700',22,1,'2026-05-30 23:31:20.685280',3,NULL,NULL,'simple',NULL,NULL,'published','pc',NULL),(11,'testing','New Born (0–3 Months)',22.00,23.00,NULL,'trending',0,0,0,'testing','products/auto_Zo2KjNk.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',50,1,'2026-05-31 00:32:41.456097',2,22.00,22.00,'simple','3sad','d','published','pc',22.00);
/*!40000 ALTER TABLE `shop_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_productcolor`
--

DROP TABLE IF EXISTS `shop_productcolor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_productcolor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `hex` varchar(50) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_productcolor_product_id_df9ca282_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_productcolor_product_id_df9ca282_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_productcolor`
--

LOCK TABLES `shop_productcolor` WRITE;
/*!40000 ALTER TABLE `shop_productcolor` DISABLE KEYS */;
INSERT INTO `shop_productcolor` VALUES (1,'Sage Green','#e6fcf5',1),(2,'Pink Frock','#f3d9fa',1),(3,'Off White','#f8f9fa',1),(4,'Sky Blue','#e8f0fe',2),(5,'Sunny Yellow','#fff9db',2),(6,'Obsidian Black','#212529',3),(7,'Ocean Blue','#1971c2',3),(8,'Khaki Beige','#d7ccc8',4),(9,'Olive Green','#558b2f',4),(10,'Blossom Pink','#f8bbd0',5),(11,'Heather Gray','#cfd8dc',5),(12,'Denim Blue','#1971c2',6),(13,'Charcoal Black','#343a40',6),(14,'Aqua Stripe','#e0f2f1',7),(15,'Tan Stripe','#efebe9',7),(16,'Urban White','#ffffff',8),(17,'Pastel Pink','#fbc5d8',8),(18,'Leaf Green','#c8e6c9',9),(19,'Mustard Yellow','#fff3bf',9),(20,'Multi Colorwood','#ffe0b2',10),(21,'Natural Beechwood','#faf0e6',10),(22,'Sage Green','#e6fcf5',11),(23,'Off White','#f8f9fa',11);
/*!40000 ALTER TABLE `shop_productcolor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_productdetail`
--

DROP TABLE IF EXISTS `shop_productdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_productdetail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_productdetail_product_id_3f4cf05d_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_productdetail_product_id_3f4cf05d_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_productdetail`
--

LOCK TABLES `shop_productdetail` WRITE;
/*!40000 ALTER TABLE `shop_productdetail` DISABLE KEYS */;
INSERT INTO `shop_productdetail` VALUES (1,'Premium Comfort','Cloud-soft fabric designed specifically to stay gentle on child skin.',1),(2,'Sizing & Fit','Standard comfort fit allowing loose play breathability.',1),(3,'Sensory Development','Stimulates multi-sensory development and hand-eye logic coordination.',2),(4,'Ergonomic Back Support','Engineered to distribute load evenly across kids back shoulders.',3),(5,'Durable For Outdoor Play','Reinforced knee stitches make it resistant to heavy play and crawling.',4),(6,'Cozy Comfort Layer','Snug yet highly breathable for layering during cold weather seasons.',5),(7,'Flex Fit Denim','Adapts to body motions allowing active running, crawling and squatting.',6),(8,'Summer Breeze Woven','Optimal moisture absorption keeping skin cool on hot sunny beach days.',7),(9,'Orthopedic Insole Support','Provides natural heel cushion supporting toddlers first steps arches.',8),(10,'Eco Soft Fabric','Super breathable fabric gentle for warm afternoons or casual nursery nap.',9),(11,'Montessori Play','Promotes logical stacking order, size scaling, and fine motor skills.',10),(12,'Premium Comfort','Cloud-soft fabric designed specifically to stay gentle on child skin.',11),(13,'Sizing & Fit','Standard comfort fit allowing loose play breathability and active crawling.',11);
/*!40000 ALTER TABLE `shop_productdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_productfeature`
--

DROP TABLE IF EXISTS `shop_productfeature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_productfeature` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `feature_text` varchar(255) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_productfeature_product_id_e9aa361c_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_productfeature_product_id_e9aa361c_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_productfeature`
--

LOCK TABLES `shop_productfeature` WRITE;
/*!40000 ALTER TABLE `shop_productfeature` DISABLE KEYS */;
INSERT INTO `shop_productfeature` VALUES (1,'Material: 100% Organic Muslin Cotton',1),(2,'Stitch: Soft interlocking flat seams',1),(3,'Care: Gentle machine wash cold',1),(4,'Interactive textured surfaces',2),(5,'Built-in toddler safety mirror',2),(6,'Water-resistant fabric pages',2),(7,'Waterproof high-grade nylon',3),(8,'Orthopedic breathable back cushion',3),(9,'Dual side mesh pockets',3),(10,'Heavy-duty cotton twill fabric',4),(11,'Adjustable elastic waist drawstring',4),(12,'6 functional utility deep pockets',4),(13,'Inner brushed fleece lining',5),(14,'Soft ribbed wrist cuffs and hem',5),(15,'Chafing-free zipper front lock',5),(16,'Hyper-stretch comfortable denim',6),(17,'Soft inner waistband lining',6),(18,'Eco-friendly stone wash process',6),(19,'Breathable lightweight organic linen',7),(20,'Premium coconut shell front buttons',7),(21,'Classic relaxed camp collar',7),(22,'Anti-slip shock absorber sole',8),(23,'Dual quick loop Velcro straps',8),(24,'Washable premium canvas structure',8),(25,'100% fine combed jersey cotton',9),(26,'Non-toxic allergen free chest print',9),(27,'Tagless collar neck label',9),(28,'Premium solid organic beechwood',10),(29,'Eco non-toxic water based paints',10),(30,'Curved corners preventing scratch hazards',10),(31,'Material: 100% Organic Muslin Cotton',11),(32,'Stitch: Soft interlocking seams',11),(33,'Care: Gentle machine wash cold',11);
/*!40000 ALTER TABLE `shop_productfeature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_productsize`
--

DROP TABLE IF EXISTS `shop_productsize`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_productsize` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `size` varchar(50) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_productsize_product_id_dbe9e821_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_productsize_product_id_dbe9e821_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_productsize`
--

LOCK TABLES `shop_productsize` WRITE;
/*!40000 ALTER TABLE `shop_productsize` DISABLE KEYS */;
INSERT INTO `shop_productsize` VALUES (1,'0-3M',1),(2,'3-6M',1),(3,'6-12M',1),(4,'One Size',2),(5,'M',3),(6,'L',3),(7,'1-2Y',4),(8,'2-3Y',4),(9,'3-4Y',4),(10,'2-3Y',5),(11,'3-4Y',5),(12,'4-5Y',5),(13,'1-2Y',6),(14,'2-3Y',6),(15,'3-4Y',6),(16,'4-5Y',6),(17,'1-2Y',7),(18,'2-3Y',7),(19,'3-4Y',7),(20,'S (Size 5)',8),(21,'M (Size 7)',8),(22,'L (Size 9)',8),(23,'6-12M',9),(24,'12-18M',9),(25,'18-24M',9),(26,'Standard',10),(27,'0-1M',11),(28,'1-3M',11),(29,'3-6M',11);
/*!40000 ALTER TABLE `shop_productsize` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-01 10:31:02
