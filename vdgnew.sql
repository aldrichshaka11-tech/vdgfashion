-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: vdg
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
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add category',7,'add_category'),(26,'Can change category',7,'change_category'),(27,'Can delete category',7,'delete_category'),(28,'Can view category',7,'view_category'),(29,'Can add category item',8,'add_categoryitem'),(30,'Can change category item',8,'change_categoryitem'),(31,'Can delete category item',8,'delete_categoryitem'),(32,'Can view category item',8,'view_categoryitem'),(33,'Can add hero banner',9,'add_herobanner'),(34,'Can change hero banner',9,'change_herobanner'),(35,'Can delete hero banner',9,'delete_herobanner'),(36,'Can view hero banner',9,'view_herobanner'),(37,'Can add marketing banner',10,'add_marketingbanner'),(38,'Can change marketing banner',10,'change_marketingbanner'),(39,'Can delete marketing banner',10,'delete_marketingbanner'),(40,'Can view marketing banner',10,'view_marketingbanner'),(41,'Can add order',11,'add_order'),(42,'Can change order',11,'change_order'),(43,'Can delete order',11,'delete_order'),(44,'Can view order',11,'view_order'),(45,'Can add product',13,'add_product'),(46,'Can change product',13,'change_product'),(47,'Can delete product',13,'delete_product'),(48,'Can view product',13,'view_product'),(49,'Can add product size',17,'add_productsize'),(50,'Can change product size',17,'change_productsize'),(51,'Can delete product size',17,'delete_productsize'),(52,'Can view product size',17,'view_productsize'),(53,'Can add product feature',16,'add_productfeature'),(54,'Can change product feature',16,'change_productfeature'),(55,'Can delete product feature',16,'delete_productfeature'),(56,'Can view product feature',16,'view_productfeature'),(57,'Can add product detail',15,'add_productdetail'),(58,'Can change product detail',15,'change_productdetail'),(59,'Can delete product detail',15,'delete_productdetail'),(60,'Can view product detail',15,'view_productdetail'),(61,'Can add product color',14,'add_productcolor'),(62,'Can change product color',14,'change_productcolor'),(63,'Can delete product color',14,'delete_productcolor'),(64,'Can view product color',14,'view_productcolor'),(65,'Can add order item',12,'add_orderitem'),(66,'Can change order item',12,'change_orderitem'),(67,'Can delete order item',12,'delete_orderitem'),(68,'Can view order item',12,'view_orderitem'),(69,'Can add payment',18,'add_payment'),(70,'Can change payment',18,'change_payment'),(71,'Can delete payment',18,'delete_payment'),(72,'Can view payment',18,'view_payment'),(73,'Can add review',19,'add_review'),(74,'Can change review',19,'change_review'),(75,'Can delete review',19,'delete_review'),(76,'Can view review',19,'view_review'),(77,'Can add brand',20,'add_brand'),(78,'Can change brand',20,'change_brand'),(79,'Can delete brand',20,'delete_brand'),(80,'Can view brand',20,'view_brand'),(81,'Can add Site Settings',21,'add_sitesettings'),(82,'Can change Site Settings',21,'change_sitesettings'),(83,'Can delete Site Settings',21,'delete_sitesettings'),(84,'Can view Site Settings',21,'view_sitesettings'),(85,'Can add mobile banner',22,'add_mobilebanner'),(86,'Can change mobile banner',22,'change_mobilebanner'),(87,'Can delete mobile banner',22,'delete_mobilebanner'),(88,'Can view mobile banner',22,'view_mobilebanner'),(89,'Can add User Address',23,'add_useraddress'),(90,'Can change User Address',23,'change_useraddress'),(91,'Can delete User Address',23,'delete_useraddress'),(92,'Can view User Address',23,'view_useraddress');
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
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1200000$hyNt8Sy9ip3R2kBKVDsDQf$nkLFDeszfyTkqYWx3Bk/IbyEFILyS2mWO/DO7Syf1y8=',NULL,1,'admin','','','jegusselvaraj@gmail.com',1,1,'2026-05-30 23:51:06.621020'),(2,'pbkdf2_sha256$600000$hw9aoopzSalxz4xQo7KyP8$zhyAGM+RvPZlSK2QSuKlrnftiaGjKkrwiX9jeUZdLcU=',NULL,0,'arunkumar','Arun','Kumar','arunkumar@gmail.com',0,1,'2026-06-08 07:01:49.596702'),(3,'pbkdf2_sha256$1200000$EG6I9KaPO7Z0rG6lg8TlHu$NyKFJaQBABDuhp07KKCH0DTvT7GBi6zzBjxSuJSv4Rk=',NULL,0,'albin','albin','jegus','albinjegus10@gmail.com',0,1,'2026-06-23 08:49:19.017196');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
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
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session'),(20,'shop','brand'),(7,'shop','category'),(8,'shop','categoryitem'),(9,'shop','herobanner'),(10,'shop','marketingbanner'),(22,'shop','mobilebanner'),(11,'shop','order'),(12,'shop','orderitem'),(18,'shop','payment'),(13,'shop','product'),(14,'shop','productcolor'),(15,'shop','productdetail'),(16,'shop','productfeature'),(17,'shop','productsize'),(19,'shop','review'),(21,'shop','sitesettings'),(23,'shop','useraddress');
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
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-05-30 23:09:54.698810'),(2,'auth','0001_initial','2026-05-30 23:09:56.898374'),(3,'admin','0001_initial','2026-05-30 23:09:57.299564'),(4,'admin','0002_logentry_remove_auto_add','2026-05-30 23:09:57.314171'),(5,'admin','0003_logentry_add_action_flag_choices','2026-05-30 23:09:57.335549'),(6,'contenttypes','0002_remove_content_type_name','2026-05-30 23:09:57.635600'),(7,'auth','0002_alter_permission_name_max_length','2026-05-30 23:09:57.808157'),(8,'auth','0003_alter_user_email_max_length','2026-05-30 23:09:57.848990'),(9,'auth','0004_alter_user_username_opts','2026-05-30 23:09:57.862362'),(10,'auth','0005_alter_user_last_login_null','2026-05-30 23:09:57.994066'),(11,'auth','0006_require_contenttypes_0002','2026-05-30 23:09:58.004506'),(12,'auth','0007_alter_validators_add_error_messages','2026-05-30 23:09:58.017230'),(13,'auth','0008_alter_user_username_max_length','2026-05-30 23:09:58.218281'),(14,'auth','0009_alter_user_last_name_max_length','2026-05-30 23:09:58.379382'),(15,'auth','0010_alter_group_name_max_length','2026-05-30 23:09:58.414082'),(16,'auth','0011_update_proxy_permissions','2026-05-30 23:09:58.449982'),(17,'auth','0012_alter_user_first_name_max_length','2026-05-30 23:09:58.643932'),(18,'sessions','0001_initial','2026-05-30 23:09:58.744746'),(19,'shop','0001_initial','2026-05-30 23:10:00.735803'),(20,'shop','0002_category_image_path','2026-05-30 23:10:00.887450'),(21,'shop','0003_remove_category_image_path','2026-05-30 23:10:01.031737'),(22,'shop','0004_order_is_active_payment','2026-05-30 23:25:26.337034'),(23,'shop','0005_product_height_product_length_product_product_type_and_more','2026-05-31 00:12:38.446932'),(24,'shop','0006_review','2026-06-03 13:01:28.283523'),(25,'shop','0007_brand_category_featured_category_icon_and_more','2026-06-03 13:01:28.745737'),(26,'shop','0008_alter_brand_banner_alter_brand_logo_and_more','2026-06-03 13:01:28.837419'),(27,'shop','0009_alter_product_parent_category','2026-06-03 13:01:28.906653'),(28,'shop','0010_sitesettings','2026-06-03 13:17:15.198908'),(29,'shop','0011_sitesettings_about_text','2026-06-03 13:22:30.454465'),(30,'shop','0012_sitesettings_logo_image','2026-06-04 06:36:39.457574'),(31,'shop','0013_order_user','2026-06-04 10:37:21.688077'),(32,'shop','0014_herobanner_mobile_image','2026-06-08 05:58:42.048025'),(33,'shop','0015_herobanner_is_default','2026-06-08 06:08:59.863707'),(34,'shop','0016_mobilebanner_remove_herobanner_mobile_image','2026-06-08 06:18:06.392646'),(35,'shop','0017_remove_product_warehouse_and_more','2026-06-16 07:10:21.655312'),(36,'shop','0018_product_image_2_product_image_3','2026-06-16 09:21:46.553355'),(37,'shop','0019_useraddress','2026-06-23 09:04:51.218415'),(38,'shop','0020_useraddress_label','2026-06-23 09:09:52.589402');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_brand`
--

DROP TABLE IF EXISTS `shop_brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_brand` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` longtext COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `shop_brand_slug_5d7ff4c0` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_brand`
--

LOCK TABLES `shop_brand` WRITE;
/*!40000 ALTER TABLE `shop_brand` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_category`
--

DROP TABLE IF EXISTS `shop_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `featured` tinyint(1) NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` longtext COLLATE utf8mb4_unicode_ci,
  `meta_keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `shop_category_slug_4508178e` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4914 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_category`
--

LOCK TABLES `shop_category` WRITE;
/*!40000 ALTER TABLE `shop_category` DISABLE KEYS */;
INSERT INTO `shop_category` VALUES (4912,'kids dresses',NULL,'',0,1,'2026-06-24 10:48:38.454723',0,NULL,NULL,NULL,NULL,NULL),(4913,'0-3M','kids dresses','',0,1,'2026-06-24 10:48:38.462862',0,NULL,NULL,NULL,NULL,NULL);
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bg` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_ref` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_categoryitem`
--

LOCK TABLES `shop_categoryitem` WRITE;
/*!40000 ALTER TABLE `shop_categoryitem` DISABLE KEYS */;
INSERT INTO `shop_categoryitem` VALUES (37,'New Born (0–3 Months)','bg-amber-100','category_items/baby_frock_GX2jcW6.png','Apparel',1,1),(38,'Infant (3–12 Months)','bg-teal-50','category_items/tshirt_green_AbgoAmq.png','Apparel',2,1),(39,'Toddler (1–3 Years)','bg-indigo-50','category_items/wooden_toy_HJfy5yV.png','Toys',3,1),(40,'Kids (3+ Years)','bg-pink-50','category_items/activity_book_vJHAHip.png','Books',4,1);
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
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_herobanner`
--

LOCK TABLES `shop_herobanner` WRITE;
/*!40000 ALTER TABLE `shop_herobanner` DISABLE KEYS */;
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
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bg` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `button_text` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_ref` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_marketingbanner`
--

LOCK TABLES `shop_marketingbanner` WRITE;
/*!40000 ALTER TABLE `shop_marketingbanner` DISABLE KEYS */;
INSERT INTO `shop_marketingbanner` VALUES (19,'Playful Montessori Wooden Toys','Inspire your child\'s imagination and early development with safe organic woods.','bg-teal-50','marketing/teddy_bear.png','SHOP WOODS','Toys',1,1),(20,'Premium Cozy Fleece Hoodies','Keep your little ones cozy during breeze times with premium breathable warmth.','bg-pink-50','marketing/dungaree_set.png','SHOP COZY','Apparel',2,1);
/*!40000 ALTER TABLE `shop_marketingbanner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_mobilebanner`
--

DROP TABLE IF EXISTS `shop_mobilebanner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_mobilebanner` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_mobilebanner`
--

LOCK TABLES `shop_mobilebanner` WRITE;
/*!40000 ALTER TABLE `shop_mobilebanner` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_mobilebanner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order`
--

DROP TABLE IF EXISTS `shop_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street_address` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pin_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `shop_order_user_id_00aba627_fk_auth_user_id` (`user_id`),
  CONSTRAINT `shop_order_user_id_00aba627_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order`
--

LOCK TABLES `shop_order` WRITE;
/*!40000 ALTER TABLE `shop_order` DISABLE KEYS */;
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
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `selected_color` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `selected_size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_orderitem_order_id_2f1b00cf_fk_shop_order_id` (`order_id`),
  KEY `shop_orderitem_product_id_48153f22_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_orderitem_order_id_2f1b00cf_fk_shop_order_id` FOREIGN KEY (`order_id`) REFERENCES `shop_order` (`id`),
  CONSTRAINT `shop_orderitem_product_id_48153f22_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `shop_payment_order_id_20828773_fk_shop_order_id` (`order_id`),
  CONSTRAINT `shop_payment_order_id_20828773_fk_shop_order_id` FOREIGN KEY (`order_id`) REFERENCES `shop_order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_payment`
--

LOCK TABLES `shop_payment` WRITE;
/*!40000 ALTER TABLE `shop_payment` DISABLE KEYS */;
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
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `discount` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tag_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` double NOT NULL,
  `reviews_count` int NOT NULL,
  `is_new` tinyint(1) NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_hex` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cart_btn_color` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `product_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `width` decimal(10,2) DEFAULT NULL,
  `barcode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost_price` decimal(10,2) NOT NULL,
  `meta_description` longtext COLLATE utf8mb4_unicode_ci,
  `meta_keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reorder_level` int NOT NULL,
  `tax_rate` decimal(5,2) NOT NULL,
  `brand_id` bigint DEFAULT NULL,
  `razorpay_buy_now_link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_2` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_3` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_product_category_id_14d7eea8_fk_shop_category_id` (`category_id`),
  KEY `shop_product_slug_30bd2d5d` (`slug`),
  KEY `shop_product_brand_id_505fec11_fk_shop_brand_id` (`brand_id`),
  CONSTRAINT `shop_product_brand_id_505fec11_fk_shop_brand_id` FOREIGN KEY (`brand_id`) REFERENCES `shop_brand` (`id`),
  CONSTRAINT `shop_product_category_id_14d7eea8_fk_shop_category_id` FOREIGN KEY (`category_id`) REFERENCES `shop_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_product`
--

LOCK TABLES `shop_product` WRITE;
/*!40000 ALTER TABLE `shop_product` DISABLE KEYS */;
INSERT INTO `shop_product` VALUES (9197,'T-SHIRT NEW BORN NB0206','kids dresses',240.00,250.00,NULL,'new',0,0,0,'FULL SLEEVE ROUND NECK T-SHIRT','products/T-SHIRTNEWBORNNB0206_image_1782298118.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:38.473751',4913,NULL,NULL,'simple','NB02033','t-shirt-new-born-nb0206','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9198,'T-SHIRT NEW BORN  NB0208','kids dresses',240.00,250.00,NULL,'new',0,0,0,'Full sleeve round neckand blue T-shirt','products/T-SHIRTNEWBORNNB0208_image_1782298118.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:38.542390',4913,NULL,NULL,'simple','NB02034','t-shirt-new-born-nb0208','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9199,'T-SHIRT NEWBORN  03M190','kids dresses',240.00,250.00,NULL,'new',0,0,0,'Round neck,  FULL sleeve, blue colour','products/T-SHIRTNEWBORN03M190_image_1782298118.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:38.614226',4913,NULL,NULL,'simple','1234ASD','t-shirt-newborn-03m190','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9200,'T-SHIRT NEW BORN  03M191','kids dresses',240.00,250.00,NULL,'new',0,0,0,'Full sleeve Dinosaur print  t-shirt','products/T-SHIRTNEWBORN03M191_image_1782298118.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:38.691428',4913,NULL,NULL,'simple','03M191','t-shirt-new-born-03m191','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9201,'LEGGINGS NEWBORN 03M3','kids dresses',180.00,199.00,NULL,'new',0,0,0,'foot close leggings, whitecolour pinkstar','products/LEGGINGSNEWBORN03M3_image_1782298118.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:38.778596',4913,NULL,NULL,'simple','03M3','leggings-newborn-03m3','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9202,'LEGGINGS NEWBORN 03M81','kids dresses',160.00,165.00,NULL,'new',0,0,0,'whitecolourfootclose wollen leggings','products/LEGGINGSNEWBORN03M81_image_1782298118.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:38.869139',4913,NULL,NULL,'simple','03M81','leggings-newborn-03m81','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9203,'LEGGINGS NEWBORN 03M4','kids dresses',160.00,199.00,NULL,'new',0,0,0,'foot close leggings  gray colour','products/LEGGINGSNEWBORN03M4_image_1782298118.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:38.962822',4913,NULL,NULL,'simple','03M4','leggings-newborn-03m4','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9204,'LEGGINGS NEWBORN NB0214','kids dresses',150.00,155.00,NULL,'new',0,0,0,'Orange colour leggings','products/LEGGINGSNEWBORNNB0214_image_1782298119.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:39.061912',4913,NULL,NULL,'simple','NB0214','leggings-newborn-nb0214','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9205,'LEGGINGS NEWBORN 03M25','kids dresses',190.00,199.00,NULL,'new',0,0,0,'foot closer leggings  stripes','products/LEGGINGSNEWBORN03M25_image_1782298119.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:39.165053',4913,NULL,NULL,'simple','03M25','leggings-newborn-03m25','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'',''),(9206,'LEGGINGS NEWBORN NB0210','kids dresses',150.00,155.00,NULL,'new',0,0,0,'half white flower  prints','products/LEGGINGSNEWBORNNB0210_image_1782298119.png','#e6fcf5','bg-teal-500 hover:bg-teal-600',20,1,'2026-06-24 10:48:39.247123',4913,NULL,NULL,'simple','NB0210','leggings-newborn-nb0210','published','pc',NULL,NULL,0.00,NULL,NULL,NULL,10,18.00,NULL,NULL,'','');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hex` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_productcolor_product_id_df9ca282_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_productcolor_product_id_df9ca282_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9317 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_productcolor`
--

LOCK TABLES `shop_productcolor` WRITE;
/*!40000 ALTER TABLE `shop_productcolor` DISABLE KEYS */;
INSERT INTO `shop_productcolor` VALUES (9307,'Default','#e6fcf5',9197),(9308,'Default','#e6fcf5',9198),(9309,'Default','#e6fcf5',9199),(9310,'Default','#e6fcf5',9200),(9311,'Default','#e6fcf5',9201),(9312,'Default','#e6fcf5',9202),(9313,'Default','#e6fcf5',9203),(9314,'Default','#e6fcf5',9204),(9315,'Default','#e6fcf5',9205),(9316,'Default','#e6fcf5',9206);
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
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_productdetail_product_id_3f4cf05d_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_productdetail_product_id_3f4cf05d_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4578 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_productdetail`
--

LOCK TABLES `shop_productdetail` WRITE;
/*!40000 ALTER TABLE `shop_productdetail` DISABLE KEYS */;
INSERT INTO `shop_productdetail` VALUES (4568,'Elegant Design','FULL SLEEVE ROUND NECK T-SHIRT',9197),(4569,'Elegant Design','Full sleeve round neckand blue T-shirt',9198),(4570,'Elegant Design','Round neck,  FULL sleeve, blue colour',9199),(4571,'Elegant Design','Full sleeve Dinosaur print  t-shirt',9200),(4572,'Elegant Design','foot close leggings, whitecolour pinkstar',9201),(4573,'Elegant Design','whitecolourfootclose wollen leggings',9202),(4574,'Elegant Design','foot close leggings  gray colour',9203),(4575,'Elegant Design','Orange colour leggings',9204),(4576,'Elegant Design','foot closer leggings  stripes',9205),(4577,'Elegant Design','half white flower  prints',9206);
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
  `feature_text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_productfeature_product_id_e9aa361c_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_productfeature_product_id_e9aa361c_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4769 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_productfeature`
--

LOCK TABLES `shop_productfeature` WRITE;
/*!40000 ALTER TABLE `shop_productfeature` DISABLE KEYS */;
INSERT INTO `shop_productfeature` VALUES (4759,'Material: Muslin / Cotton',9197),(4760,'Material: Muslin / Cotton',9198),(4761,'Material: Muslin / Cotton',9199),(4762,'Material: Muslin / Cotton',9200),(4763,'Material: Muslin / Cotton',9201),(4764,'Material: Muslin / Cotton',9202),(4765,'Material: Muslin / Cotton',9203),(4766,'Material: Muslin / Cotton',9204),(4767,'Material: Muslin / Cotton',9205),(4768,'Material: Muslin / Cotton',9206);
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
  `size` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_productsize_product_id_dbe9e821_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_productsize_product_id_dbe9e821_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6467 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_productsize`
--

LOCK TABLES `shop_productsize` WRITE;
/*!40000 ALTER TABLE `shop_productsize` DISABLE KEYS */;
INSERT INTO `shop_productsize` VALUES (6457,'standard',9197),(6458,'standard',9198),(6459,'standard',9199),(6460,'standard',9200),(6461,'standard',9201),(6462,'standard',9202),(6463,'standard',9203),(6464,'standard',9204),(6465,'standard',9205),(6466,'standard',9206);
/*!40000 ALTER TABLE `shop_productsize` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_review`
--

DROP TABLE IF EXISTS `shop_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_review_product_id_user_email_e4c87c90_uniq` (`product_id`,`user_email`),
  CONSTRAINT `shop_review_product_id_f74dddfd_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_review`
--

LOCK TABLES `shop_review` WRITE;
/*!40000 ALTER TABLE `shop_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_sitesettings`
--

DROP TABLE IF EXISTS `shop_sitesettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_sitesettings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contact_phone` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_address` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `free_shipping_threshold` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  `active_promo_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active_promo_discount` int NOT NULL,
  `is_store_open` tinyint(1) NOT NULL,
  `facebook_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instagram_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `youtube_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `about_text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_sitesettings`
--

LOCK TABLES `shop_sitesettings` WRITE;
/*!40000 ALTER TABLE `shop_sitesettings` DISABLE KEYS */;
INSERT INTO `shop_sitesettings` VALUES (1,'083001 12996','gouthamraj@vdgfashion.com','61/1,First floor, VDG Fashion Narayana complex, opp. burma hotel, Sivagami Puram, Virudhunagar, Tamil Nadu 626001',3000.00,99.00,'TREND10',10,1,'https://www.facebook.com/fashionvdg/','https://www.instagram.com/vdgfashion/','https://www.youtube.com/channel/UCLLKwEMo4FManOeDUO3jaKw','Trendy looks for every vibe. Stay stylish, every day.','logos/logo_rQIXV6v.png');
/*!40000 ALTER TABLE `shop_sitesettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_useraddress`
--

DROP TABLE IF EXISTS `shop_useraddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_useraddress` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `recipient_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `street_address` longtext NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `pin_code` varchar(20) NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  `label` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_useraddress_user_id_f6b74d1d_fk_auth_user_id` (`user_id`),
  CONSTRAINT `shop_useraddress_user_id_f6b74d1d_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_useraddress`
--

LOCK TABLES `shop_useraddress` WRITE;
/*!40000 ALTER TABLE `shop_useraddress` DISABLE KEYS */;
INSERT INTO `shop_useraddress` VALUES (1,'albinjegus','9750750519','mulavilai ,veeyannor po','nagercoil','tamilnadu','629177',1,'2026-06-23 09:16:29.418764','2026-06-23 09:16:29.418793',3,'home'),(2,'albinjegus','9750750519','kovilpatti','nagercoil','tamilnadu','629145',0,'2026-06-23 09:17:15.902804','2026-06-23 09:17:15.902825',3,'office');
/*!40000 ALTER TABLE `shop_useraddress` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-24 18:21:50
