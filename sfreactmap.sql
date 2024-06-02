-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour sfreactmap
CREATE DATABASE IF NOT EXISTS `sfreactmap` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sfreactmap`;

-- Listage de la structure de table sfreactmap. article
CREATE TABLE IF NOT EXISTS `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `century_id` int NOT NULL,
  `country_id` int NOT NULL,
  `author_id` int NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `border` json NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_23A0E66452289B6` (`century_id`),
  KEY `IDX_23A0E66F92F3E70` (`country_id`),
  KEY `IDX_23A0E66F675F31B` (`author_id`),
  CONSTRAINT `FK_23A0E66452289B6` FOREIGN KEY (`century_id`) REFERENCES `century` (`id`),
  CONSTRAINT `FK_23A0E66F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_23A0E66F92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.article : ~7 rows (environ)
REPLACE INTO `article` (`id`, `century_id`, `country_id`, `author_id`, `title`, `summary`, `border`, `creation_date`) VALUES
	(1, 1, 1, 1, 'France in the 20\'s', 'Informations about France equipment before the first world war', '[]', '2024-02-12 14:29:42'),
	(2, 1, 5, 3, 'La BELGIQUE', 'Un petit r&eacute;sum&eacute; de la Belgique', '[]', '2024-05-25 17:41:19'),
	(4, 5, 1, 2, 'LA belle eqpofj', 'fkkdkpofepokfokpfopkfqopkqdspokdsqokdkpo', '[]', '2024-03-08 09:25:54'),
	(5, 1, 3, 3, 'Truc Italie', 'fsdfdsqfsdqfdsffsfdsqdfdqsfsqfddqsfdsqfdsqf', '[]', '2024-05-25 15:28:53'),
	(7, 1, 5, 3, 'ggfsgfd', 'gfsdgfsdgfsdg', '[]', '2024-05-29 14:03:51'),
	(8, 2, 4, 3, 'jgjhfjgfj', 'fgjfgjhfg', '[]', '2024-05-29 14:04:10'),
	(9, 4, 4, 3, 'gfsdgfd', 'gfsgfdg', '[]', '2024-05-29 14:52:32');

-- Listage de la structure de table sfreactmap. article_edited
CREATE TABLE IF NOT EXISTS `article_edited` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int DEFAULT NULL,
  `article_id` int DEFAULT NULL,
  `date_edit` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_A80D3BE1F675F31B` (`author_id`),
  KEY `IDX_A80D3BE17294869C` (`article_id`),
  CONSTRAINT `FK_A80D3BE17294869C` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`),
  CONSTRAINT `FK_A80D3BE1F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.article_edited : ~0 rows (environ)

-- Listage de la structure de table sfreactmap. article_like
CREATE TABLE IF NOT EXISTS `article_like` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int DEFAULT NULL,
  `article_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_1C21C7B2F675F31B` (`author_id`),
  KEY `IDX_1C21C7B27294869C` (`article_id`),
  CONSTRAINT `FK_1C21C7B27294869C` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`),
  CONSTRAINT `FK_1C21C7B2F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.article_like : ~0 rows (environ)

-- Listage de la structure de table sfreactmap. category
CREATE TABLE IF NOT EXISTS `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.category : ~3 rows (environ)
REPLACE INTO `category` (`id`, `label`, `picture`) VALUES
	(1, 'Weapon', 'none'),
	(2, 'Armour', 'none'),
	(3, 'Tool', 'none');

-- Listage de la structure de table sfreactmap. century
CREATE TABLE IF NOT EXISTS `century` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.century : ~6 rows (environ)
REPLACE INTO `century` (`id`, `year`) VALUES
	(1, '1900'),
	(2, '1400'),
	(3, '1500'),
	(4, '1600'),
	(5, '1700'),
	(6, '1800');

-- Listage de la structure de table sfreactmap. comment
CREATE TABLE IF NOT EXISTS `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message_id` int DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation_date` datetime NOT NULL,
  `is_edited` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_9474526C537A1329` (`message_id`),
  KEY `IDX_9474526CF675F31B` (`author_id`),
  CONSTRAINT `FK_9474526C537A1329` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`),
  CONSTRAINT `FK_9474526CF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.comment : ~14 rows (environ)
REPLACE INTO `comment` (`id`, `message_id`, `author_id`, `text`, `creation_date`, `is_edited`) VALUES
	(1, 15, 1, 'No.', '2024-02-28 16:06:43', 0),
	(2, 15, 1, 'Search for it.', '2024-02-28 16:07:19', 0),
	(3, 4, 1, 'Gneugneu Gneugneu', '2024-02-29 20:42:46', 0),
	(6, 16, 3, 'toi la merde', '2024-05-20 19:28:05', 0),
	(7, 16, 3, 'horrible', '2024-05-20 19:31:23', 0),
	(8, 16, 3, 'horrible', '2024-05-20 19:31:29', 0),
	(9, 16, 3, 'horrible', '2024-05-20 19:31:33', 0),
	(10, 16, 3, 'horrible', '2024-05-20 19:31:34', 0),
	(11, 16, 3, 'horrible', '2024-05-20 19:31:34', 0),
	(12, 16, 3, 'horrible', '2024-05-20 19:31:35', 0),
	(13, 16, 3, 'horrible', '2024-05-20 19:31:35', 0),
	(14, 4, 3, 'ok', '2024-05-20 19:33:07', 0),
	(15, 4, 3, 'okiiii', '2024-05-20 19:33:33', 0),
	(16, 16, 3, 'border de ùerde', '2024-05-20 19:35:18', 0);

-- Listage de la structure de table sfreactmap. country
CREATE TABLE IF NOT EXISTS `country` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_code` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.country : ~6 rows (environ)
REPLACE INTO `country` (`id`, `name`, `country_code`) VALUES
	(1, 'France', 'FRA'),
	(2, 'Germany', 'DEU'),
	(3, 'Italy', 'ITA'),
	(4, 'Spain', 'ESP'),
	(5, 'Belgium', 'BEL'),
	(6, 'United Kingdom', 'GBR');

-- Listage de la structure de table sfreactmap. doctrine_migration_versions
CREATE TABLE IF NOT EXISTS `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Listage des données de la table sfreactmap.doctrine_migration_versions : ~0 rows (environ)
REPLACE INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
	('DoctrineMigrations\\Version20240206073744', '2024-02-10 15:36:53', 936),
	('DoctrineMigrations\\Version20240530125655', '2024-05-30 13:35:58', 36),
	('DoctrineMigrations\\Version20240602145630', '2024-06-02 19:12:32', 211);

-- Listage de la structure de table sfreactmap. equipment
CREATE TABLE IF NOT EXISTS `equipment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int NOT NULL,
  `sub_category_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D338D583F7BFE87C` (`sub_category_id`),
  KEY `IDX_D338D583F675F31B` (`author_id`),
  CONSTRAINT `FK_D338D583F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_D338D583F7BFE87C` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.equipment : ~11 rows (environ)
REPLACE INTO `equipment` (`id`, `author_id`, `sub_category_id`, `name`, `text`, `creation_date`) VALUES
	(1, 13, 1, 'French Grenadier Infantry Sword', 'Concessisti anteferre maximum sit sit ordinis mihi dignitatemque mihi in beneficio publicae suspicionibus suspicionibus quanta in concessisti maxime vel M fructum fructum sit dignitatemque omnis vel mihi ante reique quidem commemoratis in mihi in enim cum multis tuo enim multis quidem M cum commemoratis commemoratis huius commemoratis vel tanta doloribus iudicio reique cum ante reique fructum omnis et ordinis suspicionibus Marcellum quo hodierno in multis est suspicionibus maxime in omnibus maximum laus in summo me suspicionibus actae anteferre maximum concessisti Marcellum commemoratis cum in senatui est senatus quidem dignitatemque in maximum senatui vel in tuo consensu fructum tanta in publicae.', '2024-06-02 21:32:08'),
	(2, 3, 2, 'Brandenburg Rapier', 'dqsdqsdqsdq', '2024-06-02 21:32:08'),
	(3, 3, 4, 'Zweihander', 'A really big sword, in german Zwei means Two and Hander means two handed', '2024-06-02 21:32:09'),
	(4, 19, 5, 'Kris', 'ghhgfhgfhfhgfhfhfgfhghffh', '2024-06-02 21:32:14'),
	(5, 6, 4, 'Blue Great Sword ™ ', 'Blue sword comming from somewhere', '2024-06-02 21:32:10'),
	(6, 3, 6, '? F ? a ? l', '? ? ? ? ? ? ? ?', '2024-06-02 21:32:13'),
	(7, 2, 7, 'Catapult', 'A grand catapult used in wars', '2024-06-02 21:32:11'),
	(13, 13, 7, 'Cat', 'Crying cat', '2024-06-02 21:32:11'),
	(15, 19, 4, 'Rat sword', 'small rat holding a big sword', '2024-06-02 21:32:12'),
	(18, 6, 8, 'scary helmet', 'very spooky', '2024-06-02 21:32:12'),
	(20, 3, 1, 'Sword breaker', 'a sword with a blade made to catch the enemy\'s sword and either block it or break it.', '2024-06-02 21:32:12');

-- Listage de la structure de table sfreactmap. equipment_section
CREATE TABLE IF NOT EXISTS `equipment_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_id` int DEFAULT NULL,
  `equipment_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_5B08B500D823E37A` (`section_id`),
  KEY `IDX_5B08B500517FE9FE` (`equipment_id`),
  CONSTRAINT `FK_5B08B500517FE9FE` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`),
  CONSTRAINT `FK_5B08B500D823E37A` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.equipment_section : ~11 rows (environ)
REPLACE INTO `equipment_section` (`id`, `section_id`, `equipment_id`) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(3, 3, 3),
	(4, 4, 7),
	(5, NULL, 13),
	(6, 7, 15),
	(7, 7, 4),
	(8, NULL, 7),
	(10, NULL, 2),
	(11, NULL, 3),
	(12, 5, 2);

-- Listage de la structure de table sfreactmap. img
CREATE TABLE IF NOT EXISTS `img` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.img : ~10 rows (environ)
REPLACE INTO `img` (`id`, `path`) VALUES
	(1, 'AH-3411.jpg'),
	(2, '501409_2_.jpg'),
	(3, '116-44014.jpg'),
	(4, '88wgss_1_.jpg'),
	(5, 'MoonlightGreatsword.jpg'),
	(6, '40505925_n.jpg'),
	(7, '220px-Replica_catapult.jpg'),
	(8, '300px-Crying_Cat_screaming-65e8c0a5e158a.jpg'),
	(9, '3y2sn2-65ea03ce83be9.jpg'),
	(10, 'Capturefghfhfghfgghfghf-65ea060bd30b9.jpg'),
	(11, '_sonic_forces__persona_5_joker_by_fzone96_dc3nrfi-350t-6640e1e8e2b18.png'),
	(12, '618ea464-7c23-4162-92e5-1dc8032012d6-6652b6033cc42.jpg'),
	(13, '2ff802e973ce5a9ac34eaf8132706809-6653230dccb7c.webp'),
	(14, '4d0965cd5df8f267bf30ab89d5f9d0a2-6655c52c93ac7.jpg');

-- Listage de la structure de table sfreactmap. img_object
CREATE TABLE IF NOT EXISTS `img_object` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img_id` int DEFAULT NULL,
  `equipment_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_75881B8CC06A9F55` (`img_id`),
  KEY `IDX_75881B8C517FE9FE` (`equipment_id`),
  CONSTRAINT `FK_75881B8C517FE9FE` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`),
  CONSTRAINT `FK_75881B8CC06A9F55` FOREIGN KEY (`img_id`) REFERENCES `img` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.img_object : ~11 rows (environ)
REPLACE INTO `img_object` (`id`, `img_id`, `equipment_id`) VALUES
	(1, 1, 1),
	(2, 2, 2),
	(3, 4, 3),
	(4, 3, 4),
	(5, 5, 5),
	(6, 6, 6),
	(7, 7, 7),
	(8, 8, 13),
	(10, 10, 15),
	(12, 12, 18),
	(14, 14, 20);

-- Listage de la structure de table sfreactmap. message
CREATE TABLE IF NOT EXISTS `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int NOT NULL DEFAULT '1',
  `topic_id` int NOT NULL,
  `text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation_date` datetime NOT NULL,
  `picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_edited` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_B6BD307FF675F31B` (`author_id`),
  KEY `IDX_B6BD307F1F55203D` (`topic_id`),
  CONSTRAINT `FK_B6BD307F1F55203D` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`),
  CONSTRAINT `FK_B6BD307FF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.message : ~11 rows (environ)
REPLACE INTO `message` (`id`, `author_id`, `topic_id`, `text`, `creation_date`, `picture`, `is_edited`) VALUES
	(1, 1, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultricies eros at sapien egestas, a hendrerit erat pretium. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed at nunc nunc. Maecenas sit amet tristique nisi. Nullam eget elementum nisi. Nullam porta, eros a venenatis scelerisque, eros sem luctus mi, dictum vestibulum dui lorem eget sem. Quisque fermentum ligula vel nulla mattis, sit amet mollis nibh hendrerit. Cras ultricies nunc id eros dictum efficitur. Donec id dui vitae nulla aliquam sagittis in vitae mi. Ut a nibh in enim ullamcorper sagittis a nec sem. Donec posuere a enim et viverra. Nulla malesuada a nunc sit amet ullamcorper. Aenean convallis augue quis feugiat eleifend. ', '2024-02-26 10:00:27', 'cccc', NULL),
	(2, 1, 2, 'Aenean convallis augue quis feugiat eleifend. HFGDHFDGHFGHFDH', '2024-02-26 10:01:09', NULL, NULL),
	(3, 1, 3, 'mi. Ut a nibh in enim ullamcorper sagittisnd. ', '2024-02-26 10:01:26', NULL, NULL),
	(4, 1, 4, 'Cata Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultricies eros at sapien egestas, a hendrerit erat pretium. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed at nunc nunc. Maecenas sit amet tristique nisi. Nullam eget elementum nisi. Nullam porta, eros a venenatis scelerisque, eros sem luctus mi, dictum vestibulum dui lorem eget sem. Quisque fermentum ligula vel nulla mattis, sit amet mollis nibh hendrerit. Cras ultricies nunc id eros dictum efficitur. Donec id dui vitae nulla aliquam sagittis in vitae mi. Ut a nibh in enim ullamcorper sagittis a nec sem. Donec posuere a enim et viverra. Nulla malesuada a nunc sit amet ullamcorper. Aenean convallis augue quis feugiat eleifend.', '2024-02-27 15:43:25', NULL, NULL),
	(6, 1, 6, 'I took it from a sleeping fat guy with horns.', '2024-02-28 13:02:22', NULL, NULL),
	(15, 1, 6, 'Show it', '2024-02-28 15:35:18', NULL, NULL),
	(16, 1, 4, 'C\'est de la m*rde', '2024-02-28 17:27:55', NULL, NULL),
	(17, 1, 4, 'Horrible', '2024-02-28 17:28:50', NULL, NULL),
	(19, 3, 1, 'show', '2024-05-20 12:41:32', NULL, NULL),
	(20, 3, 1, 'is it iron ?', '2024-05-20 12:54:37', NULL, NULL),
	(21, 3, 1, 'or steel ', '2024-05-20 12:55:09', NULL, NULL),
	(22, 3, 1, 'or steel ', '2024-05-20 12:56:59', NULL, NULL),
	(23, 3, 1, 'or wool', '2024-05-20 12:58:07', NULL, NULL),
	(25, 3, 16, 'Can i make one at home and how dangerous would it be ?', '2024-05-28 14:11:08', NULL, NULL);

-- Listage de la structure de table sfreactmap. refresh_tokens
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refresh_token` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valid` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_9BACE7E1C74F2195` (`refresh_token`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.refresh_tokens : ~5 rows (environ)
REPLACE INTO `refresh_tokens` (`id`, `refresh_token`, `username`, `valid`) VALUES
	(4, 'd6550fc578c05459cff6e281af02bead21827ee41faa80efeaa0a6eda9e3fc3f25f220e35911cb914187baaed45b846588800ba67953c0ff85f79006f22f9ff4', 'kant1@exemple.com', '2024-06-29 13:54:37'),
	(6, '9780b4619f06b43bf973ff3e52781cac53f1f503960ff0c9378699e406793094666b13906599e49b98a06a28f0d8cc0907625f81304650829d02278a8c214451', 'kant1@exemple.com', '2024-06-29 14:18:46'),
	(7, '549bf7a5d665648afc0a552dc6ac9825db2d8102bf4aab1140ed17e88f3f37b6ddff6f34c9b27335e428360a02b4a6ad246fbe5c098ca86317829d3fdc44183f', 'kant1@exemple.com', '2024-06-29 14:58:26'),
	(8, 'fbdf13177b7e65b7fc0ff93072bc77f9f471c7a5e17d7072fa8e0a6194c91922ae553d0590c1c15c26fe6a3ebcb72fe1da420c2285b1f39cdb7409ca2410c554', 'kant1@exemple.com', '2024-06-30 12:14:27'),
	(9, 'caa8ba4e874a585dbff2b3d036b26b0e2fe9444a2e41c25662277eeb4d2cfd9d1a71899004adf1df0f9b8309f3af946c7ffee651a846ce5f7f35d6c6a91f3235', 'kant1@exemple.com', '2024-07-01 14:39:07');

-- Listage de la structure de table sfreactmap. section
CREATE TABLE IF NOT EXISTS `section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_id` int DEFAULT NULL,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2D737AEF7294869C` (`article_id`),
  KEY `FK_section_user` (`user_id`),
  CONSTRAINT `FK_2D737AEF7294869C` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`),
  CONSTRAINT `FK_section_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.section : ~7 rows (environ)
REPLACE INTO `section` (`id`, `article_id`, `title`, `text`, `summary`, `user_id`, `creation_date`) VALUES
	(1, 1, 'Section Weapon', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus gravida nulla, et interdum turpis commodo at. Mauris condimentum nulla in aliquet congue. Maecenas ac sodales ligula. Phasellus tincidunt ipsum vel diam semper dignissim. Sed ut cursus nisl. Vestibulum elementum varius lobortis. Nullam finibus purus vel eleifend ullamcorper. Morbi a mattis lacus.', 'Weapons list', 1, '2024-06-02 21:38:34'),
	(2, 1, 'Section Armour', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus gravida nulla, et interdum turpis commodo at. Mauris condimentum nulla in aliquet congue. Maecenas ac sodales ligula. Phasellus tincidunt ipsum vel diam semper dignissim. Sed ut cursus nisl. Vestibulum elementum varius lobortis. Nullam finibus purus vel eleifend ullamcorper. Morbi a mattis lacus.', 'Armour lists', 3, '2024-06-02 21:38:34'),
	(3, 2, 'Armour', 'dfsgdsfgsdgdg', 'ptiyt truc belge', 3, '2024-06-02 21:38:35'),
	(4, 1, 'Tools', 'A complete  list of all of their tools and artillery', 'tools and artillery', 8, '2024-06-02 21:38:35'),
	(5, 2, 'Weapons', 'fsdqsdq', 'dqsdqdsqd', 2, '2024-06-02 21:38:35'),
	(7, 5, 'iTALIA KFDSKFKDS', 'ITALKF DSKFDSFQ', 'FDSQFDQSFDQSFDSQFSDFSQFDSQF', 6, '2024-06-02 21:38:36');

-- Listage de la structure de table sfreactmap. sub_category
CREATE TABLE IF NOT EXISTS `sub_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_BCE3F79812469DE2` (`category_id`),
  CONSTRAINT `FK_BCE3F79812469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.sub_category : ~7 rows (environ)
REPLACE INTO `sub_category` (`id`, `category_id`, `label`) VALUES
	(1, 1, 'Sword'),
	(2, 1, 'Rapier'),
	(3, 1, 'Spear'),
	(4, 1, 'Great-Sword'),
	(5, 1, 'Dagger'),
	(6, 1, 'Flail'),
	(7, 3, 'Artillery'),
	(8, 2, 'Helmet');

-- Listage de la structure de table sfreactmap. topic
CREATE TABLE IF NOT EXISTS `topic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int DEFAULT NULL,
  `equipment_id` int DEFAULT NULL,
  `article_id` int DEFAULT NULL,
  `title` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation_date` datetime NOT NULL,
  `allow_picture` tinyint(1) NOT NULL DEFAULT '0',
  `is_edited` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `IDX_9D40DE1BF675F31B` (`author_id`),
  KEY `IDX_9D40DE1B517FE9FE` (`equipment_id`),
  KEY `IDX_9D40DE1B7294869C` (`article_id`),
  CONSTRAINT `FK_9D40DE1B517FE9FE` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`),
  CONSTRAINT `FK_9D40DE1B7294869C` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`),
  CONSTRAINT `FK_9D40DE1BF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.topic : ~6 rows (environ)
REPLACE INTO `topic` (`id`, `author_id`, `equipment_id`, `article_id`, `title`, `creation_date`, `allow_picture`, `is_edited`) VALUES
	(1, 1, 3, NULL, 'Is this sword big enough ?', '2024-02-26 09:32:22', 0, 0),
	(2, 1, 5, NULL, 'Why is the sword blue ?', '2024-02-26 10:01:09', 0, 0),
	(3, 1, NULL, 2, 'Why is Belgium not  a part of France ?', '2024-02-26 09:33:45', 0, 0),
	(4, 1, 7, NULL, 'Big catapult goes b oo om', '2024-02-26 15:15:07', 0, 0),
	(6, 1, 5, NULL, 'Got myself a nice green sword, but not very magic', '2024-02-28 13:02:22', 0, 0),
	(16, 3, 6, NULL, 'Can i DIY ?', '2024-05-28 14:11:08', 0, 0);

-- Listage de la structure de table sfreactmap. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table sfreactmap.user : ~11 rows (environ)
REPLACE INTO `user` (`id`, `email`, `roles`, `password`, `username`, `is_verified`, `creation_date`) VALUES
	(1, 'truc@machin.com', '[]', '123', 'user', 0, '2024-06-02 21:36:54'),
	(2, 'quentin@exemple.com', '[]', '$2y$13$3wBjhWdxQ61vIZD0VGtiY.ndCRkha27RoUXKfsXLC54kLNpWPc2Pq', 'quanrin', 0, '2024-06-02 21:36:55'),
	(3, 'kant1@exemple.com', '["ROLE_USER"]', '$2y$13$Af..lRzeMW6djAl.hjzybecJQBZq7cmXSCe22b6Q8.KVmVkEDF8d6', 'kant1', 0, '2024-06-02 21:36:55'),
	(6, 'quentin@truc.com', '[]', '$2y$13$DuIcGbSpI6Y9KL6Z9QPyMuaXtDS7Xzlxnc/swRfp69984kl4ckXPm', 'qautnin', 0, '2024-06-02 21:36:55'),
	(7, 'trernte@truc.com', '[]', '$2y$13$GF8c/OXfNbBq95DwJkIosecfH3wzk/Nj4eXp7Xy/QoFnoBrLNdVVu', 'kak3', 0, '2024-06-02 21:36:56'),
	(8, 'quent@exemple.com', '[]', '$2y$13$SNIBe62KHRJTZX/W8xR5SOF2FiJfB64HwA4UiTxgvMXEb3re88AWe', 'qsfqsfdqsfdq', 0, '2024-06-02 21:36:56'),
	(10, 'quent@exe.com', '[]', '$2y$13$D7eaMxni1WAjPSFZ4/brsOuVfEPI.TYcfxSKLc9jvaBtbXkbS0c6a', 'qsfqsfdqsfdq', 0, '2024-06-02 21:36:57'),
	(12, 'quent@exge.com', '[]', '$2y$13$0u5/P5aUaIuwK1l78C5Ru.mGzmCzBgr8bWAzaEfOYLqUgx8CUXrNa', 'qsfqsfdqsfdq', 0, '2024-06-02 21:36:57'),
	(13, 'fish@fish.fr', '[]', '$2y$13$A2ZGSK2Vqhx.92DQmjfVd.dGGBeLikUuIxkEJsZA2hHuTbMVDA5Ai', 'fdfdsgfsdgfsdgfsd', 0, '2024-06-02 21:36:58'),
	(14, 'quent12@exemple.com', '[]', '$2y$13$M6ov2Lh0D/fTZL55OEjmYejuL0.h1K40IdLBmbL8k7IoPksDnaew.', 'rtetrete', 0, '2024-06-02 21:36:58'),
	(17, 'quent1u2@exemple.com', '[]', '$2y$13$rc40kC/685fuhcQ43CYoMe5VbE26X/Rq9oc6Km5mrfwkjVEKfe//.', 'rtetrete', 0, '2024-06-02 21:36:58'),
	(19, 'trerntee@truc.com', '[]', '$2y$13$6t2M6FWvgKYJPMtUFCxfk.7GxREBZ1tXNR08z3QaVcq3KS/GlWHKu', 'kak3', 0, '2024-06-02 21:36:59');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
