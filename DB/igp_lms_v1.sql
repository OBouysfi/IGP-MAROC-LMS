-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql:3306
-- Généré le : sam. 06 déc. 2025 à 23:54
-- Version du serveur : 8.0.44
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `igp_lms`
--

-- --------------------------------------------------------

--
-- Structure de la table `absence_justifications`
--

CREATE TABLE `absence_justifications` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `attendance_id` bigint UNSIGNED DEFAULT NULL,
  `absence_date` date NOT NULL,
  `absence_course` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `assistants`
--

CREATE TABLE `assistants` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `employee_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notification_settings` json DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED DEFAULT NULL,
  `professor_id` bigint UNSIGNED DEFAULT NULL,
  `schedule_id` bigint UNSIGNED DEFAULT NULL,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `type` enum('absent','retard','justifié') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'absent',
  `justification` text COLLATE utf8mb4_unicode_ci,
  `justification_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `justified_at` timestamp NULL DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `attendance_logs`
--

CREATE TABLE `attendance_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `professor_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `schedule_id` bigint UNSIGNED DEFAULT NULL,
  `date` date NOT NULL,
  `clock_in` time DEFAULT NULL,
  `clock_out` time DEFAULT NULL,
  `hours_worked` decimal(5,2) NOT NULL DEFAULT '0.00',
  `hours_scheduled` decimal(5,2) NOT NULL DEFAULT '0.00',
  `status` enum('present','absent','late','early_leave') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
  `type` enum('cours','td','tp','session_live') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cours',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `validated` tinyint(1) NOT NULL DEFAULT '0',
  `validated_by` bigint UNSIGNED DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `courses`
--

CREATE TABLE `courses` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_id` bigint UNSIGNED DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `program_id` bigint UNSIGNED DEFAULT NULL,
  `filiere_id` bigint UNSIGNED DEFAULT NULL,
  `level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `credits` int NOT NULL DEFAULT '0',
  `semester` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `professor_id` bigint UNSIGNED DEFAULT NULL,
  `students_count` int NOT NULL DEFAULT '0',
  `max_students` int NOT NULL DEFAULT '30',
  `hours_total` int NOT NULL DEFAULT '0',
  `hours_completed` int NOT NULL DEFAULT '0',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `schedule` json DEFAULT NULL,
  `status` enum('À venir','En cours','Terminé') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'À venir',
  `materials` json DEFAULT NULL,
  `completion_rate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `course_resources`
--

CREATE TABLE `course_resources` (
  `id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('pdf','video','document','link') COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `size` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `exams`
--

CREATE TABLE `exams` (
  `id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `professor_id` bigint UNSIGNED DEFAULT NULL,
  `type` enum('partiel','final','rattrapage','controle') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `duration_minutes` int NOT NULL,
  `room` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_students` int NOT NULL DEFAULT '0',
  `graded_students` int NOT NULL DEFAULT '0',
  `average` decimal(5,2) DEFAULT NULL,
  `min_grade` decimal(5,2) DEFAULT NULL,
  `max_grade` decimal(5,2) DEFAULT NULL,
  `pass_rate` decimal(5,2) DEFAULT NULL,
  `status` enum('planifié','en_cours','terminé','notes_saisies','validé') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planifié',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filieres`
--

CREATE TABLE `filieres` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `program_ids` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `filieres`
--

INSERT INTO `filieres` (`id`, `name`, `code`, `description`, `program_ids`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Management et gestion des PME', 'MG-PME', NULL, '[2]', 1, '2025-12-06 22:59:14', '2025-12-06 22:59:14'),
(2, 'Ressources Humaines', 'RH', NULL, '[2]', 1, '2025-12-06 22:59:53', '2025-12-06 22:59:53'),
(3, 'Banque & Assurance', 'BA', NULL, '[2]', 1, '2025-12-06 23:00:16', '2025-12-06 23:00:16'),
(4, 'Management des Ressources Humaines', 'MASTER-RH', NULL, '[3]', 1, '2025-12-06 23:02:20', '2025-12-06 23:02:20'),
(5, 'Management et Stratégie d’Entreprise', 'MANAGEMENT-STRATEGIE-ENTREPRISE', NULL, '[3]', 1, '2025-12-06 23:03:01', '2025-12-06 23:03:01'),
(6, 'Action commerciale et marketing', 'ACTION-COMMERCIALE-MARKETING', NULL, '[4]', 1, '2025-12-06 23:03:50', '2025-12-06 23:03:50');

-- --------------------------------------------------------

--
-- Structure de la table `grades`
--

CREATE TABLE `grades` (
  `id` bigint UNSIGNED NOT NULL,
  `exam_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `grade` decimal(5,2) NOT NULL,
  `status` enum('validé','rattrapage','absent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'validé',
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE `groups` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_id` bigint UNSIGNED DEFAULT NULL,
  `filiere_id` bigint UNSIGNED DEFAULT NULL,
  `level` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_students` int NOT NULL DEFAULT '30',
  `delegate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delegate_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schedule` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `groups`
--

INSERT INTO `groups` (`id`, `name`, `code`, `program_id`, `filiere_id`, `level`, `max_students`, `delegate`, `delegate_email`, `schedule`, `created_at`, `updated_at`) VALUES
(1, 'Bachelor PME 2024-2025', 'BACHELOR-PME-24-25', 2, 1, '3ème année', 30, NULL, NULL, '[]', '2025-12-06 23:19:08', '2025-12-06 23:19:08'),
(2, 'Bachelor RH 2024-2025', 'BACHELOR-RH-24-25', 2, 2, '3ème année', 30, NULL, NULL, '[]', '2025-12-06 23:19:42', '2025-12-06 23:19:42'),
(3, 'Bachelor BA 2024-2025', 'BACHELOR-BA-24-25', 2, 3, '3ème année', 30, NULL, NULL, '[]', '2025-12-06 23:20:18', '2025-12-06 23:20:18'),
(4, 'Bachelor PME 2025-2026', 'BACHELOR-PME-25-26', 2, 3, '3ème année', 30, NULL, NULL, '[]', '2025-12-06 23:20:51', '2025-12-06 23:20:51'),
(5, 'Master 1 RH-2025-2026', 'MASTER-I-25-26', 3, 4, 'Master 1', 30, NULL, NULL, '[]', '2025-12-06 23:21:22', '2025-12-06 23:21:22'),
(6, 'Master 1 -2 MSE-2024-2025', 'MASTER-I-24-25', 3, 5, 'Master 1', 30, NULL, NULL, '[]', '2025-12-06 23:21:52', '2025-12-06 23:21:52'),
(7, 'Formation Initiale', 'FORMATION-INITIALE', 4, 6, '2ème année', 30, NULL, NULL, '[]', '2025-12-06 23:22:16', '2025-12-06 23:22:16');

-- --------------------------------------------------------

--
-- Structure de la table `group_course`
--

CREATE TABLE `group_course` (
  `id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `hours_week` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `group_student`
--

CREATE TABLE `group_student` (
  `id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `group_student`
--

INSERT INTO `group_student` (`id`, `group_id`, `student_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 1, 2, NULL, NULL),
(3, 1, 3, NULL, NULL),
(4, 1, 4, NULL, NULL),
(5, 2, 5, NULL, NULL),
(6, 2, 6, NULL, NULL),
(7, 2, 7, NULL, NULL),
(8, 3, 8, NULL, NULL),
(9, 4, 9, NULL, NULL),
(10, 4, 10, NULL, NULL),
(11, 4, 11, NULL, NULL),
(12, 4, 12, NULL, NULL),
(13, 7, 16, NULL, NULL),
(14, 6, 15, NULL, NULL),
(15, 6, 14, NULL, NULL),
(16, 5, 13, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `jitsi_sessions`
--

CREATE TABLE `jitsi_sessions` (
  `id` bigint UNSIGNED NOT NULL,
  `professor_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `session_date` date NOT NULL,
  `start_time` time NOT NULL,
  `duration` int NOT NULL,
  `status` enum('planifiée','en_cours','terminée','annulée') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planifiée',
  `started_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `max_participants` int NOT NULL DEFAULT '50',
  `room_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recording_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `chat_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jitsi_session_participants`
--

CREATE TABLE `jitsi_session_participants` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `registered` tinyint(1) NOT NULL DEFAULT '1',
  `joined` tinyint(1) NOT NULL DEFAULT '0',
  `joined_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `successful` tinyint(1) NOT NULL DEFAULT '0',
  `attempted_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `login_attempts`
--

INSERT INTO `login_attempts` (`id`, `email`, `ip_address`, `user_agent`, `successful`, `attempted_at`) VALUES
(1, 'bouysfi.othman@gmail.com', '172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, '2025-12-06 22:42:23'),
(2, 'bouysfi.othman@gmail.com', '172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, '2025-12-06 23:44:01');

-- --------------------------------------------------------

--
-- Structure de la table `login_logs`
--

CREATE TABLE `login_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('success','failed','2fa_sent','2fa_verified','locked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'failed',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `login_logs`
--

INSERT INTO `login_logs` (`id`, `user_id`, `ip_address`, `user_agent`, `device_id`, `status`, `reason`, `created_at`, `updated_at`) VALUES
(1, 1, '172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', NULL, 'success', NULL, '2025-12-06 22:42:23', '2025-12-06 22:42:23'),
(2, 1, '172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', NULL, 'success', NULL, '2025-12-06 23:44:02', '2025-12-06 23:44:02');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2025_10_31_232838_create_permission_tables', 1),
(4, '2025_10_31_233114_create_programs_table', 1),
(5, '2025_10_31_233114_create_users_table', 1),
(6, '2025_10_31_233115_create_years_table', 1),
(7, '2025_10_31_233116_create_courses_table', 1),
(8, '2025_10_31_234151_create_personal_access_tokens_table', 1),
(9, '2025_11_01_205906_create_login_attempts_table', 1),
(10, '2025_11_01_205906_create_user_devices_table', 1),
(11, '2025_11_01_205907_create_login_logs_table', 1),
(12, '2025_11_01_205908_add_account_locked_fields_to_users_table', 1),
(13, '2025_11_01_205909_create_students_table', 1),
(14, '2025_11_18_151817_create_professors_table', 1),
(15, '2025_11_18_211606_update_courses_table_for_full_system', 1),
(16, '2025_11_18_213228_make_professor_id_nullable_in_courses_table', 1),
(17, '2025_11_18_214311_create_groups_table', 1),
(18, '2025_11_20_210630_create_schedules_table', 1),
(19, '2025_11_21_084202_create_exams_and_grades_tables', 1),
(20, '2025_11_21_164538_create_attendances_table', 1),
(21, '2025_11_21_170518_create_student_documents_table', 1),
(22, '2025_11_21_213208_create_payroll_table', 1),
(23, '2025_11_21_213304_create_payroll_details_table', 1),
(24, '2025_11_21_213334_create_add_payroll_fields_to_professors_table', 1),
(25, '2025_11_21_222703_create_settings_table', 1),
(26, '2025_11_23_221112_create_course_resources_table', 1),
(27, '2025_11_25_100008_add_group_id_to_students_table', 1),
(28, '2025_11_25_104512_create_jitsi_sessions_table', 1),
(29, '2025_11_25_165348_create_professor_documents_table', 1),
(30, '2025_11_25_172104_add_settings_to_professors_table', 1),
(31, '2025_11_25_233142_add_group_id_to_courses_table', 1),
(32, '2025_11_25_233143_add_settings_to_students_table', 1),
(33, '2025_11_25_233145_create_absence_justifications_table', 1),
(34, '2025_11_25_233148_create_assistants_table', 1),
(35, '2025_12_01_200332_update_courses_relations', 1),
(36, '2025_12_02_080720_add_professor_id_to_attendances_table', 1),
(37, '2025_12_02_082435_make_student_id_nullable_in_attendances_table', 1),
(38, '2025_12_03_211745_create_attendance_logs_table', 1),
(39, '2025_12_03_212627_add_timestamps_to_jitsi_sessions_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(1, 'App\\Models\\User', 2),
(1, 'App\\Models\\User', 3),
(4, 'App\\Models\\User', 4),
(4, 'App\\Models\\User', 5),
(4, 'App\\Models\\User', 7),
(4, 'App\\Models\\User', 8),
(4, 'App\\Models\\User', 9),
(4, 'App\\Models\\User', 10),
(4, 'App\\Models\\User', 11),
(4, 'App\\Models\\User', 12),
(4, 'App\\Models\\User', 13),
(4, 'App\\Models\\User', 14),
(4, 'App\\Models\\User', 15),
(4, 'App\\Models\\User', 16),
(4, 'App\\Models\\User', 17),
(4, 'App\\Models\\User', 18),
(4, 'App\\Models\\User', 19),
(4, 'App\\Models\\User', 20),
(3, 'App\\Models\\User', 21),
(3, 'App\\Models\\User', 22),
(3, 'App\\Models\\User', 23),
(3, 'App\\Models\\User', 24),
(3, 'App\\Models\\User', 25),
(3, 'App\\Models\\User', 26);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payrolls`
--

CREATE TABLE `payrolls` (
  `id` bigint UNSIGNED NOT NULL,
  `professor_id` bigint UNSIGNED NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  `hours_worked` decimal(8,2) NOT NULL DEFAULT '0.00',
  `bonus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `deductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `gross_salary` decimal(10,2) NOT NULL,
  `net_salary` decimal(10,2) NOT NULL,
  `payment_status` enum('payé','en_attente','en_cours') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `payment_date` date DEFAULT NULL,
  `payment_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payroll_details`
--

CREATE TABLE `payroll_details` (
  `id` bigint UNSIGNED NOT NULL,
  `payroll_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED DEFAULT NULL,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hours` decimal(8,2) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth-token', '9e3b327cc96842cd5aed87f1d37478f21b7438a748d596b8098a1e7f3130ae2c', '[\"*\"]', '2025-12-06 23:42:12', '2025-12-06 23:42:23', '2025-12-06 22:42:23', '2025-12-06 23:42:12'),
(2, 'App\\Models\\User', 1, 'auth-token', 'd7b504833e16bb2446be46ba62c4f8522df869fd88b2c9651e7de836cf802c99', '[\"*\"]', '2025-12-06 23:54:35', '2025-12-07 00:44:02', '2025-12-06 23:44:02', '2025-12-06 23:54:35');

-- --------------------------------------------------------

--
-- Structure de la table `professors`
--

CREATE TABLE `professors` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `professor_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `nationality` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `hire_date` date DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contract_type` enum('CDI','CDD','Vacataire') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CDI',
  `bank_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hourly_rate` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_hours_month` int NOT NULL DEFAULT '0',
  `qualifications` json DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notification_settings` json DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `professors`
--

INSERT INTO `professors` (`id`, `user_id`, `phone`, `professor_code`, `gender`, `birth_date`, `nationality`, `address`, `hire_date`, `department`, `specialization`, `contract_type`, `bank_info`, `hourly_rate`, `total_hours_month`, `qualifications`, `bio`, `linkedin`, `github`, `notification_settings`, `preferences`, `created_at`, `updated_at`) VALUES
(1, 21, NULL, 'PROF-000001', 'Homme', '1999-08-09', 'Marocaine', 'DRISSIA 2 AV B NR 89', '2025-09-01', 'Informatique', 'Intelligence atificielle (IA)', 'Vacataire', NULL, 100.00, 24, '[\"Technical Lead\"]', 'Tech Lead | Full Stack Engineer | Laravel & Symfony | Next.js | Docker & DevOps | Software Quality & Testing', NULL, NULL, NULL, NULL, '2025-12-06 23:48:10', '2025-12-06 23:48:10'),
(2, 22, NULL, 'PROF-000002', 'Homme', NULL, 'Marocaine', NULL, '2025-12-06', 'Marketing', 'Commerce /Marketing', 'Vacataire', NULL, 0.00, 0, '[]', NULL, NULL, NULL, NULL, NULL, '2025-12-06 23:49:11', '2025-12-06 23:49:11'),
(3, 23, NULL, 'PROF-000003', 'Femme', NULL, 'Marocaine', NULL, '2025-12-06', 'Gestion & Finance', 'Management et Gestion', 'Vacataire', NULL, 0.00, 0, '[]', NULL, NULL, NULL, NULL, NULL, '2025-12-06 23:50:01', '2025-12-06 23:50:14'),
(4, 24, NULL, 'PROF-000004', 'Homme', NULL, 'Marocaine', NULL, '2025-12-06', 'Marketing', 'Intelligence atificielle (IA)', 'Vacataire', NULL, 0.00, 0, '[]', NULL, NULL, NULL, NULL, NULL, '2025-12-06 23:51:07', '2025-12-06 23:51:07'),
(5, 25, NULL, 'PROF-000005', 'Homme', NULL, 'Marocaine', NULL, '2025-12-06', NULL, 'Communication en Anglais', 'Vacataire', NULL, 0.00, 0, '[]', NULL, NULL, NULL, NULL, NULL, '2025-12-06 23:52:08', '2025-12-06 23:52:08'),
(6, 26, NULL, 'PROF-000006', NULL, NULL, NULL, NULL, '2025-12-06', NULL, 'Communication en Français', 'Vacataire', NULL, 0.00, 0, '[]', NULL, NULL, NULL, NULL, NULL, '2025-12-06 23:52:53', '2025-12-06 23:52:53');

-- --------------------------------------------------------

--
-- Structure de la table `professor_documents`
--

CREATE TABLE `professor_documents` (
  `id` bigint UNSIGNED NOT NULL,
  `professor_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` bigint NOT NULL,
  `category` enum('cours','tp','examen','correction','ressource') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cours',
  `shared_with_students` tinyint(1) NOT NULL DEFAULT '1',
  `downloads` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programs`
--

CREATE TABLE `programs` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duration_years` int NOT NULL DEFAULT '3',
  `levels` json DEFAULT NULL,
  `inscription_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `monthly_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `requirements` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `programs`
--

INSERT INTO `programs` (`id`, `name`, `code`, `description`, `duration_years`, `levels`, `inscription_fee`, `monthly_fee`, `requirements`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'DEES', 'DEES', NULL, 2, '[]', 0.00, 0.00, '[\"Baccalauréat\"]', 1, '2025-12-06 22:53:49', '2025-12-06 22:53:49'),
(2, 'Bachelor', 'LICENCE', NULL, 1, '[]', 0.00, 0.00, '[\"Baccalauréat\"]', 1, '2025-12-06 22:54:30', '2025-12-06 22:58:02'),
(3, 'Master', 'MASTER', NULL, 2, '[\"Master 1\", \"Master 2\"]', 0.00, 0.00, '[\"Baccalauréat\", \"Licence\"]', 1, '2025-12-06 22:55:23', '2025-12-06 22:58:38'),
(4, 'Formation Initiale', 'INITIALE', NULL, 1, '[]', 0.00, 0.00, '[]', 1, '2025-12-06 23:01:38', '2025-12-06 23:01:38');

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2025-12-06 22:36:01', '2025-12-06 22:36:01'),
(2, 'assistant', 'web', '2025-12-06 22:36:01', '2025-12-06 22:36:01'),
(3, 'professor', 'web', '2025-12-06 22:36:01', '2025-12-06 22:36:01'),
(4, 'student', 'web', '2025-12-06 22:36:01', '2025-12-06 22:36:01');

-- --------------------------------------------------------

--
-- Structure de la table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `schedules`
--

CREATE TABLE `schedules` (
  `id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `professor_id` bigint UNSIGNED DEFAULT NULL,
  `room` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `day` enum('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche') COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `type` enum('cours','td','tp','examen') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cours',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `settings`
--

CREATE TABLE `settings` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `students`
--

CREATE TABLE `students` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED DEFAULT NULL,
  `student_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `filiere_id` bigint UNSIGNED DEFAULT NULL,
  `program_id` bigint UNSIGNED DEFAULT NULL,
  `gender` enum('Homme','Femme') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `nationality` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notification_settings` json DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `enrolled_date` date DEFAULT NULL,
  `level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dossier_status` enum('Complet','Incomplet') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Incomplet',
  `documents` json DEFAULT NULL,
  `admin_comments` text COLLATE utf8mb4_unicode_ci,
  `inscription_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `monthly_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_status` enum('À jour','En retard','Suspendu') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'À jour',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `students`
--

INSERT INTO `students` (`id`, `user_id`, `group_id`, `student_code`, `phone`, `date_of_birth`, `filiere_id`, `program_id`, `gender`, `birth_date`, `nationality`, `address`, `bio`, `linkedin`, `github`, `notification_settings`, `preferences`, `enrolled_date`, `level`, `dossier_status`, `documents`, `admin_comments`, `inscription_amount`, `monthly_amount`, `payment_status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 4, 1, 'STU-00001', NULL, NULL, 1, 2, 'Femme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:24:45', '2025-12-06 23:24:45', NULL),
(2, 5, 1, 'STU-00002', NULL, NULL, 1, 2, 'Femme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:26:31', '2025-12-06 23:26:31', NULL),
(3, 7, 1, 'STU-00003', NULL, NULL, 1, 2, 'Femme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:29:23', '2025-12-06 23:29:23', NULL),
(4, 8, 1, 'STU-00004', NULL, NULL, 1, 2, 'Homme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:30:33', '2025-12-06 23:30:33', NULL),
(5, 9, 2, 'STU-00005', NULL, NULL, 2, 2, 'Homme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:31:46', '2025-12-06 23:31:46', NULL),
(6, 10, 2, 'STU-00006', NULL, NULL, 2, 2, 'Femme', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:32:54', '2025-12-06 23:32:54', NULL),
(7, 11, 2, 'STU-00007', NULL, NULL, 2, 2, 'Homme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:33:35', '2025-12-06 23:33:35', NULL),
(8, 12, 3, 'STU-00008', NULL, NULL, 3, 2, NULL, NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:34:38', '2025-12-06 23:34:38', NULL),
(9, 13, 4, 'STU-00009', NULL, NULL, 1, 2, 'Homme', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:37:04', '2025-12-06 23:37:04', NULL),
(10, 14, 4, 'STU-00010', NULL, NULL, 1, 2, 'Homme', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:37:51', '2025-12-06 23:37:51', NULL),
(11, 15, 4, 'STU-00011', NULL, NULL, 1, 2, 'Homme', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:38:38', '2025-12-06 23:38:38', NULL),
(12, 16, 4, 'STU-00012', NULL, NULL, 1, 2, 'Femme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '3ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:39:15', '2025-12-06 23:39:15', NULL),
(13, 17, NULL, 'STU-00013', NULL, NULL, 4, 3, 'Femme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', 'Master 1', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:40:28', '2025-12-06 23:45:28', NULL),
(14, 18, NULL, 'STU-00014', NULL, NULL, 5, 3, 'Femme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', 'Master 2', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:41:12', '2025-12-06 23:45:04', NULL),
(15, 19, NULL, 'STU-00015', NULL, NULL, 5, 3, 'Homme', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', 'Master 2', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:41:46', '2025-12-06 23:44:43', NULL),
(16, 20, NULL, 'STU-00016', NULL, NULL, 6, 4, 'Femme', NULL, 'Marocaine', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06', '2ème année', 'Incomplet', NULL, NULL, 0.00, 0.00, 'À jour', '2025-12-06 23:42:11', '2025-12-06 23:44:18', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `student_documents`
--

CREATE TABLE `student_documents` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('validé','en_attente','rejeté','manquant') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manquant',
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_locked` tinyint(1) NOT NULL DEFAULT '0',
  `locked_at` timestamp NULL DEFAULT NULL,
  `locked_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `failed_login_attempts` int NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `two_factor_code` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `two_factor_expires_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `email_verified_at`, `password`, `phone`, `avatar`, `is_active`, `is_locked`, `locked_at`, `locked_reason`, `failed_login_attempts`, `last_login_at`, `last_login_ip`, `two_factor_enabled`, `two_factor_code`, `two_factor_expires_at`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Othman', 'Be', 'bouysfi.othman@gmail.com', '2025-12-06 22:36:01', '$2y$12$s10wWvFP8fsGk5ISLHv.8em2IHaXLrir//wpvmp9CXvY/w3agHZ02', '+212637208455', 'avatars/5JmNsI7Vl9GXSyjt9XQsHohgnmOA5n329I69VrIy.png', 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 22:36:01', '2025-12-06 22:47:29', NULL),
(2, 'Tilila', 'ELKABOUSS', 'tilila@igp-maroc.com', '2025-12-06 22:36:01', '$2y$12$19UUkFB93gMCkU9I7XGML.zmGDt7ulrT2tjbW5xyaDTiklxjmFCe2', '+212600000001', NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 22:36:01', '2025-12-06 23:53:42', NULL),
(3, 'Leila', 'EL BARMAKI', 'elbarmaki@igp-maroc.com', '2025-12-06 22:36:02', '$2y$12$GtH1Rc4sZLAfHBrrqez6HutK0U1AuLs4pzEuUhZ/7NdNqOFvvj8am', '+212600000002', NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 22:36:02', '2025-12-06 23:53:29', NULL),
(4, 'Siham', 'NEKIB', 'siham.nekib@gmail.com', NULL, '$2y$12$UFpKcEwpXool1H.xDagR6uYZPgDZqJ5ODr8Xi8ojHlg946/DbeNg6', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:24:45', '2025-12-06 23:24:45', NULL),
(5, 'Asmaa', 'KHNIBROU', 'khnibrouasmaa@gmail.com', NULL, '$2y$12$TLlE8S96uBt9TaT8C0i8FuZHQ1em5GIMIA6XyE.tgRdSwcxHvLN5i', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:26:31', '2025-12-06 23:26:31', NULL),
(7, 'Walid', 'OBADI', 'obadiw25@gmail.com', NULL, '$2y$12$MSzTPFFtqDsBP/QkvDBmKOMnVYk4XgArZrnJIxqEpwru5HJX1I5Hi', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:29:23', '2025-12-06 23:29:23', NULL),
(8, 'Omar', 'HORMI', 'omar.hormi@gmail.com', NULL, '$2y$12$LBDw4UqeNdntFrXR722KJOXxPPTPIyRlFf5TYy/cTyAfXEQjaRzge', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:30:32', '2025-12-06 23:30:32', NULL),
(9, 'Khalid', 'TAOUSSI', 'ktaoussi19@gmail.com', NULL, '$2y$12$mexYUhHHSnF1Hz/K1x7w6.bXtUyXLaiGtG1HO/kLHRQIqqg1JU3ti', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:31:46', '2025-12-06 23:31:46', NULL),
(10, 'Siman', 'ABDI BOGOREH', 'simana.bogoreh03@gmail.com', NULL, '$2y$12$TuDGSeAOdMR5HqRwZFT7buvUur9sB/tJuRE1x/0VHR1PVmhDZMeEm', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:32:54', '2025-12-06 23:32:54', NULL),
(11, 'Bilal', 'TABIT', 'bilaltabit185@gmail.com', NULL, '$2y$12$c6uSxBp5YeR4U2pFNjMHr.OipAZ9ooBq45y5Mzx0G98w.2C1lwZvi', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:33:35', '2025-12-06 23:33:35', NULL),
(12, 'Chadia', 'MALLOUK', 'mandourismail01@gmail.com', NULL, '$2y$12$8J.qC9KFRZjUMNGc/0/wfeMZnHO7ZbTFBIYBxHGVtyiaHraBY4PgG', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:34:38', '2025-12-06 23:34:38', NULL),
(13, 'Mamadou', 'BARRY', 'mamadoukebebarry29@gmail.com', NULL, '$2y$12$lapF23fM.eEMnfYHta967OVSX8B3V4VLTyg7qp0s4iCf7Twngm/Fe', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:37:04', '2025-12-06 23:37:04', NULL),
(14, 'BARRY', 'Aissatou', 'aysshabarry99@gmail.com', NULL, '$2y$12$d4oRFIHGTSLtOl5O1p4.4uLsyCD93Wx0lejn2YD3C1dZrxFWzwddm', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:37:51', '2025-12-06 23:37:51', NULL),
(15, 'Kémo', 'SANOKO', 'kemosonko802@gmail.com', NULL, '$2y$12$mZeKo7CKF2ZDkSQtoCDJDuI1S0wgZwUoJ1Oxle5sMKVd4FLbGu5c2', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:38:38', '2025-12-06 23:38:38', NULL),
(16, 'Aya', 'KHNIBROU', 'ayakhnibrou@icloud.com', NULL, '$2y$12$U9xTh7GvDveU2b1flqeY7.3L8VVBKkeqinIRVWW..qYwiejmHXeNK', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:39:15', '2025-12-06 23:39:15', NULL),
(17, 'Najat', 'BENAZZOUZ', 'najatbenazzouz1@gmail.com', NULL, '$2y$12$yLMEpXK89Rp4suYlPAOE3uaa8JTTR7im5eNwSG.qD.7uF9kGQUvxa', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:40:28', '2025-12-06 23:40:28', NULL),
(18, 'Kenza', 'LAAROUSSI', 'kenzalaaroussi.23@gmail.com', NULL, '$2y$12$tA7ZXUPIei46PMntpLouiue.jMhprY99VhbjWU4Jlkv0NRUphwv9m', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:41:12', '2025-12-06 23:41:12', NULL),
(19, 'Marius', 'BANGLEGA', 'mariusbanglega404@gmail.com', NULL, '$2y$12$If.mPl5GKu3oJzJ5QQCwuujMDT8GOCyqFllLy8tdScjW4mnBSt1xi', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:41:46', '2025-12-06 23:41:46', NULL),
(20, 'Karima', 'BOUKHRISS', 'karimabouakhris@gmail.com', NULL, '$2y$12$NIVGenX4hy8FO70NjhHulOLoVTxWtW6pu1o7FZf.KmaBPNx.iT2Oe', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:42:11', '2025-12-06 23:42:11', NULL),
(21, 'Othman', 'Bouysfi', 'obouysfi.it@gmail.com', NULL, '$2y$12$8T54gpv29qht.nifb5eXw.twkOs3mmQ5vaszXIQuoPpt55YN5B4yq', '0637208455', NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:48:10', '2025-12-06 23:48:10', NULL),
(22, 'Mustapha', 'Mr EL OUAADOUDI', 'm.elouaadoudi@gmail.com', NULL, '$2y$12$odmM8DCXkd0iw2eggyuAy.kaPvyBojM3U3MMc3rrK6hSsoK.zaL9.', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:49:11', '2025-12-06 23:49:11', NULL),
(23, 'Fatima', 'AKSIKAS', 'aksikasfatima5@gmail.com', NULL, '$2y$12$p6ymIr1CAm7yyJHZksAfh.7/ATBUS06S7Yy17AUI1NqSdT4MnazrG', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:50:01', '2025-12-06 23:50:01', NULL),
(24, 'Mohamed Salim', 'THAMIR', 'contact.mohamedsalim.thamir@gmail.com', NULL, '$2y$12$FrztetbslYCTHnMD//yTzOzIK3ImBwglqigPY3X1UCkFj1O2CvlBe', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:51:07', '2025-12-06 23:51:07', NULL),
(25, 'Yassine', 'BASTOR', 'yassinebastor155@gmail.com', NULL, '$2y$12$Tqc5wRXCDqBo6xbVo52z0Oflc1JAbixZAt6tY1wm4TzPEIUZ1p7/u', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:52:08', '2025-12-06 23:52:08', NULL),
(26, 'Meryem', 'SALEM', 'meryemessagerie@hotmail.com', NULL, '$2y$12$3Wk4G23PMvNIt68FvhmWguOGrjTvtJpHSYU57Z7cOhkqFqp4QdnsO', NULL, NULL, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, '2025-12-06 23:52:53', '2025-12-06 23:52:53', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_devices`
--

CREATE TABLE `user_devices` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `device_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `platform` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_trusted` tinyint(1) NOT NULL DEFAULT '0',
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `years`
--

CREATE TABLE `years` (
  `id` bigint UNSIGNED NOT NULL,
  `program_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `absence_justifications`
--
ALTER TABLE `absence_justifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `absence_justifications_student_id_foreign` (`student_id`),
  ADD KEY `absence_justifications_attendance_id_foreign` (`attendance_id`),
  ADD KEY `absence_justifications_reviewed_by_foreign` (`reviewed_by`);

--
-- Index pour la table `assistants`
--
ALTER TABLE `assistants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `assistants_employee_id_unique` (`employee_id`),
  ADD KEY `assistants_user_id_foreign` (`user_id`);

--
-- Index pour la table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendances_student_id_foreign` (`student_id`),
  ADD KEY `attendances_schedule_id_foreign` (`schedule_id`),
  ADD KEY `attendances_professor_id_foreign` (`professor_id`);

--
-- Index pour la table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendance_logs_course_id_foreign` (`course_id`),
  ADD KEY `attendance_logs_group_id_foreign` (`group_id`),
  ADD KEY `attendance_logs_schedule_id_foreign` (`schedule_id`),
  ADD KEY `attendance_logs_validated_by_foreign` (`validated_by`),
  ADD KEY `attendance_logs_professor_id_date_index` (`professor_id`,`date`),
  ADD KEY `attendance_logs_validated_index` (`validated`);

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `courses_code_unique` (`code`),
  ADD KEY `courses_professor_id_foreign` (`professor_id`),
  ADD KEY `courses_group_id_foreign` (`group_id`),
  ADD KEY `courses_program_id_foreign` (`program_id`),
  ADD KEY `courses_filiere_id_foreign` (`filiere_id`);

--
-- Index pour la table `course_resources`
--
ALTER TABLE `course_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_resources_course_id_foreign` (`course_id`);

--
-- Index pour la table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exams_course_id_foreign` (`course_id`),
  ADD KEY `exams_group_id_foreign` (`group_id`),
  ADD KEY `exams_professor_id_foreign` (`professor_id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `filieres_code_unique` (`code`);

--
-- Index pour la table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `grades_exam_id_foreign` (`exam_id`),
  ADD KEY `grades_student_id_foreign` (`student_id`);

--
-- Index pour la table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `groups_code_unique` (`code`),
  ADD KEY `groups_program_id_foreign` (`program_id`),
  ADD KEY `groups_filiere_id_foreign` (`filiere_id`);

--
-- Index pour la table `group_course`
--
ALTER TABLE `group_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_course_group_id_foreign` (`group_id`),
  ADD KEY `group_course_course_id_foreign` (`course_id`);

--
-- Index pour la table `group_student`
--
ALTER TABLE `group_student`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_student_group_id_foreign` (`group_id`),
  ADD KEY `group_student_student_id_foreign` (`student_id`);

--
-- Index pour la table `jitsi_sessions`
--
ALTER TABLE `jitsi_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `jitsi_sessions_room_url_unique` (`room_url`),
  ADD KEY `jitsi_sessions_professor_id_foreign` (`professor_id`),
  ADD KEY `jitsi_sessions_course_id_foreign` (`course_id`),
  ADD KEY `jitsi_sessions_group_id_foreign` (`group_id`);

--
-- Index pour la table `jitsi_session_participants`
--
ALTER TABLE `jitsi_session_participants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jitsi_session_participants_session_id_foreign` (`session_id`),
  ADD KEY `jitsi_session_participants_student_id_foreign` (`student_id`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_attempts_email_attempted_at_index` (`email`,`attempted_at`);

--
-- Index pour la table `login_logs`
--
ALTER TABLE `login_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_logs_user_id_created_at_index` (`user_id`,`created_at`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Index pour la table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `payrolls`
--
ALTER TABLE `payrolls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payrolls_professor_id_month_year_unique` (`professor_id`,`month`,`year`);

--
-- Index pour la table `payroll_details`
--
ALTER TABLE `payroll_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payroll_details_payroll_id_foreign` (`payroll_id`),
  ADD KEY `payroll_details_course_id_foreign` (`course_id`);

--
-- Index pour la table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `professors`
--
ALTER TABLE `professors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `professors_professor_code_unique` (`professor_code`),
  ADD KEY `professors_user_id_foreign` (`user_id`);

--
-- Index pour la table `professor_documents`
--
ALTER TABLE `professor_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `professor_documents_professor_id_foreign` (`professor_id`),
  ADD KEY `professor_documents_course_id_foreign` (`course_id`);

--
-- Index pour la table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `programs_code_unique` (`code`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Index pour la table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Index pour la table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedules_course_id_foreign` (`course_id`),
  ADD KEY `schedules_group_id_foreign` (`group_id`),
  ADD KEY `schedules_professor_id_foreign` (`professor_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Index pour la table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `students_student_code_unique` (`student_code`),
  ADD KEY `students_user_id_foreign` (`user_id`),
  ADD KEY `students_filiere_id_foreign` (`filiere_id`),
  ADD KEY `students_program_id_foreign` (`program_id`),
  ADD KEY `students_group_id_foreign` (`group_id`);

--
-- Index pour la table `student_documents`
--
ALTER TABLE `student_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_documents_student_id_foreign` (`student_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Index pour la table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_devices_device_id_unique` (`device_id`),
  ADD KEY `user_devices_user_id_foreign` (`user_id`);

--
-- Index pour la table `years`
--
ALTER TABLE `years`
  ADD PRIMARY KEY (`id`),
  ADD KEY `years_program_id_foreign` (`program_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `absence_justifications`
--
ALTER TABLE `absence_justifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `assistants`
--
ALTER TABLE `assistants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `course_resources`
--
ALTER TABLE `course_resources`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `filieres`
--
ALTER TABLE `filieres`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `group_course`
--
ALTER TABLE `group_course`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `group_student`
--
ALTER TABLE `group_student`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `jitsi_sessions`
--
ALTER TABLE `jitsi_sessions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jitsi_session_participants`
--
ALTER TABLE `jitsi_session_participants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `login_logs`
--
ALTER TABLE `login_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `payrolls`
--
ALTER TABLE `payrolls`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `payroll_details`
--
ALTER TABLE `payroll_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `professors`
--
ALTER TABLE `professors`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `professor_documents`
--
ALTER TABLE `professor_documents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `programs`
--
ALTER TABLE `programs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `student_documents`
--
ALTER TABLE `student_documents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `years`
--
ALTER TABLE `years`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `absence_justifications`
--
ALTER TABLE `absence_justifications`
  ADD CONSTRAINT `absence_justifications_attendance_id_foreign` FOREIGN KEY (`attendance_id`) REFERENCES `attendances` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absence_justifications_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `absence_justifications_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `assistants`
--
ALTER TABLE `assistants`
  ADD CONSTRAINT `assistants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendances_schedule_id_foreign` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `attendances_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `attendance_logs_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_logs_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_logs_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_logs_schedule_id_foreign` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `attendance_logs_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `courses_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `courses_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `courses_program_id_foreign` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `course_resources`
--
ALTER TABLE `course_resources`
  ADD CONSTRAINT `course_resources_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exams_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exams_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `groups_program_id_foreign` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `group_course`
--
ALTER TABLE `group_course`
  ADD CONSTRAINT `group_course_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_course_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `group_student`
--
ALTER TABLE `group_student`
  ADD CONSTRAINT `group_student_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_student_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `jitsi_sessions`
--
ALTER TABLE `jitsi_sessions`
  ADD CONSTRAINT `jitsi_sessions_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jitsi_sessions_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jitsi_sessions_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `jitsi_session_participants`
--
ALTER TABLE `jitsi_session_participants`
  ADD CONSTRAINT `jitsi_session_participants_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `jitsi_sessions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jitsi_session_participants_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `login_logs`
--
ALTER TABLE `login_logs`
  ADD CONSTRAINT `login_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `payrolls`
--
ALTER TABLE `payrolls`
  ADD CONSTRAINT `payrolls_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `payroll_details`
--
ALTER TABLE `payroll_details`
  ADD CONSTRAINT `payroll_details_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payroll_details_payroll_id_foreign` FOREIGN KEY (`payroll_id`) REFERENCES `payrolls` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `professors`
--
ALTER TABLE `professors`
  ADD CONSTRAINT `professors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `professor_documents`
--
ALTER TABLE `professor_documents`
  ADD CONSTRAINT `professor_documents_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `professor_documents_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedules_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedules_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `students_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `students_program_id_foreign` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `students_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `student_documents`
--
ALTER TABLE `student_documents`
  ADD CONSTRAINT `student_documents_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `user_devices_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `years`
--
ALTER TABLE `years`
  ADD CONSTRAINT `years_program_id_foreign` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
