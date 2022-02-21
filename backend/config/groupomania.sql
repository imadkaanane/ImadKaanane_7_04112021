/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/ groupomania /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE groupomania;

DROP TABLE IF EXISTS comments;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PostId` int DEFAULT NULL,
  `UserId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ArticleId` (`PostId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS posts;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text,
  `picture` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS users;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3;

INSERT INTO comments(id,text,createdAt,updatedAt,PostId,UserId) VALUES(11,X'706173206d616c20212121','2022-01-30 00:15:01','2022-01-30 00:15:01',NULL,1),(20,X'706173206d616c2021212121','2022-02-03 21:04:43','2022-02-03 21:04:43',NULL,1),(21,X'62656c6c6520746f66','2022-02-04 17:04:01','2022-02-04 17:04:01',NULL,1),(22,X'706173206d616c','2022-02-05 17:43:19','2022-02-05 17:43:19',NULL,1);

INSERT INTO posts(id,text,picture,youtube,createdAt,updatedAt,UserId) VALUES(27,NULL,'http://localhost:3300/images/Images-Photo-occasion-Banner-2-.jpg1643870050546.jpg',NULL,'2022-02-03 06:34:10','2022-02-03 06:34:10',1),(30,NULL,'http://localhost:3300/images/istockphoto-1093110112-612x612.jpg1644084398124.jpg',NULL,'2022-02-05 18:06:38','2022-02-05 18:06:38',1);
INSERT INTO users(id,firstName,lastName,email,password,photo,isAdmin,createdAt,updatedAt) VALUES(1,'Imad','Kaanane','imadkaanane@groupomania.com','$2b$10$4LhLvRvkoU2/XFsdXWH3PeZ4INIkufT6m1foiI/J6DAdKrsrRkI5.','http://localhost:3300/images/random-user.png1643908764735.png',1,'2021-11-13 06:23:56','2022-02-03 17:19:24'),(26,'Titi','Toto','tototiti@groupomania.com','$2b$10$thEEmoRhrndwpbxnMVwkH.xsIOd7rRASz0LYtrld1x5uYrg0MUKkm','http://localhost:3300/images/photo-portrait-0081.jpg1643717347925.jpg',0,'2022-02-01 12:07:06','2022-02-01 12:09:07'),(42,'Tata','Toto','toto@groupomania.com','$2b$10$TXfuSmdNOLSa/rgypjLDS.NhMax1orat/og8t2S2polKMhPiClgv.','http://localhost:3300/images/istockphoto-176017922-1024x1024.jpg1643869080242.jpg',0,'2022-02-03 06:18:00','2022-02-03 06:18:00'),(50,'Daphnée','Franchet','franchet@groupomania.com','$2b$10$ZHb6N32oKbZw/6kWg1u1j.DKrbc9u7nOBDfieqtojvrxDh6CT8ksK','http://localhost:3300/images/Unknow.jpg',0,'2022-02-08 17:23:04','2022-02-08 17:23:04');