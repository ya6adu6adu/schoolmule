-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Мар 20 2013 г., 17:10
-- Версия сервера: 5.5.24-log
-- Версия PHP: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `schoolmule`
--

-- --------------------------------------------------------

--
-- Структура таблицы `administrators`
--

CREATE TABLE IF NOT EXISTS `administrators` (
  `admininstrator_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `customer_id` int(11) NOT NULL DEFAULT '0',
  `entity_id` int(11) NOT NULL,
  `rw` tinyint(4) NOT NULL DEFAULT '0',
  `login_name` varchar(255) DEFAULT NULL,
  `login_pass` varchar(255) DEFAULT NULL,
  `freeze` tinyint(4) NOT NULL DEFAULT '0',
  `zip` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country_id` int(11) NOT NULL DEFAULT '0',
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admininstrator_id`),
  KEY `course_room_id` (`admininstrator_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `administrators`
--

INSERT INTO `administrators` (`admininstrator_id`, `created_at`, `first_name`, `last_name`, `customer_id`, `entity_id`, `rw`, `login_name`, `login_pass`, `freeze`, `zip`, `city`, `country_id`, `phone`, `email`) VALUES
(1, '2012-10-22 08:51:30', 'Test', 'Test', 2, 1, 0, 'Test', 'ZovwCIzmBp', 0, '1234', 'London', 0, '123456789', 'test@test.test'),
(4, '2012-10-22 10:03:26', 'Demo', 'Demo', 1, 2, 0, 'Demo', 'mNhsyMf4Ja', 0, '0', 'Madrid', 0, '456789123', 'test@test.test');

-- --------------------------------------------------------

--
-- Структура таблицы `assessements`
--

CREATE TABLE IF NOT EXISTS `assessements` (
  `assessement_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assessement_en` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`assessement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `assignmentperformance_pupil`
--

CREATE TABLE IF NOT EXISTS `assignmentperformance_pupil` (
  `assignmentperformance_pupil_id` int(11) NOT NULL AUTO_INCREMENT,
  `assignment_id` int(11) DEFAULT NULL,
  `performance_id` int(11) DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `pupil_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`assignmentperformance_pupil_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `checkpupil`
--

CREATE TABLE IF NOT EXISTS `checkpupil` (
  `check` varchar(50) CHARACTER SET latin1 NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `checkpupil`
--

INSERT INTO `checkpupil` (`check`) VALUES
('Staff/Admin');

-- --------------------------------------------------------

--
-- Структура таблицы `courses`
--

CREATE TABLE IF NOT EXISTS `courses` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `title_en` varchar(255) COLLATE utf8_bin NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) NOT NULL,
  `course_room_id` int(11) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `courses`
--

INSERT INTO `courses` (`course_id`, `subject_id`, `points`, `title_en`, `created_at`, `sort_order`, `course_room_id`) VALUES
(1, 1, 12, 'English', '2012-12-07 07:40:02', 0, 1),
(2, 2, 30, 'Mathematics', '2012-12-07 07:40:02', 1, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `course_objectives`
--

CREATE TABLE IF NOT EXISTS `course_objectives` (
  `objective_id` int(11) NOT NULL AUTO_INCREMENT,
  `objectivegroup_id` int(11) DEFAULT NULL,
  `studygroup_id` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT '5',
  `title_en` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_bin,
  `grading` text COLLATE utf8_bin,
  `pupil_performance_assessment_id` int(11) NOT NULL DEFAULT '1',
  `resultset_id` int(11) NOT NULL DEFAULT '1',
  `quality` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT 'A',
  PRIMARY KEY (`objective_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=75 ;

--
-- Дамп данных таблицы `course_objectives`
--

INSERT INTO `course_objectives` (`objective_id`, `objectivegroup_id`, `studygroup_id`, `weight`, `title_en`, `created_at`, `sort_order`, `description`, `grading`, `pupil_performance_assessment_id`, `resultset_id`, `quality`) VALUES
(38, 23, 1, 20, 'Writing English', '2013-02-19 13:21:35', 2, '', '<p>Its tiny MCE editor!</p>', 1, 1, 'A'),
(39, 27, 1, 20, 'English litterature', '2013-02-19 13:22:01', 4, NULL, NULL, 1, 1, 'B'),
(40, 27, 1, 20, 'English history', '2013-02-19 13:22:03', 6, NULL, NULL, 1, 1, 'F'),
(42, 25, 3, 16, 'Formula understanding', '2013-02-19 13:22:38', 9, NULL, NULL, 1, 1, 'A'),
(43, 26, 2, 16, 'Faculty', '2013-02-19 13:23:08', 10, NULL, NULL, 1, 1, 'A'),
(44, 26, 2, 16, 'Math timeing', '2013-02-19 13:23:10', 11, NULL, NULL, 1, 1, 'A'),
(47, 31, 5, 16, 'Swedish Reading', '2013-03-18 13:30:34', 17, NULL, NULL, 1, 1, 'A'),
(49, 32, 7, 16, 'new objective', '2013-03-18 19:02:25', 19, NULL, NULL, 1, 1, 'A'),
(70, 23, 1, 20, 'objectivebjective', '2013-03-20 16:34:46', 22, NULL, NULL, 1, 1, 'A'),
(73, 27, 1, 20, 'objectivebjective (duplicate)', '2013-03-20 16:47:49', 3, NULL, NULL, 1, 1, 'A'),
(74, 25, 3, 20, 'English history (duplicate)', '2013-03-20 16:48:03', 8, NULL, NULL, 1, 1, 'F');

-- --------------------------------------------------------

--
-- Структура таблицы `course_objective_groups`
--

CREATE TABLE IF NOT EXISTS `course_objective_groups` (
  `objectivegroup_id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `studygroup_id` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) DEFAULT '0',
  PRIMARY KEY (`objectivegroup_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=43 ;

--
-- Дамп данных таблицы `course_objective_groups`
--

INSERT INTO `course_objective_groups` (`objectivegroup_id`, `title_en`, `studygroup_id`, `created_at`, `sort_order`) VALUES
(23, 'English language', 1, '2013-02-19 13:19:03', 1),
(25, 'Intelligence', 3, '2013-02-19 13:19:19', 3),
(26, 'Math methods', 2, '2013-02-19 13:19:21', 4),
(27, 'The UK', 1, '2013-02-19 13:21:07', 5),
(31, 'Swedish', 5, '2013-03-18 13:30:19', 9),
(32, 'new objectivegroup', 7, '2013-03-18 19:02:20', 10);

-- --------------------------------------------------------

--
-- Структура таблицы `course_rooms`
--

CREATE TABLE IF NOT EXISTS `course_rooms` (
  `course_room_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `title_en` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `owner_id` int(11) NOT NULL DEFAULT '0',
  `shared` tinyint(4) NOT NULL DEFAULT '0',
  `description` text,
  PRIMARY KEY (`course_room_id`),
  KEY `course_room_id` (`course_room_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Дамп данных таблицы `course_rooms`
--

INSERT INTO `course_rooms` (`course_room_id`, `created_at`, `title_en`, `sort_order`, `owner_id`, `shared`, `description`) VALUES
(1, '2012-10-19 07:22:15', 'new room 2', 1, 1, 0, '<p>12313123</p>'),
(6, '2012-10-19 08:10:08', 'new room duplicate room  merged', 6, 0, 0, '<p>new description 123123123</p>'),
(10, '2012-10-19 09:05:15', 'duplicate room', 7, 0, 0, '{}'),
(11, '2012-10-19 09:05:22', 'duplicate room', 8, 0, 0, '<p>123123123</p>'),
(12, '2012-10-19 09:11:39', 'new room duplicate room  merged', 9, 0, 0, '<p>new description 123123131</p>'),
(13, '2012-10-19 09:13:38', 'new room duplicate room merged', 10, 0, 0, 'new description'),
(14, '2012-10-19 09:13:53', 'new room', 11, 0, 0, 'new description'),
(15, '2012-10-19 09:46:23', 'new room', 12, 0, 0, 'new description'),
(16, '2012-12-04 10:42:55', 'new room', 13, 0, 0, 'new description'),
(17, '2013-01-25 07:49:13', 'new room', 14, 0, 0, 'new description'),
(18, '2013-01-25 08:10:05', 'new room', 15, 0, 0, 'new description'),
(19, '2013-01-25 08:14:49', 'new room', 16, 0, 0, 'new description'),
(20, '2013-01-25 08:14:52', 'new room', 17, 0, 0, 'new description');

-- --------------------------------------------------------

--
-- Структура таблицы `course_rooms_assignments`
--

CREATE TABLE IF NOT EXISTS `course_rooms_assignments` (
  `assignment_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `element_id` int(11) NOT NULL DEFAULT '0',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `number` varchar(50) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `content_en` text,
  `owner_notes_en` text,
  `published_date` datetime DEFAULT NULL,
  `published_passed` tinyint(4) NOT NULL DEFAULT '0',
  `activation_date` datetime DEFAULT NULL,
  `deadline_date` datetime DEFAULT NULL,
  `deadline_passed` tinyint(4) NOT NULL DEFAULT '0',
  `studygroup_id` int(11) DEFAULT NULL,
  `shared` tinyint(4) NOT NULL DEFAULT '0',
  `sbmission_not_assessed` int(11) NOT NULL,
  `sbmission_not_passed` int(11) NOT NULL,
  `publication` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'always',
  `activation` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'Always',
  `deadline` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'No deadline',
  PRIMARY KEY (`assignment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Дамп данных таблицы `course_rooms_assignments`
--

INSERT INTO `course_rooms_assignments` (`assignment_id`, `created_at`, `element_id`, `sort_order`, `number`, `title_en`, `content_en`, `owner_notes_en`, `published_date`, `published_passed`, `activation_date`, `deadline_date`, `deadline_passed`, `studygroup_id`, `shared`, `sbmission_not_assessed`, `sbmission_not_passed`, `publication`, `activation`, `deadline`) VALUES
(2, '2013-03-20 15:32:24', 0, 2, NULL, 'English Level Second', NULL, NULL, NULL, 0, NULL, '2013-04-03 00:00:00', 0, 1, 0, 0, 0, 'always', 'Always', 'After # weeks'),
(7, '2013-03-20 16:52:14', 0, 3, NULL, 'Matanalizing Level 1', NULL, NULL, NULL, 0, NULL, '2013-03-29 00:00:00', 0, 2, 0, 0, 0, 'always', 'Always', 'At date and time'),
(8, '2013-03-20 16:52:39', 0, 4, NULL, 'new assignment', NULL, NULL, NULL, 0, NULL, NULL, 0, 1, 0, 0, 0, 'always', 'Always', 'No deadline');

-- --------------------------------------------------------

--
-- Структура таблицы `course_rooms_elements`
--

CREATE TABLE IF NOT EXISTS `course_rooms_elements` (
  `element_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `course_room_id` int(11) NOT NULL DEFAULT '0',
  `folder_id` int(11) NOT NULL DEFAULT '0',
  `title_en` varchar(255) DEFAULT NULL,
  `edit_content_en` text,
  `published_content_en` text,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`element_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=61 ;

--
-- Дамп данных таблицы `course_rooms_elements`
--

INSERT INTO `course_rooms_elements` (`element_id`, `created_at`, `course_room_id`, `folder_id`, `title_en`, `edit_content_en`, `published_content_en`, `sort_order`) VALUES
(1, '2012-10-19 07:25:23', 1, 1, 'new element', NULL, NULL, 1),
(2, '2012-10-19 07:26:12', 1, 2, 'new element', NULL, NULL, 2),
(3, '2012-10-19 07:26:17', 1, 1, 'duplicate element', NULL, NULL, 3),
(4, '2012-10-19 07:27:45', 1, 1, 'duplicate element', NULL, NULL, 4),
(9, '2012-10-19 08:10:08', 6, 5, 'new element', NULL, NULL, 9),
(10, '2012-10-19 08:10:08', 6, 5, 'duplicate element', NULL, NULL, 10),
(11, '2012-10-19 08:10:08', 6, 5, 'duplicate element', NULL, NULL, 11),
(12, '2012-10-19 08:10:08', 6, 6, 'new element', NULL, NULL, 12),
(13, '2012-10-19 08:10:08', 6, 7, 'new element', NULL, NULL, 13),
(14, '2012-10-19 08:10:08', 6, 7, 'duplicate element', NULL, NULL, 14),
(15, '2012-10-19 08:10:08', 6, 7, 'duplicate element', NULL, NULL, 15),
(16, '2012-10-19 08:10:08', 6, 8, 'new element', NULL, NULL, 16),
(25, '2012-10-19 09:05:15', 10, 14, 'new element', NULL, NULL, 17),
(26, '2012-10-19 09:05:15', 10, 14, 'duplicate element', NULL, NULL, 18),
(27, '2012-10-19 09:05:15', 10, 14, 'duplicate element', NULL, NULL, 19),
(28, '2012-10-19 09:05:15', 10, 15, 'new element', NULL, NULL, 20),
(29, '2012-10-19 09:05:22', 11, 17, 'new element', NULL, NULL, 21),
(30, '2012-10-19 09:05:22', 11, 17, 'duplicate element', NULL, NULL, 22),
(31, '2012-10-19 09:05:22', 11, 17, 'duplicate element', NULL, NULL, 23),
(32, '2012-10-19 09:05:22', 11, 18, 'new element', NULL, NULL, 24),
(33, '2012-10-19 09:11:39', 12, 20, 'new element', NULL, NULL, 25),
(34, '2012-10-19 09:11:39', 12, 20, 'duplicate element', NULL, NULL, 26),
(35, '2012-10-19 09:11:39', 12, 20, 'duplicate element', NULL, NULL, 27),
(36, '2012-10-19 09:11:39', 12, 21, 'new element', NULL, NULL, 28),
(37, '2012-10-19 09:11:39', 12, 23, 'new element', NULL, NULL, 29),
(38, '2012-10-19 09:11:39', 12, 23, 'duplicate element', NULL, NULL, 30),
(39, '2012-10-19 09:11:39', 12, 23, 'duplicate element', NULL, NULL, 31),
(40, '2012-10-19 09:11:39', 12, 24, 'new element', NULL, NULL, 32),
(41, '2012-10-19 09:13:38', 13, 26, 'new element', NULL, NULL, 33),
(42, '2012-10-19 09:13:38', 13, 26, 'duplicate element', NULL, NULL, 34),
(43, '2012-10-19 09:13:38', 13, 26, 'duplicate element', NULL, NULL, 35),
(44, '2012-10-19 09:13:38', 13, 27, 'new element', NULL, NULL, 36),
(45, '2012-10-19 09:13:38', 13, 29, 'new element', NULL, NULL, 37),
(46, '2012-10-19 09:13:38', 13, 29, 'duplicate element', NULL, NULL, 38),
(47, '2012-10-19 09:13:38', 13, 29, 'duplicate element', NULL, NULL, 39),
(48, '2012-10-19 09:13:38', 13, 30, 'new element', NULL, NULL, 40),
(49, '2012-10-19 09:40:45', 6, 32, 'new element', NULL, NULL, 41),
(50, '2012-10-19 09:40:45', 6, 32, 'duplicate element', NULL, NULL, 42),
(51, '2012-10-19 09:40:45', 6, 32, 'duplicate element', NULL, NULL, 43),
(52, '2012-11-30 06:12:43', 6, 50, 'duplicate element', NULL, NULL, 45),
(53, '2012-12-04 10:40:18', 6, 5, 'new element', NULL, NULL, 46),
(54, '2012-12-04 10:43:07', 1, 2, 'new element', NULL, NULL, 47),
(55, '2013-01-25 08:04:55', 1, 36, 'new element (duplicate)', NULL, NULL, 48),
(56, '2013-01-25 08:04:55', 1, 36, 'new element (duplicate)', NULL, NULL, 49),
(57, '2013-01-25 08:14:56', 1, 0, 'new element', NULL, NULL, 50),
(58, '2013-01-25 08:14:59', 1, 0, 'new element', NULL, NULL, 51),
(59, '2013-01-25 08:15:03', 1, 0, 'new element', NULL, NULL, 52),
(60, '2013-01-25 08:15:15', 1, 0, 'new element', NULL, NULL, 53);

-- --------------------------------------------------------

--
-- Структура таблицы `course_room_elements_sections`
--

CREATE TABLE IF NOT EXISTS `course_room_elements_sections` (
  `section_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `element_id` int(11) NOT NULL DEFAULT '0',
  `title_en` varchar(255) DEFAULT NULL,
  `edit_content_en` text,
  `published_content_en` text,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`section_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `course_room_elements_sections`
--

INSERT INTO `course_room_elements_sections` (`section_id`, `created_at`, `element_id`, `title_en`, `edit_content_en`, `published_content_en`, `sort_order`) VALUES
(1, '2012-12-04 10:40:23', 0, 'new section', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `course_room_folders`
--

CREATE TABLE IF NOT EXISTS `course_room_folders` (
  `folder_id` int(11) NOT NULL AUTO_INCREMENT,
  `folder_parent_id` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `course_room_id` int(11) NOT NULL DEFAULT '0',
  `title_en` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`folder_id`),
  KEY `course_room_id` (`course_room_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=38 ;

--
-- Дамп данных таблицы `course_room_folders`
--

INSERT INTO `course_room_folders` (`folder_id`, `folder_parent_id`, `created_at`, `course_room_id`, `title_en`, `sort_order`) VALUES
(1, 0, '2012-10-19 07:25:21', 11, 'new folder', 21),
(2, 0, '2012-10-19 07:26:12', 1, 'duplicate folder', 4),
(5, 0, '2012-10-19 08:10:08', 6, 'new folder 3', 7),
(6, 0, '2012-10-19 08:10:08', 6, 'duplicate folder', 9),
(7, 0, '2012-10-19 08:10:08', 6, 'new folder', 11),
(8, 0, '2012-10-19 08:10:08', 6, 'duplicate folder', 12),
(13, 0, '2012-10-19 08:55:06', 1, 'new folder', 3),
(14, 0, '2012-10-19 09:05:15', 10, 'new folder', 17),
(15, 0, '2012-10-19 09:05:15', 10, 'duplicate folder', 18),
(16, 0, '2012-10-19 09:05:15', 10, 'new folder', 19),
(17, 0, '2012-10-19 09:05:22', 11, 'new folder', 20),
(18, 0, '2012-10-19 09:05:22', 11, 'duplicate folder', 22),
(19, 0, '2012-10-19 09:05:22', 11, 'new folder', 23),
(20, 0, '2012-10-19 09:11:39', 12, 'new folder', 24),
(21, 0, '2012-10-19 09:11:39', 12, 'duplicate folder', 25),
(22, 0, '2012-10-19 09:11:39', 12, 'new folder', 26),
(23, 0, '2012-10-19 09:11:39', 12, 'new folder', 27),
(24, 0, '2012-10-19 09:11:39', 12, 'duplicate folder', 28),
(25, 0, '2012-10-19 09:11:39', 12, 'new folder', 29),
(26, 0, '2012-10-19 09:13:38', 13, 'new folder', 30),
(27, 0, '2012-10-19 09:13:38', 13, 'duplicate folder', 31),
(28, 0, '2012-10-19 09:13:38', 13, 'new folder', 32),
(29, 0, '2012-10-19 09:13:38', 13, 'new folder', 33),
(30, 0, '2012-10-19 09:13:38', 13, 'duplicate folder', 34),
(31, 0, '2012-10-19 09:13:38', 13, 'new folder', 35),
(32, 0, '2012-10-19 09:40:45', 6, 'duplicate folder', 10),
(33, 0, '2012-12-04 10:38:56', 1, 'new folder', 36),
(34, 2, '2012-12-04 10:39:12', 1, 'new folder', 37),
(35, 0, '2012-12-04 10:40:02', 1, 'new folder', 38),
(36, 0, '2013-01-25 08:04:55', 1, 'duplicate folder (duplicate)', 39),
(37, 36, '2013-01-25 08:04:55', 1, 'new folder (duplicate)', 40);

-- --------------------------------------------------------

--
-- Структура таблицы `customers`
--

CREATE TABLE IF NOT EXISTS `customers` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_name` varchar(255) DEFAULT NULL,
  `organisation_number` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `accounting_system_id` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zip` varchar(50) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country_id` int(11) NOT NULL DEFAULT '0',
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `valid_from` datetime DEFAULT NULL,
  `valid_to` datetime DEFAULT NULL,
  `max_user_agreed` smallint(6) NOT NULL DEFAULT '0',
  `users_now` smallint(6) NOT NULL DEFAULT '0',
  `max_mb_agreed` smallint(6) NOT NULL DEFAULT '0',
  `mb_now` smallint(6) NOT NULL DEFAULT '0',
  `database` varchar(255) DEFAULT NULL,
  `frozen` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`customer_id`),
  KEY `course_room_id` (`customer_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `customers`
--

INSERT INTO `customers` (`customer_id`, `created_at`, `customer_name`, `organisation_number`, `tax_id`, `accounting_system_id`, `address`, `zip`, `city`, `country_id`, `contact_person`, `phone`, `email`, `valid_from`, `valid_to`, `max_user_agreed`, `users_now`, `max_mb_agreed`, `mb_now`, `database`, `frozen`) VALUES
(1, '2012-10-22 08:26:42', 'Customer 1', 'hhh-ID', '123-ID', '123456-ID', 'Some address', '12345', 'Barcelona', 0, 'Person 1', '12346578', 'test@ff.ff', '2012-10-08 00:00:00', '2012-10-02 00:00:00', 10, 5, 256, 12, '', 0),
(2, '2012-10-22 08:26:42', 'Customer 2', 'aaaa-ID', '567-ID', '9875657-ID', 'Other adress', '45676', 'Minsk', 0, 'Demo Person 2', '13215456', 'test@gg.hh', '2012-10-08 00:00:00', '2012-10-02 00:00:00', 15, 4, 132, 123, '', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `educational_entities`
--

CREATE TABLE IF NOT EXISTS `educational_entities` (
  `entity_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `entity_name` varchar(255) NOT NULL,
  `customer_id` int(11) NOT NULL DEFAULT '0',
  `address` varchar(255) DEFAULT NULL,
  `zip` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country_id` int(11) NOT NULL DEFAULT '0',
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `users_now` smallint(6) NOT NULL DEFAULT '0',
  `mb_now` smallint(6) NOT NULL DEFAULT '0',
  PRIMARY KEY (`entity_id`),
  KEY `course_room_id` (`entity_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `educational_entities`
--

INSERT INTO `educational_entities` (`entity_id`, `created_at`, `entity_name`, `customer_id`, `address`, `zip`, `city`, `country_id`, `contact_person`, `phone`, `email`, `users_now`, `mb_now`) VALUES
(1, '2012-10-22 13:57:38', 'Test 1', 2, 'Address Demo', '12345', 'Paris', 0, 'Demo', '123456789', 'test@aa.aa', 0, 0),
(2, '2012-10-22 14:20:22', 'Test 2', 1, 'Address Demo 2', '12542', 'Rome', 0, 'Person', '123456781', 'Test@dd.dd', 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `files`
--

CREATE TABLE IF NOT EXISTS `files` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `file_pass` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `item_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` int(11) NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=51 ;

--
-- Дамп данных таблицы `files`
--

INSERT INTO `files` (`file_id`, `file_name`, `file_pass`, `item_type`, `item_id`, `user_id`, `comment`) VALUES
(2, 'test.txt', 'user_files/admin/test_1363614909.txt', 'assignment', 337, 2, 181),
(3, 'test.txt', 'user_files/admin/test_1363614910.txt', 'assignment', 337, 2, 181),
(4, 'test.txt', 'user_files/admin/test_1363614910.txt', 'assignment', 337, 2, 181),
(5, 'test.txt', 'user_files/admin/test_1363614932.txt', 'assignment', 337, 2, 182),
(6, 'test - Kopia.txt', 'user_files/admin/test - Kopia_1363614933.txt', 'assignment', 337, 2, 182),
(10, 'test - Kopia.txt', 'user_files/admin/test - Kopia_1363616289.txt', 'assignment', 337, 2, 184),
(29, 'Hydrangeas.jpg', 'user_files/admin/Hydrangeas_1363771512.jpg', 'assignment', 337, 2, 224),
(46, 'Chrysanthemum.jpg', 'user_files/admin/Chrysanthemum_1363787601.jpg', 'assignment', 336, 2, 236),
(47, 'Desert.jpg', 'user_files/admin/Desert_1363787601.jpg', 'assignment', 336, 2, 236),
(48, 'Hydrangeas.jpg', 'user_files/admin/Hydrangeas_1363787601.jpg', 'assignment', 336, 2, 236),
(49, 'Tulips.jpg', 'user_files/admin/Tulips_1363787601.jpg', 'assignment', 336, 2, 236),
(50, 'Tulips.jpg', 'user_files/admin/Tulips_1363798819.jpg', 'assignment', 7, 2, 238);

-- --------------------------------------------------------

--
-- Структура таблицы `files_comments`
--

CREATE TABLE IF NOT EXISTS `files_comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_text` text NOT NULL,
  `date` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type_item` varchar(255) NOT NULL,
  `item_id` int(11) NOT NULL DEFAULT '0',
  `pupil_id` int(11) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=240 ;

--
-- Дамп данных таблицы `files_comments`
--

INSERT INTO `files_comments` (`comment_id`, `comment_text`, `date`, `user`, `user_id`, `type_item`, `item_id`, `pupil_id`) VALUES
(166, '123123123', 'Mon Mar 11 2013 12:52:04', 'admin', 2, 'assignment', 330, 1),
(167, '234', 'Mon Mar 11 2013 13:03:17', 'admin', 2, 'assignment', 330, 2),
(168, 'ascawd', 'Mon Mar 11 2013 17:35:20', 'admin', 2, 'pupil_note', 0, 2),
(169, '32', 'Mon Mar 11 2013 17:35:52', 'admin', 2, 'private_note', 0, 2),
(170, '234', 'Tue Mar 12 2013 13:22:25', 'admin', 2, 'assignment', 331, 1),
(171, '123', 'Tue Mar 12 2013 13:35:28', 'admin', 2, 'performance', 1, 1),
(172, '33', 'Tue Mar 12 2013 13:35:33', 'admin', 2, 'performance', 2, 2),
(173, '234', 'Tue Mar 12 2013 13:50:47', 'admin', 2, 'assignment', 334, 2),
(175, 'old comment!', 'Wed Mar 13 2013 12:27:48', 'admin', 2, 'assignment', 337, 1),
(176, 'perf comment!', 'Wed Mar 13 2013 12:27:57', 'admin', 2, 'performance', 14, 1),
(177, 'pelle', 'Fri Mar 15 2013 08:01:28', 'Guest', 2, 'performance', 2, 2),
(178, 'tsting hhhhhhhhhhhhhh', 'Fri Mar 15 2013 16:28:41', 'admin', 2, 'assignment', 340, 1),
(179, 'testing', 'Sat Mar 16 2013 08:22:41', 'Guest', 2, 'private_note', 0, 1),
(181, 'testing', 'Mon Mar 18 2013 14:51:28', 'admin', 2, 'assignment', 337, 1),
(182, 'testingg', 'Mon Mar 18 2013 14:51:28', 'admin', 2, 'assignment', 337, 1),
(184, 'test', 'Mon Mar 18 2013 14:55:27', 'admin', 2, 'assignment', 337, 2),
(185, '123', 'Tue Mar 19 2013 16:04:08', 'admin', 2, 'assignment', 1, 1),
(186, '21e', 'Tue Mar 19 2013 16:04:12', 'admin', 2, 'assignment', 2, 2),
(190, '45', 'Tue Mar 19 2013 16:04:57', 'admin', 2, 'assignment', 336, 2),
(224, '', 'Wed Mar 20 2013 11:20:08', 'admin', 2, 'assignment', 337, 1),
(236, '', 'Wed Mar 20 2013 15:52:38', 'admin', 2, 'assignment', 336, 1),
(238, 'Color', 'Wed Mar 20 2013 19:00:02', 'admin', 2, 'assignment', 7, 34);

-- --------------------------------------------------------

--
-- Структура таблицы `grade_definition`
--

CREATE TABLE IF NOT EXISTS `grade_definition` (
  `grade_definition_id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `level` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `type` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`grade_definition_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `grade_definition`
--

INSERT INTO `grade_definition` (`grade_definition_id`, `title_en`, `level`, `type`, `sort_order`, `created_at`) VALUES
(1, 'A', '1', 'passed', 0, '2013-01-08 09:09:39'),
(2, 'B', '2', 'not pass', 1, '2013-01-08 09:09:39'),
(3, 'C', '3', 'not pass', 2, '2013-01-08 09:09:39'),
(4, 'D', '4', 'not pass', 3, '2013-01-08 09:09:39'),
(5, 'E', '5', 'not pass', 4, '2013-01-08 09:09:39'),
(6, 'F', '6', 'not pass', 5, '2013-01-08 09:09:39'),
(7, 'Fx', '7', 'not pass', 6, '2013-01-08 09:09:39');

-- --------------------------------------------------------

--
-- Структура таблицы `group_pupil`
--

CREATE TABLE IF NOT EXISTS `group_pupil` (
  `group_pupil_id` int(11) NOT NULL AUTO_INCREMENT,
  `pupil_id` int(11) NOT NULL,
  `objectivegroup_id` int(11) NOT NULL,
  PRIMARY KEY (`group_pupil_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `guardians`
--

CREATE TABLE IF NOT EXISTS `guardians` (
  `guardian_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `freeze_access` tinyint(4) NOT NULL DEFAULT '0',
  `first_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `is_guardian` tinyint(4) NOT NULL DEFAULT '0',
  `address` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `zip_code` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `city` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `pupil_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`guardian_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=436 ;

--
-- Дамп данных таблицы `guardians`
--

INSERT INTO `guardians` (`guardian_id`, `user_name`, `freeze_access`, `first_name`, `last_name`, `is_guardian`, `address`, `zip_code`, `city`, `phone`, `email`, `pupil_id`) VALUES
(429, '234234', 1, 'qwe', 'qwe', 0, '234addressSeparator34', '123', '123', '213', '123', 55),
(435, '123123', 1, 'wer', 'wer', 0, 'weraddressSeparatorwer', 'wer', 'wer', 'wer', '234234', 55);

-- --------------------------------------------------------

--
-- Структура таблицы `hideassignment`
--

CREATE TABLE IF NOT EXISTS `hideassignment` (
  `hideassignment_id` int(11) NOT NULL AUTO_INCREMENT,
  `assignment_id` int(11) NOT NULL,
  `hide_from` varchar(255) NOT NULL,
  `hide_from_id` int(11) NOT NULL,
  PRIMARY KEY (`hideassignment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `hidecolumn`
--

CREATE TABLE IF NOT EXISTS `hidecolumn` (
  `hidecolumn_id` int(11) NOT NULL AUTO_INCREMENT,
  `hide_group` int(11) NOT NULL,
  `hide_objective` int(11) NOT NULL,
  `hide_assign` int(11) NOT NULL,
  `hide_unit` int(11) NOT NULL,
  `hide_max` int(11) NOT NULL,
  `hide_pass` int(11) NOT NULL,
  `hide_result` int(11) NOT NULL,
  `hide_quality` int(11) NOT NULL,
  `hide_assesment` int(11) NOT NULL,
  `pupil_id` int(11) NOT NULL,
  PRIMARY KEY (`hidecolumn_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `hidegroup`
--

CREATE TABLE IF NOT EXISTS `hidegroup` (
  `hidegroup_id` int(11) NOT NULL AUTO_INCREMENT,
  `objectivegroup_id` int(11) NOT NULL,
  `pupil_id` int(11) NOT NULL,
  `studygroup_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  PRIMARY KEY (`hidegroup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `hideobjective`
--

CREATE TABLE IF NOT EXISTS `hideobjective` (
  `hideobjective_id` int(11) NOT NULL AUTO_INCREMENT,
  `objective_id` int(11) NOT NULL,
  `pupil_id` int(11) NOT NULL,
  `studygroup_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  PRIMARY KEY (`hideobjective_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `hideperformance`
--

CREATE TABLE IF NOT EXISTS `hideperformance` (
  `hideperformance_id` int(11) NOT NULL AUTO_INCREMENT,
  `performance_id` int(11) NOT NULL,
  `hide_from` varchar(255) NOT NULL,
  `hide_from_id` int(11) NOT NULL,
  PRIMARY KEY (`hideperformance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `hidepupil`
--

CREATE TABLE IF NOT EXISTS `hidepupil` (
  `hidepupil_id` int(11) NOT NULL AUTO_INCREMENT,
  `pupil_id` int(11) NOT NULL,
  `studygroup_id` int(11) NOT NULL,
  `hidden` int(11) NOT NULL,
  PRIMARY KEY (`hidepupil_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `labels`
--

CREATE TABLE IF NOT EXISTS `labels` (
  `label_id` int(10) NOT NULL AUTO_INCREMENT,
  `label_name` varchar(255) DEFAULT NULL,
  `label_en` varchar(255) DEFAULT NULL,
  `label_de` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`label_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=FIXED AUTO_INCREMENT=62 ;

--
-- Дамп данных таблицы `labels`
--

INSERT INTO `labels` (`label_id`, `label_name`, `label_en`, `label_de`) VALUES
(1, 'course_room.title', 'Course room english', 'Kurs Raum Englisch'),
(2, 'course_room.elements.label', 'Course room elements label english', 'Kurs Zimmer Elemente beschriften Englisch'),
(3, 'course_room.elements.value', 'Course room elements value english', 'Kurs Zimmer Elemente Wert Englisch'),
(51, 'label1', 'labelf', ' Labelf'),
(52, 'label12', 'label', ' Etikett'),
(53, 'label', 'label', ' Etikett'),
(54, 'as', 'room', 'Zimmer'),
(55, 'as1', 'moon', ' Mond'),
(56, 'my course room', 'empty', ' leer'),
(57, 'as11', 'head12323d', ' head12323d'),
(58, 'my_label', 'Good morning. Nice to meet you in our friendly and full of fun office', 'Guten Morgen. Nice to meet you in unseren freundlich und voller Spaß Büro'),
(59, 'my_label2', 'Nice to see you here. Office, garbage, exam, opened', 'Schön, Sie hier zu sehen. Büro, Müll, Prüfung, geöffnet'),
(60, 'nweas', 'hello', ' Hallo'),
(61, 'label1351084358969', 'fine', ' fein');

-- --------------------------------------------------------

--
-- Структура таблицы `objective_pupil`
--

CREATE TABLE IF NOT EXISTS `objective_pupil` (
  `objective_pupil_id` int(11) NOT NULL AUTO_INCREMENT,
  `pupil_id` int(11) NOT NULL,
  `objective_id` int(11) NOT NULL,
  PRIMARY KEY (`objective_pupil_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `objective_pupil`
--

INSERT INTO `objective_pupil` (`objective_pupil_id`, `pupil_id`, `objective_id`) VALUES
(1, 1, 8),
(2, 1, 13),
(3, 1, 48),
(4, 1, 49);

-- --------------------------------------------------------

--
-- Структура таблицы `objective_weight`
--

CREATE TABLE IF NOT EXISTS `objective_weight` (
  `objective_weight_id` int(11) NOT NULL AUTO_INCREMENT,
  `objective_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  PRIMARY KEY (`objective_weight_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Дамп данных таблицы `objective_weight`
--

INSERT INTO `objective_weight` (`objective_weight_id`, `objective_id`, `amount`) VALUES
(1, 4, 40),
(2, 8, 40),
(3, 13, 60),
(4, 14, 60),
(5, 15, 60),
(6, 16, 60),
(7, 20, 60),
(8, 31, 60);

-- --------------------------------------------------------

--
-- Структура таблицы `performance`
--

CREATE TABLE IF NOT EXISTS `performance` (
  `performance_id` int(11) NOT NULL AUTO_INCREMENT,
  `studygroup_id` int(11) NOT NULL,
  `resultset_id` int(11) DEFAULT NULL,
  `public` tinyint(4) NOT NULL DEFAULT '0',
  `title_en` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `owner` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `content_en` text CHARACTER SET utf8 COLLATE utf8_bin,
  `owner_notes` text CHARACTER SET utf8 COLLATE utf8_bin,
  `sort_order` int(11) NOT NULL,
  `shared` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`performance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `programmes`
--

CREATE TABLE IF NOT EXISTS `programmes` (
  `programme_id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`programme_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `programmes`
--

INSERT INTO `programmes` (`programme_id`, `title_en`, `created_at`, `sort_order`) VALUES
(1, 'Economic Programme', '2012-11-30 09:25:08', 0),
(2, 'Technical Programme', '2012-11-20 20:00:00', 1),
(3, 'Esthetical Programme', '2013-03-18 12:57:34', 2),
(4, 'Society Programme', '2013-03-18 12:57:43', 3),
(5, 'Media Programme', '2013-03-18 12:58:57', 4),
(6, 'Dance Programme', '2013-03-18 12:59:16', 5);

-- --------------------------------------------------------

--
-- Структура таблицы `pupil`
--

CREATE TABLE IF NOT EXISTS `pupil` (
  `pupil_id` int(11) NOT NULL AUTO_INCREMENT,
  `forename` varchar(255) COLLATE utf8_bin NOT NULL,
  `lastname` varchar(255) COLLATE utf8_bin NOT NULL,
  `pupil_image` varchar(255) COLLATE utf8_bin NOT NULL,
  `personal_id` varchar(255) COLLATE utf8_bin NOT NULL,
  `pupilgroup_id` int(11) NOT NULL,
  `notes` text COLLATE utf8_bin NOT NULL,
  `owner_notes` text COLLATE utf8_bin NOT NULL,
  `studygroup_id` int(11) NOT NULL,
  PRIMARY KEY (`pupil_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=403 ;

--
-- Дамп данных таблицы `pupil`
--

INSERT INTO `pupil` (`pupil_id`, `forename`, `lastname`, `pupil_image`, `personal_id`, `pupilgroup_id`, `notes`, `owner_notes`, `studygroup_id`) VALUES
(1, 'Joert', 'Lopes', '../image/lop.png', '940202-30', 1, '<p>123</p>', '<p>r3223r32r32r3rwf</p>\n<p>wef</p>\n<p>wef</p>\n<p>wef</p>\n<p>wfewefwfwefwfwefwefwefwe</p>', 1),
(2, 'Orial', 'Tsarial', '../image/lop.png', '940202-50', 1, '<p>123</p>', '<p>r3223r32r32r3rwf</p>\r\n<p>wef</p>\r\n<p>wef</p>\r\n<p>wef</p>\r\n<p>wfewefwfwefwfwefwefwefwef</p>\r\n<p>wef</p>\r\n<p>wef</p>\r\n<p>wef</p>\r\n<p>wef</p>\r\n<p>wef</p>\r\n<p>w</p>\r\n<p>ef</p>\r\n<p>wef</p>\r\n<p>wfe</p>\r\n<p>wfe</p>\r\n<p>wef</p>\r\n<p>wef</p>\r\n<p>wfe</p>\r\n<p>&nbsp;</p>\r\n<p>wef</p>\r\n<p>wef</p>\r\n<p>wef</p>', 1),
(3, 'Germaine', 'Hardy', '', '', 1, '', '', 0),
(4, 'Giacomo', 'Huff', '', '', 1, '', '', 0),
(5, 'Stuart', 'Barton', '', '', 1, '', '', 0),
(6, 'Plato', 'Malone', '', '', 1, '', '', 0),
(7, 'Unity', 'Wise', '', '', 1, '', '', 0),
(8, 'Elvis', 'Brown', '', '', 1, '', '', 0),
(9, 'Victoria', 'Cardenas', '', '', 1, '', '', 0),
(10, 'Ferris', 'Hicks', '', '', 1, '', '', 0),
(11, 'Leroy', 'Thornton', '', '', 1, '', '', 0),
(12, 'Latifah', 'Bean', '', '', 1, '', '', 0),
(13, 'Erich', 'Hebert', '', '', 1, '', '', 0),
(14, 'Ishmael', 'Reid', '', '', 1, '', '', 0),
(15, 'Evelyn', 'Moody', '', '', 1, '', '', 0),
(16, 'Cynthia', 'Harris', '', '', 1, '', '', 0),
(17, 'Jocelyn', 'French', '', '', 1, '', '', 0),
(18, 'Vladimir', 'Mcmillan', '', '', 1, '', '', 0),
(19, 'Kibo', 'Lowe', '', '', 1, '', '', 0),
(20, 'Reuben', 'Spencer', '', '', 1, '', '', 0),
(21, 'Destiny', 'Hughes', '', '', 1, '', '', 0),
(22, 'Matthew', 'Ballard', '', '', 1, '', '', 0),
(23, 'John', 'Gilbert', '', '', 1, '', '', 0),
(24, 'Noel', 'Rocha', '', '', 1, '', '', 0),
(25, 'Haviva', 'Bradshaw', '', '', 1, '', '', 0),
(26, 'Blythe', 'Gallagher', '', '', 1, '', '', 0),
(27, 'Heather', 'Salas', '', '', 1, '', '', 0),
(28, 'Mason', 'Randolph', '', '', 1, '', '', 0),
(29, 'Aladdin', 'Flynn', '', '', 1, '', '', 0),
(30, 'Keely', 'Brady', '', '', 1, '', '', 0),
(31, 'Jameson', 'Graves', '', '', 1, '', '', 0),
(32, 'Ella', 'Alston', '', '', 1, '', '', 0),
(33, 'Celeste', 'King', '', '', 1, '', '', 0),
(34, 'Jared', 'Crosby', '', '', 1, '', '', 0),
(35, 'Kareem', 'Mckay', '', '', 1, '', '', 0),
(36, 'Christen', 'Patton', '', '', 1, '', '', 0),
(37, 'Donovan', 'Briggs', '', '', 1, '', '', 0),
(38, 'Meghan', 'Raymond', '', '', 1, '', '', 0),
(39, 'Medge', 'Rivera', '', '', 1, '', '', 0),
(40, 'Claire', 'Francis', '', '', 1, '', '', 0),
(41, 'Lucy', 'Richards', '', '', 1, '', '', 0),
(42, 'Jenna', 'Becker', '', '', 1, '', '', 0),
(43, 'Hakeem', 'Delaney', '', '', 1, '', '', 0),
(44, 'Lucian', 'Page', '', '', 1, '', '', 0),
(45, 'Maia', 'Cross', '', '', 1, '', '', 0),
(46, 'Pandora', 'Hendrix', '', '', 1, '', '', 0),
(47, 'Chadwick', 'Oconnor', '', '', 1, '', '', 0),
(48, 'Idona', 'Gilliam', '', '', 1, '', '', 0),
(49, 'Howard', 'Abbott', '', '', 1, '', '', 0),
(50, 'Nicholas', 'Copeland', '', '', 1, '', '', 0),
(51, 'Barry', 'Sandoval', '', '', 1, '', '', 0),
(52, 'Sawyer', 'Fischer', '', '', 1, '', '', 0),
(53, 'Lesley', 'Navarro', '', '', 1, '', '', 0),
(54, 'Sharon', 'English', '', '', 1, '', '', 0),
(55, 'Ferris', 'Thomas', '', '', 1, '', '', 0),
(56, 'Hayden', 'Morales', '', '', 1, '', '', 0),
(57, 'Caryn', 'Santiago', '', '', 1, '', '', 0),
(58, 'Amity', 'Delgado', '', '', 1, '', '', 0),
(59, 'Murphy', 'Morse', '', '', 1, '', '', 0),
(60, 'Bell', 'Good', '', '', 1, '', '', 0),
(61, 'Rogan', 'Hopkins', '', '', 1, '', '', 0),
(62, 'Elton', 'Everett', '', '', 1, '', '', 0),
(63, 'Sasha', 'Stanley', '', '', 1, '', '', 0),
(64, 'Louis', 'Perez', '', '', 1, '', '', 0),
(65, 'Austin', 'Barker', '', '', 1, '', '', 0),
(66, 'Quentin', 'Hinton', '', '', 1, '', '', 0),
(67, 'Silas', 'Mcfadden', '', '', 1, '', '', 0),
(68, 'Mallory', 'Moreno', '', '', 1, '', '', 0),
(69, 'Petra', 'Gardner', '', '', 1, '', '', 0),
(70, 'Stacey', 'Hill', '', '', 1, '', '', 0),
(71, 'Chava', 'Deleon', '', '', 1, '', '', 0),
(72, 'Fletcher', 'Leblanc', '', '', 1, '', '', 0),
(73, 'Patrick', 'Greene', '', '', 1, '', '', 0),
(74, 'Samantha', 'Wilcox', '', '', 1, '', '', 0),
(75, 'Chanda', 'Bates', '', '', 1, '', '', 0),
(76, 'Imelda', 'Sanford', '', '', 1, '', '', 0),
(77, 'Felicia', 'Nolan', '', '', 1, '', '', 0),
(78, 'Alan', 'Franklin', '', '', 1, '', '', 0),
(79, 'Wyatt', 'Bender', '', '', 1, '', '', 0),
(80, 'Kieran', 'Vincent', '', '', 1, '', '', 0),
(81, 'Joelle', 'Burke', '', '', 1, '', '', 0),
(82, 'Sophia', 'Hopper', '', '', 1, '', '', 0),
(83, 'Kato', 'Coleman', '', '', 1, '', '', 0),
(84, 'Amery', 'Andrews', '', '', 1, '', '', 0),
(85, 'Elaine', 'Contreras', '', '', 1, '', '', 0),
(86, 'Kyra', 'Middleton', '', '', 1, '', '', 0),
(87, 'Diana', 'Ward', '', '', 1, '', '', 0),
(88, 'Kyla', 'Whitehead', '', '', 1, '', '', 0),
(89, 'Jorden', 'Vega', '', '', 1, '', '', 0),
(90, 'Plato', 'Jefferson', '', '', 1, '', '', 0),
(91, 'Isabella', 'Wheeler', '', '', 1, '', '', 0),
(92, 'Graiden', 'Sears', '', '', 1, '', '', 0),
(93, 'Roary', 'Good', '', '', 1, '', '', 0),
(94, 'Macaulay', 'Hawkins', '', '', 1, '', '', 0),
(95, 'Hedwig', 'Olson', '', '', 1, '', '', 0),
(96, 'Cora', 'Douglas', '', '', 1, '', '', 0),
(97, 'Slade', 'Lancaster', '', '', 1, '', '', 0),
(98, 'Chaim', 'Blackwell', '', '', 1, '', '', 0),
(99, 'Rhona', 'Mathews', '', '', 1, '', '', 0),
(100, 'Jillian', 'Gardner', '', '', 1, '', '', 0),
(101, 'Bell', 'Richmond', '', '', 1, '', '', 0),
(102, 'Sage', 'Cain', '', '', 1, '', '', 0),
(103, 'Aaron', 'Walter', '', '', 1, '', '', 0),
(104, 'Graham', 'Malone', '', '', 1, '', '', 0),
(105, 'Paki', 'Weber', '', '', 1, '', '', 0),
(106, 'Faith', 'Clay', '', '', 1, '', '', 0),
(107, 'Kameko', 'Barnett', '', '', 1, '', '', 0),
(108, 'Mason', 'Curtis', '', '', 1, '', '', 0),
(109, 'Plato', 'Anthony', '', '', 1, '', '', 0),
(110, 'Raya', 'Kinney', '', '', 1, '', '', 0),
(111, 'Eliana', 'Mcintosh', '', '', 1, '', '', 0),
(112, 'Phelan', 'Hinton', '', '', 1, '', '', 0),
(113, 'Amber', 'Hinton', '', '', 1, '', '', 0),
(114, 'Mufutau', 'Rodriguez', '', '', 1, '', '', 0),
(115, 'Oliver', 'Lawson', '', '', 1, '', '', 0),
(116, 'Jacob', 'Shaw', '', '', 1, '', '', 0),
(117, 'Imelda', 'Gomez', '', '', 1, '', '', 0),
(118, 'Uma', 'Abbott', '', '', 1, '', '', 0),
(119, 'Joel', 'Reid', '', '', 1, '', '', 0),
(120, 'Madeline', 'Lowe', '', '', 1, '', '', 0),
(121, 'Ayanna', 'Sharp', '', '', 1, '', '', 0),
(122, 'Fatima', 'Mccoy', '', '', 1, '', '', 0),
(123, 'Miriam', 'Mills', '', '', 1, '', '', 0),
(124, 'Yoko', 'Frost', '', '', 1, '', '', 0),
(125, 'Sean', 'Barnett', '', '', 1, '', '', 0),
(126, 'Mason', 'Kelly', '', '', 1, '', '', 0),
(127, 'Maris', 'Vaughan', '', '', 1, '', '', 0),
(128, 'Micah', 'Sherman', '', '', 1, '', '', 0),
(129, 'Ulla', 'Garrett', '', '', 1, '', '', 0),
(130, 'Channing', 'Watts', '', '', 1, '', '', 0),
(131, 'Wang', 'Banks', '', '', 1, '', '', 0),
(132, 'Ezekiel', 'Gonzalez', '', '', 1, '', '', 0),
(133, 'Benjamin', 'Ayers', '', '', 1, '', '', 0),
(134, 'Evelyn', 'Aguirre', '', '', 1, '', '', 0),
(135, 'Eugenia', 'Silva', '', '', 1, '', '', 0),
(136, 'Salvador', 'Kerr', '', '', 1, '', '', 0),
(137, 'Charity', 'Campos', '', '', 1, '', '', 0),
(138, 'Tanek', 'Salinas', '', '', 1, '', '', 0),
(139, 'Lila', 'Pierce', '', '', 1, '', '', 0),
(140, 'Ariana', 'Turner', '', '', 1, '', '', 0),
(141, 'Athena', 'Snyder', '', '', 1, '', '', 0),
(142, 'Ulric', 'Chavez', '', '', 1, '', '', 0),
(143, 'George', 'Emerson', '', '', 1, '', '', 0),
(144, 'Holly', 'Mayo', '', '', 1, '', '', 0),
(145, 'Rana', 'Suarez', '', '', 1, '', '', 0),
(146, 'Chloe', 'Paul', '', '', 1, '', '', 0),
(147, 'Bert', 'Terry', '', '', 1, '', '', 0),
(148, 'Vance', 'Rogers', '', '', 1, '', '', 0),
(149, 'Libby', 'Harding', '', '', 1, '', '', 0),
(150, 'Lester', 'Howe', '', '', 1, '', '', 0),
(151, 'Kenneth', 'Lawrence', '', '', 1, '', '', 0),
(152, 'Katelyn', 'Hopkins', '', '', 1, '', '', 0),
(153, 'Shelley', 'Roman', '', '', 1, '', '', 0),
(154, 'Colette', 'Cooke', '', '', 1, '', '', 0),
(155, 'Laurel', 'Witt', '', '', 1, '', '', 0),
(156, 'Rebecca', 'Clay', '', '', 1, '', '', 0),
(157, 'Josephine', 'Farmer', '', '', 1, '', '', 0),
(158, 'Garrison', 'Cox', '', '', 1, '', '', 0),
(159, 'Zeus', 'Russell', '', '', 1, '', '', 0),
(160, 'Hammett', 'Harvey', '', '', 1, '', '', 0),
(161, 'Mia', 'Waller', '', '', 1, '', '', 0),
(162, 'Rudyard', 'Humphrey', '', '', 1, '', '', 0),
(163, 'Buffy', 'Frederick', '', '', 1, '', '', 0),
(164, 'Odette', 'Le', '', '', 1, '', '', 0),
(165, 'Sylvia', 'Brock', '', '', 1, '', '', 0),
(166, 'Vaughan', 'Tate', '', '', 1, '', '', 0),
(167, 'Myles', 'Harrell', '', '', 1, '', '', 0),
(168, 'Gareth', 'Poole', '', '', 1, '', '', 0),
(169, 'Ramona', 'Pierce', '', '', 1, '', '', 0),
(170, 'Lucian', 'Brown', '', '', 1, '', '', 0),
(171, 'Tad', 'Roach', '', '', 1, '', '', 0),
(172, 'Myles', 'Mcgowan', '', '', 1, '', '', 0),
(173, 'Vance', 'Porter', '', '', 1, '', '', 0),
(174, 'Wyatt', 'Huffman', '', '', 1, '', '', 0),
(175, 'Chester', 'Gillespie', '', '', 1, '', '', 0),
(176, 'Hiram', 'Erickson', '', '', 1, '', '', 0),
(177, 'Remedios', 'Welch', '', '', 1, '', '', 0),
(178, 'Jaquelyn', 'Flynn', '', '', 1, '', '', 0),
(179, 'Gannon', 'Blankenship', '', '', 1, '', '', 0),
(180, 'Ainsley', 'Oneil', '', '', 1, '', '', 0),
(181, 'Beatrice', 'Maxwell', '', '', 1, '', '', 0),
(182, 'Bianca', 'Duran', '', '', 1, '', '', 0),
(183, 'Lareina', 'Coleman', '', '', 1, '', '', 0),
(184, 'Gisela', 'Carrillo', '', '', 1, '', '', 0),
(185, 'Melinda', 'Gilliam', '', '', 1, '', '', 0),
(186, 'Athena', 'Ramos', '', '', 1, '', '', 0),
(187, 'Hammett', 'Lott', '', '', 1, '', '', 0),
(188, 'Astra', 'Albert', '', '', 1, '', '', 0),
(189, 'Judah', 'Golden', '', '', 1, '', '', 0),
(190, 'Matthew', 'Griffith', '', '', 1, '', '', 0),
(191, 'Trevor', 'Hunt', '', '', 1, '', '', 0),
(192, 'Warren', 'Marshall', '', '', 1, '', '', 0),
(193, 'Leah', 'Cannon', '', '', 1, '', '', 0),
(194, 'Walter', 'Kent', '', '', 1, '', '', 0),
(195, 'Quincy', 'Castro', '', '', 1, '', '', 0),
(196, 'Vance', 'Delacruz', '', '', 1, '', '', 0),
(197, 'Grady', 'Mcpherson', '', '', 1, '', '', 0),
(198, 'Peter', 'Oliver', '', '', 1, '', '', 0),
(199, 'Iola', 'Cochran', '', '', 1, '', '', 0),
(200, 'Claire', 'Shaw', '', '', 1, '', '', 0),
(201, 'Maxwell', 'Randall', '', '', 1, '', '', 0),
(202, 'Mollie', 'Page', '', '', 1, '', '', 0),
(203, 'Yoshio', 'Huff', '', '', 1, '', '', 0),
(204, 'Ira', 'Roberson', '', '', 1, '', '', 0),
(205, 'Vanna', 'Merrill', '', '', 1, '', '', 0),
(206, 'Scott', 'Flowers', '', '', 1, '', '', 0),
(207, 'Candice', 'Mitchell', '', '', 1, '', '', 0),
(208, 'Quynn', 'Ayers', '', '', 1, '', '', 0),
(209, 'Tatyana', 'Lamb', '', '', 1, '', '', 0),
(210, 'Isabella', 'Melton', '', '', 1, '', '', 0),
(211, 'Sarah', 'Hensley', '', '', 1, '', '', 0),
(212, 'Pamela', 'Herring', '', '', 1, '', '', 0),
(213, 'Ian', 'Hatfield', '', '', 1, '', '', 0),
(214, 'Emma', 'Sharp', '', '', 1, '', '', 0),
(215, 'Moana', 'Rich', '', '', 1, '', '', 0),
(216, 'Robert', 'Mckenzie', '', '', 1, '', '', 0),
(217, 'Belle', 'Reilly', '', '', 1, '', '', 0),
(218, 'Jillian', 'Levine', '', '', 1, '', '', 0),
(219, 'Shoshana', 'Holland', '', '', 1, '', '', 0),
(220, 'Sopoline', 'Stevenson', '', '', 1, '', '', 0),
(221, 'Leah', 'Patrick', '', '', 1, '', '', 0),
(222, 'Chiquita', 'Howe', '', '', 1, '', '', 0),
(223, 'Fay', 'Stanley', '', '', 1, '', '', 0),
(224, 'Tanisha', 'Chase', '', '', 1, '', '', 0),
(225, 'David', 'Simmons', '', '', 1, '', '', 0),
(226, 'Cora', 'Munoz', '', '', 1, '', '', 0),
(227, 'Jonas', 'Ratliff', '', '', 1, '', '', 0),
(228, 'Hector', 'Delgado', '', '', 1, '', '', 0),
(229, 'Fitzgerald', 'Boyle', '', '', 1, '', '', 0),
(230, 'Quail', 'West', '', '', 1, '', '', 0),
(231, 'Russell', 'Long', '', '', 1, '', '', 0),
(232, 'Eleanor', 'Powell', '', '', 1, '', '', 0),
(233, 'Cassidy', 'Bean', '', '', 1, '', '', 0),
(234, 'Jack', 'Warren', '', '', 1, '', '', 0),
(235, 'Lacota', 'Compton', '', '', 1, '', '', 0),
(236, 'Isaiah', 'Herring', '', '', 1, '', '', 0),
(237, 'Ursa', 'Trujillo', '', '', 1, '', '', 0),
(238, 'Carolyn', 'Ford', '', '', 1, '', '', 0),
(239, 'Vielka', 'Meyer', '', '', 1, '', '', 0),
(240, 'Cain', 'Hardin', '', '', 1, '', '', 0),
(241, 'Curran', 'Cox', '', '', 1, '', '', 0),
(242, 'Aileen', 'Kennedy', '', '', 1, '', '', 0),
(243, 'Delilah', 'Nguyen', '', '', 1, '', '', 0),
(244, 'Grant', 'Bullock', '', '', 1, '', '', 0),
(245, 'Marah', 'Odom', '', '', 1, '', '', 0),
(246, 'Plato', 'Butler', '', '', 1, '', '', 0),
(247, 'Keith', 'Beach', '', '', 1, '', '', 0),
(248, 'April', 'Curtis', '', '', 1, '', '', 0),
(249, 'Ryder', 'Cash', '', '', 1, '', '', 0),
(250, 'Miriam', 'Ford', '', '', 1, '', '', 0),
(251, 'Jonas', 'Leach', '', '', 1, '', '', 0),
(252, 'Shannon', 'Lopez', '', '', 1, '', '', 0),
(253, 'Vivian', 'Rowe', '', '', 1, '', '', 0),
(254, 'Barbara', 'Chan', '', '', 1, '', '', 0),
(255, 'Chanda', 'Rowe', '', '', 1, '', '', 0),
(256, 'Janna', 'Madden', '', '', 1, '', '', 0),
(257, 'Carol', 'Bowers', '', '', 1, '', '', 0),
(258, 'Quon', 'Carr', '', '', 1, '', '', 0),
(259, 'Mollie', 'Wiley', '', '', 1, '', '', 0),
(260, 'Coby', 'Morton', '', '', 1, '', '', 0),
(261, 'Britanney', 'Cannon', '', '', 1, '', '', 0),
(262, 'Dean', 'Woodward', '', '', 1, '', '', 0),
(263, 'Sopoline', 'Vincent', '', '', 1, '', '', 0),
(264, 'Cally', 'Andrews', '', '', 1, '', '', 0),
(265, 'Kim', 'Contreras', '', '', 1, '', '', 0),
(266, 'Maile', 'Navarro', '', '', 1, '', '', 0),
(267, 'Scarlett', 'Schroeder', '', '', 1, '', '', 0),
(268, 'Beck', 'Mcgowan', '', '', 1, '', '', 0),
(269, 'Lane', 'Everett', '', '', 1, '', '', 0),
(270, 'Clarke', 'Justice', '', '', 1, '', '', 0),
(271, 'Buckminster', 'Mejia', '', '', 1, '', '', 0),
(272, 'Lewis', 'Spence', '', '', 1, '', '', 0),
(273, 'Liberty', 'Poole', '', '', 1, '', '', 0),
(274, 'Helen', 'Stuart', '', '', 1, '', '', 0),
(275, 'Grace', 'Holden', '', '', 1, '', '', 0),
(276, 'Brendan', 'Benjamin', '', '', 1, '', '', 0),
(277, 'Inga', 'Terry', '', '', 1, '', '', 0),
(278, 'Sean', 'Wyatt', '', '', 1, '', '', 0),
(279, 'Hayes', 'Marshall', '', '', 1, '', '', 0),
(280, 'Todd', 'Richmond', '', '', 1, '', '', 0),
(281, 'Ava', 'Trevino', '', '', 1, '', '', 0),
(282, 'Hayley', 'Kirby', '', '', 1, '', '', 0),
(283, 'Naida', 'Bridges', '', '', 1, '', '', 0),
(284, 'Tyrone', 'Kidd', '', '', 1, '', '', 0),
(285, 'Carl', 'Snyder', '', '', 1, '', '', 0),
(286, 'Lillith', 'Williamson', '', '', 1, '', '', 0),
(287, 'Nevada', 'Henson', '', '', 1, '', '', 0),
(288, 'Magee', 'Downs', '', '', 1, '', '', 0),
(289, 'Cairo', 'Morales', '', '', 1, '', '', 0),
(290, 'Vivian', 'Lyons', '', '', 1, '', '', 0),
(291, 'Craig', 'Monroe', '', '', 1, '', '', 0),
(292, 'Brenden', 'Avery', '', '', 1, '', '', 0),
(293, 'Sybil', 'Pearson', '', '', 1, '', '', 0),
(294, 'Hadley', 'Mitchell', '', '', 1, '', '', 0),
(295, 'Paul', 'Roman', '', '', 1, '', '', 0),
(296, 'Kiona', 'Harrington', '', '', 1, '', '', 0),
(297, 'Ian', 'Bradford', '', '', 1, '', '', 0),
(298, 'Chanda', 'Perkins', '', '', 1, '', '', 0),
(299, 'Vernon', 'Spence', '', '', 1, '', '', 0),
(300, 'Debra', 'Rutledge', '', '', 1, '', '', 0),
(301, 'Garrett', 'Baird', '', '', 1, '', '', 0),
(302, 'Fulton', 'Carroll', '', '', 1, '', '', 0),
(303, 'Sandra', 'Bailey', '', '', 1, '', '', 0),
(304, 'Ima', 'Hayes', '', '', 1, '', '', 0),
(305, 'Katelyn', 'Carpenter', '', '', 1, '', '', 0),
(306, 'Jenette', 'Pacheco', '', '', 1, '', '', 0),
(307, 'Hilda', 'Bullock', '', '', 1, '', '', 0),
(308, 'Patience', 'Flowers', '', '', 1, '', '', 0),
(309, 'Gabriel', 'Dean', '', '', 1, '', '', 0),
(310, 'Lacey', 'Joyce', '', '', 1, '', '', 0),
(311, 'Geoffrey', 'Schneider', '', '', 1, '', '', 0),
(312, 'Priscilla', 'Castro', '', '', 1, '', '', 0),
(313, 'Ciaran', 'Woodward', '', '', 1, '', '', 0),
(314, 'Gil', 'Herring', '', '', 1, '', '', 0),
(315, 'Brynne', 'Walls', '', '', 1, '', '', 0),
(316, 'Noah', 'Henson', '', '', 1, '', '', 0),
(317, 'Mira', 'Sanford', '', '', 1, '', '', 0),
(318, 'Orlando', 'Malone', '', '', 1, '', '', 0),
(319, 'Kalia', 'Tate', '', '', 1, '', '', 0),
(320, 'Calvin', 'Humphrey', '', '', 1, '', '', 0),
(321, 'Liberty', 'Ryan', '', '', 1, '', '', 0),
(322, 'Athena', 'Massey', '', '', 1, '', '', 0),
(323, 'Nerea', 'Riddle', '', '', 1, '', '', 0),
(324, 'Gil', 'Burt', '', '', 1, '', '', 0),
(325, 'Holly', 'Duran', '', '', 1, '', '', 0),
(326, 'Lucian', 'Wilder', '', '', 1, '', '', 0),
(327, 'Kai', 'Morris', '', '', 1, '', '', 0),
(328, 'Kathleen', 'Hall', '', '', 1, '', '', 0),
(329, 'Sarah', 'Swanson', '', '', 1, '', '', 0),
(330, 'Hakeem', 'Barnett', '', '', 1, '', '', 0),
(331, 'Hedwig', 'Moon', '', '', 1, '', '', 0),
(332, 'Dara', 'Patton', '', '', 1, '', '', 0),
(333, 'David', 'Hensley', '', '', 1, '', '', 0),
(334, 'Daquan', 'Rice', '', '', 1, '', '', 0),
(335, 'Mary', 'Christensen', '', '', 1, '', '', 0),
(336, 'Zoe', 'Robertson', '', '', 1, '', '', 0),
(337, 'Piper', 'Fischer', '', '', 1, '', '', 0),
(338, 'Francesca', 'Sanchez', '', '', 1, '', '', 0),
(339, 'James', 'Morin', '', '', 1, '', '', 0),
(340, 'Jin', 'Andrews', '', '', 1, '', '', 0),
(341, 'Xanthus', 'Henson', '', '', 1, '', '', 0),
(342, 'Demetrius', 'Mullen', '', '', 1, '', '', 0),
(343, 'Branden', 'Tillman', '', '', 1, '', '', 0),
(344, 'Pascale', 'Cantu', '', '', 1, '', '', 0),
(345, 'Jorden', 'Rosa', '', '', 1, '', '', 0),
(346, 'Kadeem', 'Roman', '', '', 1, '', '', 0),
(347, 'Joel', 'Lowery', '', '', 1, '', '', 0),
(348, 'Bo', 'Stevenson', '', '', 1, '', '', 0),
(349, 'Brady', 'Gibbs', '', '', 1, '', '', 0),
(350, 'Abigail', 'Savage', '', '', 1, '', '', 0),
(351, 'Venus', 'Rogers', '', '', 1, '', '', 0),
(352, 'Judah', 'Barry', '', '', 1, '', '', 0),
(353, 'Rafael', 'Cervantes', '', '', 1, '', '', 0),
(354, 'Janna', 'Townsend', '', '', 1, '', '', 0),
(355, 'Tucker', 'Hatfield', '', '', 1, '', '', 0),
(356, 'Kendall', 'Townsend', '', '', 1, '', '', 0),
(357, 'Virginia', 'Harrell', '', '', 1, '', '', 0),
(358, 'Malcolm', 'Kinney', '', '', 1, '', '', 0),
(359, 'Buckminster', 'Melton', '', '', 1, '', '', 0),
(360, 'Echo', 'Mercer', '', '', 1, '', '', 0),
(361, 'Ivana', 'Macdonald', '', '', 1, '', '', 0),
(362, 'Alden', 'Baxter', '', '', 1, '', '', 0),
(363, 'Deanna', 'Sears', '', '', 1, '', '', 0),
(364, 'Hanae', 'Fitzpatrick', '', '', 1, '', '', 0),
(365, 'Martina', 'Cox', '', '', 1, '', '', 0),
(366, 'Noel', 'Puckett', '', '', 1, '', '', 0),
(367, 'Kylynn', 'Olsen', '', '', 1, '', '', 0),
(368, 'Wylie', 'Fuentes', '', '', 1, '', '', 0),
(369, 'Dana', 'Huff', '', '', 1, '', '', 0),
(370, 'Shafira', 'Pratt', '', '', 1, '', '', 0),
(371, 'Drew', 'Cole', '', '', 1, '', '', 0),
(372, 'Jorden', 'Craig', '', '', 1, '', '', 0),
(373, 'Porter', 'Hunt', '', '', 1, '', '', 0),
(374, 'Chandler', 'Shepard', '', '', 1, '', '', 0),
(375, 'Kaden', 'Kaufman', '', '', 1, '', '', 0),
(376, 'Dai', 'Cooke', '', '', 1, '', '', 0),
(377, 'Sigourney', 'Rhodes', '', '', 1, '', '', 0),
(378, 'Stuart', 'Phelps', '', '', 1, '', '', 0),
(379, 'Hedy', 'Wheeler', '', '', 1, '', '', 0),
(380, 'Keiko', 'Salas', '', '', 1, '', '', 0),
(381, 'Eden', 'Booker', '', '', 1, '', '', 0),
(382, 'Lesley', 'Mcbride', '', '', 1, '', '', 0),
(383, 'Wayne', 'Gibson', '', '', 1, '', '', 0),
(384, 'Brynne', 'Lane', '', '', 1, '', '', 0),
(385, 'Lynn', 'Avery', '', '', 1, '', '', 0),
(386, 'Emily', 'Duke', '', '', 1, '', '', 0),
(387, 'Olympia', 'Buckley', '', '', 1, '', '', 0),
(388, 'September', 'Workman', '', '', 1, '', '', 0),
(389, 'Donovan', 'Harding', '', '', 1, '', '', 0),
(390, 'Camille', 'Vang', '', '', 1, '', '', 0),
(391, 'Rama', 'Cortez', '', '', 1, '', '', 0),
(392, 'Leo', 'Rose', '', '', 1, '', '', 0),
(393, 'Lucas', 'Quinn', '', '', 1, '', '', 0),
(394, 'Azalia', 'Stuart', '', '', 1, '', '', 0),
(395, 'Hilary', 'Kerr', '', '', 1, '', '', 0),
(396, 'Cleo', 'Ross', '', '', 1, '', '', 0),
(397, 'Colby', 'Lawrence', '', '', 1, '', '', 0),
(398, 'Yoko', 'Griffin', '', '', 1, '', '', 0),
(399, 'Jeanette', 'Moon', '', '', 1, '', '', 0),
(400, 'Uriah', 'Rosales', '', '', 1, '', '', 0),
(401, 'Chantale', 'May', '', '', 1, '', '', 0),
(402, 'Keane', 'Chandler', '', '', 1, '', '', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `pupilgroups`
--

CREATE TABLE IF NOT EXISTS `pupilgroups` (
  `pupilgroup_id` int(1) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) COLLATE utf8_bin NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `studygroup_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pupilgroup_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `pupilgroups`
--

INSERT INTO `pupilgroups` (`pupilgroup_id`, `title_en`, `created_at`, `sort_order`, `studygroup_id`) VALUES
(1, 'Pupil group 1', '2012-12-10 06:56:16', 1, 1),
(2, 'Pupil group 1', '2012-12-10 06:56:16', 2, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `pupils`
--

CREATE TABLE IF NOT EXISTS `pupils` (
  `pupil_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `user_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `id_number` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `programme` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `sex` tinyint(4) NOT NULL DEFAULT '0',
  `protected_identity` tinyint(4) NOT NULL DEFAULT '0',
  `start_year` int(5) NOT NULL DEFAULT '0',
  `study_year` int(5) NOT NULL DEFAULT '0',
  `omynding` tinyint(4) NOT NULL DEFAULT '0',
  `acc_valid_form` date DEFAULT NULL,
  `acc_valid_until` date DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `zip_code` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `city` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `studygroup_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`pupil_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=56 ;

--
-- Дамп данных таблицы `pupils`
--

INSERT INTO `pupils` (`pupil_id`, `first_name`, `last_name`, `user_name`, `id_number`, `programme`, `sex`, `protected_identity`, `start_year`, `study_year`, `omynding`, `acc_valid_form`, `acc_valid_until`, `address`, `zip_code`, `city`, `email`, `phone`, `studygroup_id`) VALUES
(55, '5555', '111', 'erttehetheh', '1111', '4234234234', 0, 1, 1990, 10, 1, '2012-09-06', '2012-09-13', '22222222,3333333333356u345345addressSeparator234234234234', '34t34t', '12121', 'wiil@mail.com,123', '375 25 77722377ssss,234234234234', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `pupil_performance_assessment`
--

CREATE TABLE IF NOT EXISTS `pupil_performance_assessment` (
  `pupil_performance_assessment_id` int(11) NOT NULL AUTO_INCREMENT,
  `pupil_id` int(11) NOT NULL,
  `performance_id` int(11) NOT NULL,
  `assessment` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'na',
  `studygroup_id` int(11) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `passed` tinyint(4) NOT NULL DEFAULT '0',
  `content_en` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `activation_date` date NOT NULL,
  PRIMARY KEY (`pupil_performance_assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `pupil_pupilgroup`
--

CREATE TABLE IF NOT EXISTS `pupil_pupilgroup` (
  `pupil_pupilgroup_id` int(11) NOT NULL AUTO_INCREMENT,
  `pupil_id` int(11) NOT NULL,
  `pupilgroup_id` int(11) NOT NULL,
  PRIMARY KEY (`pupil_pupilgroup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `pupil_studygroup`
--

CREATE TABLE IF NOT EXISTS `pupil_studygroup` (
  `pupil_studygroup_id` int(11) NOT NULL AUTO_INCREMENT,
  `pupil_id` int(11) NOT NULL,
  `studygroup_id` int(11) NOT NULL,
  PRIMARY KEY (`pupil_studygroup_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=397 ;

--
-- Дамп данных таблицы `pupil_studygroup`
--

INSERT INTO `pupil_studygroup` (`pupil_studygroup_id`, `pupil_id`, `studygroup_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(11, 11, 1),
(12, 12, 1),
(13, 13, 1),
(14, 14, 1),
(15, 15, 1),
(16, 16, 1),
(17, 17, 1),
(18, 18, 1),
(19, 19, 1),
(20, 20, 1),
(21, 21, 1),
(22, 22, 1),
(23, 23, 1),
(24, 24, 1),
(25, 25, 1),
(26, 26, 1),
(27, 27, 1),
(28, 28, 1),
(29, 29, 1),
(30, 30, 1),
(31, 31, 1),
(32, 32, 1),
(33, 33, 1),
(34, 34, 2),
(35, 35, 2),
(36, 36, 2),
(37, 37, 2),
(38, 38, 2),
(39, 39, 2),
(40, 40, 2),
(41, 41, 2),
(42, 42, 2),
(43, 43, 2),
(44, 44, 2),
(45, 45, 2),
(46, 46, 2),
(47, 47, 2),
(48, 48, 2),
(49, 49, 2),
(50, 50, 2),
(51, 51, 2),
(52, 52, 2),
(53, 53, 2),
(54, 54, 2),
(55, 55, 2),
(56, 56, 2),
(57, 57, 2),
(58, 58, 2),
(59, 59, 2),
(60, 60, 2),
(61, 61, 2),
(62, 62, 2),
(63, 63, 2),
(64, 64, 2),
(65, 65, 2),
(66, 66, 2),
(67, 67, 3),
(68, 68, 3),
(69, 69, 3),
(70, 70, 3),
(71, 71, 3),
(72, 72, 3),
(73, 73, 3),
(74, 74, 3),
(75, 75, 3),
(76, 76, 3),
(77, 77, 3),
(78, 78, 3),
(79, 79, 3),
(80, 80, 3),
(81, 81, 3),
(82, 82, 3),
(83, 83, 3),
(84, 84, 3),
(85, 85, 3),
(86, 86, 3),
(87, 87, 3),
(88, 88, 3),
(89, 89, 3),
(90, 90, 3),
(91, 91, 3),
(92, 92, 3),
(93, 93, 3),
(94, 94, 3),
(95, 95, 3),
(96, 96, 3),
(97, 97, 3),
(98, 98, 3),
(99, 99, 3),
(100, 100, 4),
(101, 101, 4),
(102, 102, 4),
(103, 103, 4),
(104, 104, 4),
(105, 105, 4),
(106, 106, 4),
(107, 107, 4),
(108, 108, 4),
(109, 109, 4),
(110, 110, 4),
(111, 111, 4),
(112, 112, 4),
(113, 113, 4),
(114, 114, 4),
(115, 115, 4),
(116, 116, 4),
(117, 117, 4),
(118, 118, 4),
(119, 119, 4),
(120, 120, 4),
(121, 121, 4),
(122, 122, 4),
(123, 123, 4),
(124, 124, 4),
(125, 125, 4),
(126, 126, 4),
(127, 127, 4),
(128, 128, 4),
(129, 129, 4),
(130, 130, 4),
(131, 131, 4),
(132, 132, 4),
(133, 133, 5),
(134, 134, 5),
(135, 135, 5),
(136, 136, 5),
(137, 137, 5),
(138, 138, 5),
(139, 139, 5),
(140, 140, 5),
(141, 141, 5),
(142, 142, 5),
(143, 143, 5),
(144, 144, 5),
(145, 145, 5),
(146, 146, 5),
(147, 147, 5),
(148, 148, 5),
(149, 149, 5),
(150, 150, 5),
(151, 151, 5),
(152, 152, 5),
(153, 153, 5),
(154, 154, 5),
(155, 155, 5),
(156, 156, 5),
(157, 157, 5),
(158, 158, 5),
(159, 159, 5),
(160, 160, 5),
(161, 161, 5),
(162, 162, 5),
(163, 163, 5),
(164, 164, 5),
(165, 165, 5),
(166, 166, 6),
(167, 167, 6),
(168, 168, 6),
(169, 169, 6),
(170, 170, 6),
(171, 171, 6),
(172, 172, 6),
(173, 173, 6),
(174, 174, 6),
(175, 175, 6),
(176, 176, 6),
(177, 177, 6),
(178, 178, 6),
(179, 179, 6),
(180, 180, 6),
(181, 181, 6),
(182, 182, 6),
(183, 183, 6),
(184, 184, 6),
(185, 185, 6),
(186, 186, 6),
(187, 187, 6),
(188, 188, 6),
(189, 189, 6),
(190, 190, 6),
(191, 191, 6),
(192, 192, 6),
(193, 193, 6),
(194, 194, 6),
(195, 195, 6),
(196, 196, 6),
(197, 197, 6),
(198, 198, 6),
(199, 199, 7),
(200, 200, 7),
(201, 201, 7),
(202, 202, 7),
(203, 203, 7),
(204, 204, 7),
(205, 205, 7),
(206, 206, 7),
(207, 207, 7),
(208, 208, 7),
(209, 209, 7),
(210, 210, 7),
(211, 211, 7),
(212, 212, 7),
(213, 213, 7),
(214, 214, 7),
(215, 215, 7),
(216, 216, 7),
(217, 217, 7),
(218, 218, 7),
(219, 219, 7),
(220, 220, 7),
(221, 221, 7),
(222, 222, 7),
(223, 223, 7),
(224, 224, 7),
(225, 225, 7),
(226, 226, 7),
(227, 227, 7),
(228, 228, 7),
(229, 229, 7),
(230, 230, 7),
(231, 231, 7),
(232, 232, 8),
(233, 233, 8),
(234, 234, 8),
(235, 235, 8),
(236, 236, 8),
(237, 237, 8),
(238, 238, 8),
(239, 239, 8),
(240, 240, 8),
(241, 241, 8),
(242, 242, 8),
(243, 243, 8),
(244, 244, 8),
(245, 245, 8),
(246, 246, 8),
(247, 247, 8),
(248, 248, 8),
(249, 249, 8),
(250, 250, 8),
(251, 251, 8),
(252, 252, 8),
(253, 253, 8),
(254, 254, 8),
(255, 255, 8),
(256, 256, 8),
(257, 257, 8),
(258, 258, 8),
(259, 259, 8),
(260, 260, 8),
(261, 261, 8),
(262, 262, 8),
(263, 263, 8),
(264, 264, 8),
(265, 265, 9),
(266, 266, 9),
(267, 267, 9),
(268, 268, 9),
(269, 269, 9),
(270, 270, 9),
(271, 271, 9),
(272, 272, 9),
(273, 273, 9),
(274, 274, 9),
(275, 275, 9),
(276, 276, 9),
(277, 277, 9),
(278, 278, 9),
(279, 279, 9),
(280, 280, 9),
(281, 281, 9),
(282, 282, 9),
(283, 283, 9),
(284, 284, 9),
(285, 285, 9),
(286, 286, 9),
(287, 287, 9),
(288, 288, 9),
(289, 289, 9),
(290, 290, 9),
(291, 291, 9),
(292, 292, 9),
(293, 293, 9),
(294, 294, 9),
(295, 295, 9),
(296, 296, 9),
(297, 297, 9),
(298, 298, 10),
(299, 299, 10),
(300, 300, 10),
(301, 301, 10),
(302, 302, 10),
(303, 303, 10),
(304, 304, 10),
(305, 305, 10),
(306, 306, 10),
(307, 307, 10),
(308, 308, 10),
(309, 309, 10),
(310, 310, 10),
(311, 311, 10),
(312, 312, 10),
(313, 313, 10),
(314, 314, 10),
(315, 315, 10),
(316, 316, 10),
(317, 317, 10),
(318, 318, 10),
(319, 319, 10),
(320, 320, 10),
(321, 321, 10),
(322, 322, 10),
(323, 323, 10),
(324, 324, 10),
(325, 325, 10),
(326, 326, 10),
(327, 327, 10),
(328, 328, 10),
(329, 329, 10),
(330, 330, 10),
(331, 331, 11),
(332, 332, 11),
(333, 333, 11),
(334, 334, 11),
(335, 335, 11),
(336, 336, 11),
(337, 337, 11),
(338, 338, 11),
(339, 339, 11),
(340, 340, 11),
(341, 341, 11),
(342, 342, 11),
(343, 343, 11),
(344, 344, 11),
(345, 345, 11),
(346, 346, 11),
(347, 347, 11),
(348, 348, 11),
(349, 349, 11),
(350, 350, 11),
(351, 351, 11),
(352, 352, 11),
(353, 353, 11),
(354, 354, 11),
(355, 355, 11),
(356, 356, 11),
(357, 357, 11),
(358, 358, 11),
(359, 359, 11),
(360, 360, 11),
(361, 361, 11),
(362, 362, 11),
(363, 363, 11),
(364, 364, 12),
(365, 365, 12),
(366, 366, 12),
(367, 367, 12),
(368, 368, 12),
(369, 369, 12),
(370, 370, 12),
(371, 371, 12),
(372, 372, 12),
(373, 373, 12),
(374, 374, 12),
(375, 375, 12),
(376, 376, 12),
(377, 377, 12),
(378, 378, 12),
(379, 379, 12),
(380, 380, 12),
(381, 381, 12),
(382, 382, 12),
(383, 383, 12),
(384, 384, 12),
(385, 385, 12),
(386, 386, 12),
(387, 387, 12),
(388, 388, 12),
(389, 389, 12),
(390, 390, 12),
(391, 391, 12),
(392, 392, 12),
(393, 393, 12),
(394, 394, 12),
(395, 395, 12),
(396, 396, 12);

-- --------------------------------------------------------

--
-- Структура таблицы `pupil_submission_result`
--

CREATE TABLE IF NOT EXISTS `pupil_submission_result` (
  `pupil_submission_result_id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_slot_id` int(11) NOT NULL,
  `result_set_id` int(11) DEFAULT NULL,
  `result` text CHARACTER SET utf8 COLLATE utf8_bin,
  `assessment` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `studygroup_id` int(11) NOT NULL,
  `grade_definition_id` int(11) NOT NULL,
  `pass` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pupil_submission_result_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=529 ;

--
-- Дамп данных таблицы `pupil_submission_result`
--

INSERT INTO `pupil_submission_result` (`pupil_submission_result_id`, `submission_slot_id`, `result_set_id`, `result`, `assessment`, `studygroup_id`, `grade_definition_id`, `pass`) VALUES
(67, 34, 182, NULL, '', 1, 0, 0),
(68, 35, 182, NULL, '', 1, 0, 0),
(69, 36, 182, NULL, '', 1, 0, 0),
(70, 37, 182, NULL, '', 1, 0, 0),
(71, 38, 182, NULL, '', 1, 0, 0),
(72, 39, 182, NULL, '', 1, 0, 0),
(73, 40, 182, NULL, '', 1, 0, 0),
(74, 41, 182, NULL, '', 1, 0, 0),
(75, 42, 182, NULL, '', 1, 0, 0),
(76, 43, 182, NULL, '', 1, 0, 0),
(77, 44, 182, NULL, '', 1, 0, 0),
(78, 45, 182, NULL, '', 1, 0, 0),
(79, 46, 182, NULL, '', 1, 0, 0),
(80, 47, 182, NULL, '', 1, 0, 0),
(81, 48, 182, NULL, '', 1, 0, 0),
(82, 49, 182, NULL, '', 1, 0, 0),
(83, 50, 182, NULL, '', 1, 0, 0),
(84, 51, 182, NULL, '', 1, 0, 0),
(85, 52, 182, NULL, '', 1, 0, 0),
(86, 53, 182, NULL, '', 1, 0, 0),
(87, 54, 182, NULL, '', 1, 0, 0),
(88, 55, 182, NULL, '', 1, 0, 0),
(89, 56, 182, NULL, '', 1, 0, 0),
(90, 57, 182, NULL, '', 1, 0, 0),
(91, 58, 182, NULL, '', 1, 0, 0),
(92, 59, 182, NULL, '', 1, 0, 0),
(93, 60, 182, NULL, '', 1, 0, 0),
(94, 61, 182, NULL, '', 1, 0, 0),
(95, 62, 182, NULL, '', 1, 0, 0),
(96, 63, 182, NULL, '', 1, 0, 0),
(97, 64, 182, NULL, '', 1, 0, 0),
(98, 65, 182, NULL, '', 1, 0, 0),
(99, 66, 182, NULL, '', 1, 0, 0),
(100, 34, 183, NULL, '', 1, 0, 0),
(101, 35, 183, NULL, '', 1, 0, 0),
(102, 36, 183, NULL, '', 1, 0, 0),
(103, 37, 183, NULL, '', 1, 0, 0),
(104, 38, 183, NULL, '', 1, 0, 0),
(105, 39, 183, NULL, '', 1, 0, 0),
(106, 40, 183, NULL, '', 1, 0, 0),
(107, 41, 183, NULL, '', 1, 0, 0),
(108, 42, 183, NULL, '', 1, 0, 0),
(109, 43, 183, NULL, '', 1, 0, 0),
(110, 44, 183, NULL, '', 1, 0, 0),
(111, 45, 183, NULL, '', 1, 0, 0),
(112, 46, 183, NULL, '', 1, 0, 0),
(113, 47, 183, NULL, '', 1, 0, 0),
(114, 48, 183, NULL, '', 1, 0, 0),
(115, 49, 183, NULL, '', 1, 0, 0),
(116, 50, 183, NULL, '', 1, 0, 0),
(117, 51, 183, NULL, '', 1, 0, 0),
(118, 52, 183, NULL, '', 1, 0, 0),
(119, 53, 183, NULL, '', 1, 0, 0),
(120, 54, 183, NULL, '', 1, 0, 0),
(121, 55, 183, NULL, '', 1, 0, 0),
(122, 56, 183, NULL, '', 1, 0, 0),
(123, 57, 183, NULL, '', 1, 0, 0),
(124, 58, 183, NULL, '', 1, 0, 0),
(125, 59, 183, NULL, '', 1, 0, 0),
(126, 60, 183, NULL, '', 1, 0, 0),
(127, 61, 183, NULL, '', 1, 0, 0),
(128, 62, 183, NULL, '', 1, 0, 0),
(129, 63, 183, NULL, '', 1, 0, 0),
(130, 64, 183, NULL, '', 1, 0, 0),
(131, 65, 183, NULL, '', 1, 0, 0),
(132, 66, 183, NULL, '', 1, 0, 0),
(463, 199, 194, NULL, '', 2, 0, 0),
(464, 200, 194, NULL, '', 2, 0, 0),
(465, 201, 194, NULL, '', 2, 0, 0),
(466, 202, 194, NULL, '', 2, 0, 0),
(467, 203, 194, NULL, '', 2, 0, 0),
(468, 204, 194, NULL, '', 2, 0, 0),
(469, 205, 194, NULL, '', 2, 0, 0),
(470, 206, 194, NULL, '', 2, 0, 0),
(471, 207, 194, NULL, '', 2, 0, 0),
(472, 208, 194, NULL, '', 2, 0, 0),
(473, 209, 194, NULL, '', 2, 0, 0),
(474, 210, 194, NULL, '', 2, 0, 0),
(475, 211, 194, NULL, '', 2, 0, 0),
(476, 212, 194, NULL, '', 2, 0, 0),
(477, 213, 194, NULL, '', 2, 0, 0),
(478, 214, 194, NULL, '', 2, 0, 0),
(479, 215, 194, NULL, '', 2, 0, 0),
(480, 216, 194, NULL, '', 2, 0, 0),
(481, 217, 194, NULL, '', 2, 0, 0),
(482, 218, 194, NULL, '', 2, 0, 0),
(483, 219, 194, NULL, '', 2, 0, 0),
(484, 220, 194, NULL, '', 2, 0, 0),
(485, 221, 194, NULL, '', 2, 0, 0),
(486, 222, 194, NULL, '', 2, 0, 0),
(487, 223, 194, NULL, '', 2, 0, 0),
(488, 224, 194, NULL, '', 2, 0, 0),
(489, 225, 194, NULL, '', 2, 0, 0),
(490, 226, 194, NULL, '', 2, 0, 0),
(491, 227, 194, NULL, '', 2, 0, 0),
(492, 228, 194, NULL, '', 2, 0, 0),
(493, 229, 194, NULL, '', 2, 0, 0),
(494, 230, 194, NULL, '', 2, 0, 0),
(495, 231, 194, NULL, '', 2, 0, 0),
(496, 232, 195, NULL, '', 1, 0, 0),
(497, 233, 195, NULL, '', 1, 0, 0),
(498, 234, 195, NULL, '', 1, 0, 0),
(499, 235, 195, NULL, '', 1, 0, 0),
(500, 236, 195, NULL, '', 1, 0, 0),
(501, 237, 195, NULL, '', 1, 0, 0),
(502, 238, 195, NULL, '', 1, 0, 0),
(503, 239, 195, NULL, '', 1, 0, 0),
(504, 240, 195, NULL, '', 1, 0, 0),
(505, 241, 195, NULL, '', 1, 0, 0),
(506, 242, 195, NULL, '', 1, 0, 0),
(507, 243, 195, NULL, '', 1, 0, 0),
(508, 244, 195, NULL, '', 1, 0, 0),
(509, 245, 195, NULL, '', 1, 0, 0),
(510, 246, 195, NULL, '', 1, 0, 0),
(511, 247, 195, NULL, '', 1, 0, 0),
(512, 248, 195, NULL, '', 1, 0, 0),
(513, 249, 195, NULL, '', 1, 0, 0),
(514, 250, 195, NULL, '', 1, 0, 0),
(515, 251, 195, NULL, '', 1, 0, 0),
(516, 252, 195, NULL, '', 1, 0, 0),
(517, 253, 195, NULL, '', 1, 0, 0),
(518, 254, 195, NULL, '', 1, 0, 0),
(519, 255, 195, NULL, '', 1, 0, 0),
(520, 256, 195, NULL, '', 1, 0, 0),
(521, 257, 195, NULL, '', 1, 0, 0),
(522, 258, 195, NULL, '', 1, 0, 0),
(523, 259, 195, NULL, '', 1, 0, 0),
(524, 260, 195, NULL, '', 1, 0, 0),
(525, 261, 195, NULL, '', 1, 0, 0),
(526, 262, 195, NULL, '', 1, 0, 0),
(527, 263, 195, NULL, '', 1, 0, 0),
(528, 264, 195, NULL, '', 1, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `pupli_submission_slot`
--

CREATE TABLE IF NOT EXISTS `pupli_submission_slot` (
  `submission_slot_id` int(11) NOT NULL AUTO_INCREMENT,
  `assignment_id` int(11) NOT NULL,
  `activation_date` date NOT NULL,
  `pupil_id` int(11) NOT NULL,
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'Not subm.',
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `content_en` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `studygroup_id` int(11) NOT NULL,
  PRIMARY KEY (`submission_slot_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=265 ;

--
-- Дамп данных таблицы `pupli_submission_slot`
--

INSERT INTO `pupli_submission_slot` (`submission_slot_id`, `assignment_id`, `activation_date`, `pupil_id`, `status`, `active`, `content_en`, `studygroup_id`) VALUES
(34, 2, '2013-03-20', 1, '1', 1, '', 1),
(35, 2, '2013-03-20', 2, 'Not subm.', 1, '', 1),
(36, 2, '2013-03-20', 3, 'Not subm.', 1, '', 1),
(37, 2, '2013-03-20', 4, 'Not subm.', 1, '', 1),
(38, 2, '2013-03-20', 5, 'Not subm.', 1, '', 1),
(39, 2, '2013-03-20', 6, 'Not subm.', 1, '', 1),
(40, 2, '2013-03-20', 7, 'Not subm.', 1, '', 1),
(41, 2, '2013-03-20', 8, 'Not subm.', 1, '', 1),
(42, 2, '2013-03-20', 9, 'Not subm.', 1, '', 1),
(43, 2, '2013-03-20', 10, 'Not subm.', 1, '', 1),
(44, 2, '2013-03-20', 11, 'Not subm.', 1, '', 1),
(45, 2, '2013-03-20', 12, 'Not subm.', 1, '', 1),
(46, 2, '2013-03-20', 13, 'Not subm.', 1, '', 1),
(47, 2, '2013-03-20', 14, 'Not subm.', 1, '', 1),
(48, 2, '2013-03-20', 15, 'Not subm.', 1, '', 1),
(49, 2, '2013-03-20', 16, 'Not subm.', 1, '', 1),
(50, 2, '2013-03-20', 17, 'Not subm.', 1, '', 1),
(51, 2, '2013-03-20', 18, 'Not subm.', 1, '', 1),
(52, 2, '2013-03-20', 19, 'Not subm.', 1, '', 1),
(53, 2, '2013-03-20', 20, 'Not subm.', 1, '', 1),
(54, 2, '2013-03-20', 21, 'Not subm.', 1, '', 1),
(55, 2, '2013-03-20', 22, 'Not subm.', 1, '', 1),
(56, 2, '2013-03-20', 23, 'Not subm.', 1, '', 1),
(57, 2, '2013-03-20', 24, 'Not subm.', 1, '', 1),
(58, 2, '2013-03-20', 25, 'Not subm.', 1, '', 1),
(59, 2, '2013-03-20', 26, 'Not subm.', 1, '', 1),
(60, 2, '2013-03-20', 27, 'Not subm.', 1, '', 1),
(61, 2, '2013-03-20', 28, 'Not subm.', 1, '', 1),
(62, 2, '2013-03-20', 29, 'Not subm.', 1, '', 1),
(63, 2, '2013-03-20', 30, 'Not subm.', 1, '', 1),
(64, 2, '2013-03-20', 31, 'Not subm.', 1, '', 1),
(65, 2, '2013-03-20', 32, 'Not subm.', 1, '', 1),
(66, 2, '2013-03-20', 33, 'Not subm.', 1, '', 1),
(199, 7, '2013-03-20', 34, 'Not subm.', 1, '', 2),
(200, 7, '2013-03-20', 35, 'Not subm.', 1, '', 2),
(201, 7, '2013-03-20', 36, 'Not subm.', 1, '', 2),
(202, 7, '2013-03-20', 37, 'Not subm.', 1, '', 2),
(203, 7, '2013-03-20', 38, 'Not subm.', 1, '', 2),
(204, 7, '2013-03-20', 39, 'Not subm.', 1, '', 2),
(205, 7, '2013-03-20', 40, 'Not subm.', 1, '', 2),
(206, 7, '2013-03-20', 41, 'Not subm.', 1, '', 2),
(207, 7, '2013-03-20', 42, 'Not subm.', 1, '', 2),
(208, 7, '2013-03-20', 43, 'Not subm.', 1, '', 2),
(209, 7, '2013-03-20', 44, 'Not subm.', 1, '', 2),
(210, 7, '2013-03-20', 45, 'Not subm.', 1, '', 2),
(211, 7, '2013-03-20', 46, 'Not subm.', 1, '', 2),
(212, 7, '2013-03-20', 47, 'Not subm.', 1, '', 2),
(213, 7, '2013-03-20', 48, 'Not subm.', 1, '', 2),
(214, 7, '2013-03-20', 49, 'Not subm.', 1, '', 2),
(215, 7, '2013-03-20', 50, 'Not subm.', 1, '', 2),
(216, 7, '2013-03-20', 51, 'Not subm.', 1, '', 2),
(217, 7, '2013-03-20', 52, 'Not subm.', 1, '', 2),
(218, 7, '2013-03-20', 53, 'Not subm.', 1, '', 2),
(219, 7, '2013-03-20', 54, 'Not subm.', 1, '', 2),
(220, 7, '2013-03-20', 55, 'Not subm.', 1, '', 2),
(221, 7, '2013-03-20', 56, 'Not subm.', 1, '', 2),
(222, 7, '2013-03-20', 57, 'Not subm.', 1, '', 2),
(223, 7, '2013-03-20', 58, 'Not subm.', 1, '', 2),
(224, 7, '2013-03-20', 59, 'Not subm.', 1, '', 2),
(225, 7, '2013-03-20', 60, 'Not subm.', 1, '', 2),
(226, 7, '2013-03-20', 61, 'Not subm.', 1, '', 2),
(227, 7, '2013-03-20', 62, 'Not subm.', 1, '', 2),
(228, 7, '2013-03-20', 63, 'Not subm.', 1, '', 2),
(229, 7, '2013-03-20', 64, 'Not subm.', 1, '', 2),
(230, 7, '2013-03-20', 65, 'Not subm.', 1, '', 2),
(231, 7, '2013-03-20', 66, 'Not subm.', 1, '', 2),
(232, 8, '2013-03-20', 1, 'Not subm.', 1, '', 1),
(233, 8, '2013-03-20', 2, 'Not subm.', 1, '', 1),
(234, 8, '2013-03-20', 3, 'Not subm.', 1, '', 1),
(235, 8, '2013-03-20', 4, 'Not subm.', 1, '', 1),
(236, 8, '2013-03-20', 5, 'Not subm.', 1, '', 1),
(237, 8, '2013-03-20', 6, 'Not subm.', 1, '', 1),
(238, 8, '2013-03-20', 7, 'Not subm.', 1, '', 1),
(239, 8, '2013-03-20', 8, 'Not subm.', 1, '', 1),
(240, 8, '2013-03-20', 9, 'Not subm.', 1, '', 1),
(241, 8, '2013-03-20', 10, 'Not subm.', 1, '', 1),
(242, 8, '2013-03-20', 11, 'Not subm.', 1, '', 1),
(243, 8, '2013-03-20', 12, 'Not subm.', 1, '', 1),
(244, 8, '2013-03-20', 13, 'Not subm.', 1, '', 1),
(245, 8, '2013-03-20', 14, 'Not subm.', 1, '', 1),
(246, 8, '2013-03-20', 15, 'Not subm.', 1, '', 1),
(247, 8, '2013-03-20', 16, 'Not subm.', 1, '', 1),
(248, 8, '2013-03-20', 17, 'Not subm.', 1, '', 1),
(249, 8, '2013-03-20', 18, 'Not subm.', 1, '', 1),
(250, 8, '2013-03-20', 19, 'Not subm.', 1, '', 1),
(251, 8, '2013-03-20', 20, 'Not subm.', 1, '', 1),
(252, 8, '2013-03-20', 21, 'Not subm.', 1, '', 1),
(253, 8, '2013-03-20', 22, 'Not subm.', 1, '', 1),
(254, 8, '2013-03-20', 23, 'Not subm.', 1, '', 1),
(255, 8, '2013-03-20', 24, 'Not subm.', 1, '', 1),
(256, 8, '2013-03-20', 25, 'Not subm.', 1, '', 1),
(257, 8, '2013-03-20', 26, 'Not subm.', 1, '', 1),
(258, 8, '2013-03-20', 27, 'Not subm.', 1, '', 1),
(259, 8, '2013-03-20', 28, 'Not subm.', 1, '', 1),
(260, 8, '2013-03-20', 29, 'Not subm.', 1, '', 1),
(261, 8, '2013-03-20', 30, 'Not subm.', 1, '', 1),
(262, 8, '2013-03-20', 31, 'Not subm.', 1, '', 1),
(263, 8, '2013-03-20', 32, 'Not subm.', 1, '', 1),
(264, 8, '2013-03-20', 33, 'Not subm.', 1, '', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `resultsets`
--

CREATE TABLE IF NOT EXISTS `resultsets` (
  `resultset_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `assignment_id` int(11) NOT NULL DEFAULT '0',
  `result_unit_id` int(11) NOT NULL DEFAULT '1',
  `result_max` varchar(50) DEFAULT NULL,
  `result_pass` varchar(50) DEFAULT NULL,
  `assessement_id` int(11) NOT NULL DEFAULT '0',
  `mandatory` tinyint(4) NOT NULL DEFAULT '0',
  `result_unit` varchar(255) NOT NULL DEFAULT '%',
  `assessment` varchar(255) NOT NULL DEFAULT 'F',
  `result` varchar(255) NOT NULL DEFAULT '0%',
  `deadline` int(11) NOT NULL DEFAULT '0',
  `studygroup_ids` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`resultset_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=196 ;

--
-- Дамп данных таблицы `resultsets`
--

INSERT INTO `resultsets` (`resultset_id`, `created_at`, `sort_order`, `assignment_id`, `result_unit_id`, `result_max`, `result_pass`, `assessement_id`, `mandatory`, `result_unit`, `assessment`, `result`, `deadline`, `studygroup_ids`) VALUES
(182, '2013-03-20 15:33:02', 0, 2, 2, '100%', '40%', 0, 0, '%', 'F', '0%', 0, '1'),
(183, '2013-03-20 15:33:41', 0, 2, 1, '400p', '300p', 0, 0, '%', 'F', '0%', 0, '1'),
(194, '2013-03-20 16:52:19', 0, 7, 1, '300p', '250p', 0, 0, '%', 'F', '0%', 0, '2'),
(195, '2013-03-20 16:52:43', 0, 8, 1, NULL, NULL, 0, 0, '%', 'F', '0%', 0, '1');

-- --------------------------------------------------------

--
-- Структура таблицы `resultset_to_course_objectives`
--

CREATE TABLE IF NOT EXISTS `resultset_to_course_objectives` (
  `rs_to_co_id` int(11) NOT NULL AUTO_INCREMENT,
  `resultset_id` int(11) NOT NULL,
  `objective_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'assignment',
  PRIMARY KEY (`rs_to_co_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=57 ;

--
-- Дамп данных таблицы `resultset_to_course_objectives`
--

INSERT INTO `resultset_to_course_objectives` (`rs_to_co_id`, `resultset_id`, `objective_id`, `type`) VALUES
(18, 182, 38, 'assignment'),
(19, 182, 39, 'assignment'),
(20, 182, 40, 'assignment'),
(21, 183, 38, 'assignment'),
(22, 183, 39, 'assignment'),
(23, 183, 40, 'assignment'),
(50, 194, 43, 'assignment'),
(51, 194, 44, 'assignment'),
(52, 195, 38, 'assignment'),
(53, 195, 39, 'assignment'),
(54, 195, 40, 'assignment'),
(55, 195, 70, 'assignment'),
(56, 195, 73, 'assignment');

-- --------------------------------------------------------

--
-- Структура таблицы `result_units`
--

CREATE TABLE IF NOT EXISTS `result_units` (
  `result_unit_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `result_unit_en` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`result_unit_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `result_units`
--

INSERT INTO `result_units` (`result_unit_id`, `created_at`, `result_unit_en`, `order`) VALUES
(1, '2012-10-12 11:18:25', 'Points', 0),
(2, '2012-10-12 10:51:41', 'Percent', 0),
(3, '2012-10-12 11:18:25', 'Grade', 0),
(4, '2013-02-25 14:21:12', 'Pass', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `result_units_pupil`
--

CREATE TABLE IF NOT EXISTS `result_units_pupil` (
  `result_units_pupil_id` int(11) NOT NULL AUTO_INCREMENT,
  `pupil_id` int(11) NOT NULL,
  `result_unit_id` int(11) NOT NULL,
  PRIMARY KEY (`result_units_pupil_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `staff_members`
--

CREATE TABLE IF NOT EXISTS `staff_members` (
  `staff_member_id` int(11) NOT NULL AUTO_INCREMENT,
  `fore_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `last_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`staff_member_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `staff_members`
--

INSERT INTO `staff_members` (`staff_member_id`, `fore_name`, `last_name`, `created_at`, `sort_order`) VALUES
(1, 'Teacer', 'Loret', '2012-12-10 07:16:39', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `studygroups`
--

CREATE TABLE IF NOT EXISTS `studygroups` (
  `studygroup_id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `course_id` int(11) NOT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) DEFAULT NULL,
  `programme_id` int(11) DEFAULT NULL,
  `shared` tinyint(4) NOT NULL DEFAULT '0',
  `resultset_id` int(11) NOT NULL,
  PRIMARY KEY (`studygroup_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=13 ;

--
-- Дамп данных таблицы `studygroups`
--

INSERT INTO `studygroups` (`studygroup_id`, `title_en`, `course_id`, `startdate`, `enddate`, `created_at`, `sort_order`, `programme_id`, `shared`, `resultset_id`) VALUES
(1, 'ENG-09a', 1, '2012-12-04', '2012-12-27', '2012-11-30 09:26:52', 1, 1, 1, 10),
(2, 'MAT-09a', 2, '2012-12-02', '2012-12-29', '2012-11-30 09:26:52', 2, 1, 0, 14),
(3, 'GEO-07b', 1, '2012-12-30', '2012-12-31', '2012-11-30 09:26:52', 3, 2, 0, 15),
(4, 'FRE-10a', 0, NULL, NULL, '2013-03-18 12:30:56', 4, 2, 0, 0),
(5, 'SWE-10b', 0, NULL, NULL, '2013-03-18 12:32:20', 5, 3, 0, 0),
(6, 'SPA-10a', 0, NULL, NULL, '2013-03-18 12:32:42', 6, 3, 0, 0),
(7, 'LAT-10a', 0, NULL, NULL, '2013-03-18 12:33:09', 7, 4, 0, 0),
(8, 'RUS-10a', 0, NULL, NULL, '2013-03-18 12:33:41', 8, 4, 0, 0),
(9, 'BOR-10b', 0, NULL, NULL, '2013-03-18 12:34:09', 9, 5, 0, 0),
(10, 'FIL-10a', 0, NULL, NULL, '2013-03-18 12:34:33', 10, 5, 0, 0),
(11, 'GUS-9b', 0, NULL, NULL, '2013-03-18 13:00:21', 11, 6, 0, 0),
(12, 'SET-9c', 0, NULL, NULL, '2013-03-18 13:00:41', 12, 6, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `studygroup_grades`
--

CREATE TABLE IF NOT EXISTS `studygroup_grades` (
  `studygroup_grades_id` int(11) NOT NULL AUTO_INCREMENT,
  `studygroup_id` int(11) NOT NULL DEFAULT '1',
  `goal` int(11) NOT NULL DEFAULT '1',
  `prognose` int(11) NOT NULL DEFAULT '1',
  `grade` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`studygroup_grades_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `studygroup_grades`
--

INSERT INTO `studygroup_grades` (`studygroup_grades_id`, `studygroup_id`, `goal`, `prognose`, `grade`) VALUES
(1, 1, 5, 7, 6),
(2, 2, 2, 2, 3),
(3, 3, 3, 3, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `studygroup_pupil`
--

CREATE TABLE IF NOT EXISTS `studygroup_pupil` (
  `studygroup_pupil_id` int(11) NOT NULL AUTO_INCREMENT,
  `studygroup_id` int(11) NOT NULL,
  `pupil_id` int(11) NOT NULL,
  PRIMARY KEY (`studygroup_pupil_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='studygroup_pupil' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `subject_id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) COLLATE utf8_bin NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int(11) NOT NULL,
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `superadmin`
--

CREATE TABLE IF NOT EXISTS `superadmin` (
  `superadmin_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `limit_mb` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `limit_users` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `inactivity_logout` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`superadmin_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `superadmin`
--

INSERT INTO `superadmin` (`superadmin_id`, `username`, `password`, `created_at`, `limit_mb`, `limit_users`, `inactivity_logout`) VALUES
(1, 'Chehow', '1', '2012-10-24 11:01:09', '12312313', '123', '122'),
(2, 'admin', 'admin', '2012-10-24 11:08:46', '123', '1243', '12');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
