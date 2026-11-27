CREATE TABLE IF NOT EXISTS `jobs` (
  `id` text PRIMARY KEY NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `years` text NOT NULL,
  `period` text NOT NULL,
  `title` text NOT NULL,
  `company` text NOT NULL,
  `company_tip_title` text NOT NULL,
  `company_tip_body` text NOT NULL,
  `summary` text NOT NULL,
  `highlights_json` text NOT NULL,
  `details_json` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `education` (
  `id` text PRIMARY KEY NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `school` text NOT NULL,
  `degree` text NOT NULL,
  `years` text NOT NULL,
  `tip_title` text NOT NULL,
  `tip_body` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `projects` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `brand` text NOT NULL,
  `year` text NOT NULL,
  `tag` text NOT NULL,
  `card_heading` text NOT NULL,
  `card_summary` text NOT NULL,
  `title` text NOT NULL,
  `subtitle` text NOT NULL,
  `accent` text NOT NULL,
  `accent_bg` text NOT NULL,
  `cover_key` text NOT NULL,
  `wide` integer DEFAULT false NOT NULL,
  `layout` text DEFAULT 'case-study' NOT NULL,
  `chips_json` text NOT NULL,
  `wins_json` text NOT NULL,
  `toc_json` text NOT NULL,
  `body_json` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `projects_slug_unique` ON `projects` (`slug`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `project_results` (
  `id` text PRIMARY KEY NOT NULL,
  `project_id` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `value` real NOT NULL,
  `prefix` text DEFAULT '' NOT NULL,
  `suffix` text DEFAULT '' NOT NULL,
  `decimals` integer DEFAULT 0 NOT NULL,
  `display_text` text NOT NULL,
  `label` text NOT NULL,
  `tip_title` text NOT NULL,
  `tip_body` text NOT NULL,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `skills` (
  `id` text PRIMARY KEY NOT NULL,
  `group` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `name` text NOT NULL,
  `subtitle` text DEFAULT '' NOT NULL,
  `tip_title` text NOT NULL,
  `tip_body` text NOT NULL,
  `icon` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `posts` (
  `id` text PRIMARY KEY NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `title` text NOT NULL,
  `category` text NOT NULL,
  `published_at` text NOT NULL,
  `url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `works` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `title` text NOT NULL,
  `kind` text NOT NULL,
  `description` text NOT NULL,
  `tone` text NOT NULL,
  `featured` integer DEFAULT false NOT NULL,
  `meta_json` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `works_slug_unique` ON `works` (`slug`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `work_images` (
  `id` text PRIMARY KEY NOT NULL,
  `work_id` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `chapter` text DEFAULT '' NOT NULL,
  `caption` text NOT NULL,
  `note` text DEFAULT '' NOT NULL,
  `media_key` text NOT NULL,
  `width` integer DEFAULT 1600 NOT NULL,
  `height` integer DEFAULT 900 NOT NULL,
  FOREIGN KEY (`work_id`) REFERENCES `works`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `media_objects` (
  `key` text PRIMARY KEY NOT NULL,
  `content_type` text NOT NULL,
  `size` integer NOT NULL,
  `etag` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `media_chunks` (
  `key` text NOT NULL,
  `chunk_index` integer NOT NULL,
  `data` blob NOT NULL,
  PRIMARY KEY(`key`, `chunk_index`),
  FOREIGN KEY (`key`) REFERENCES `media_objects`(`key`) ON UPDATE no action ON DELETE cascade
);
