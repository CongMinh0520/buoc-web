import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum__lookbooks_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_orders_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum__promotions_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum__policies_v_published_locale" AS ENUM('vi', 'en');
  CREATE TABLE "products_colors_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"details" varchar,
  	"sizing" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_colors_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_name" varchar,
  	"version_subtitle" varchar,
  	"version_description" varchar,
  	"version_details" varchar,
  	"version_sizing" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "lines_slides_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "lines_locales" (
  	"label" varchar NOT NULL,
  	"overline" varchar,
  	"intro" varchar,
  	"tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "lookbooks_locales" (
  	"title" varchar,
  	"desc" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_lookbooks_v_locales" (
  	"version_title" varchar,
  	"version_desc" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "promotions_locales" (
  	"title" varchar,
  	"desc" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_promotions_v_locales" (
  	"version_title" varchar,
  	"version_desc" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "policies_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_policies_v_locales" (
  	"version_title" varchar,
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stores_locales" (
  	"region" varchar NOT NULL,
  	"footer_region" varchar NOT NULL,
  	"hours" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_main_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_info_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar,
  	"copyright" varchar,
  	"product_story_eyebrow" varchar,
  	"product_story_title" varchar,
  	"product_story_text" varchar,
  	"product_story_cta_label" varchar,
  	"price_note" varchar DEFAULT 'Giá đã bao gồm VAT.',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_locales" (
  	"hero_overline" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_cta_label" varchar,
  	"store_banner_eyebrow" varchar,
  	"store_banner_text" varchar,
  	"store_banner_cta_label" varchar,
  	"quote_eyebrow" varchar,
  	"quote_text" varchar,
  	"quote_cite" varchar,
  	"closing_title" varchar,
  	"closing_cta_label" varchar,
  	"journal_title" varchar,
  	"journal_desc" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_milestones_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_facts_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"quote" varchar,
  	"origin_title" varchar,
  	"origin_text" varchar,
  	"wide_caption" varchar,
  	"milestones_title" varchar,
  	"heritage_eyebrow" varchar,
  	"heritage_title" varchar,
  	"heritage_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "workshop_gallery_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "workshop_sessions_locales" (
  	"title" varchar NOT NULL,
  	"day" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "workshop_locales" (
  	"hero_title" varchar NOT NULL,
  	"intro" varchar,
  	"quote_a" varchar,
  	"quote_b" varchar,
  	"bench_title" varchar,
  	"bench_text" varchar,
  	"booking_title" varchar,
  	"booking_desc" varchar,
  	"booking_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products" DROP CONSTRAINT "products_meta_image_id_media_id_fk";
  
  ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "lookbooks" DROP CONSTRAINT "lookbooks_meta_image_id_media_id_fk";
  
  ALTER TABLE "_lookbooks_v" DROP CONSTRAINT "_lookbooks_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "articles" DROP CONSTRAINT "articles_meta_image_id_media_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "home" DROP CONSTRAINT "home_meta_image_id_media_id_fk";
  
  ALTER TABLE "about" DROP CONSTRAINT "about_meta_image_id_media_id_fk";
  
  ALTER TABLE "workshop" DROP CONSTRAINT "workshop_meta_image_id_media_id_fk";
  
  DROP INDEX "products_meta_meta_image_idx";
  DROP INDEX "_products_v_version_meta_version_meta_image_idx";
  DROP INDEX "lookbooks_meta_meta_image_idx";
  DROP INDEX "_lookbooks_v_version_meta_version_meta_image_idx";
  DROP INDEX "articles_meta_meta_image_idx";
  DROP INDEX "_articles_v_version_meta_version_meta_image_idx";
  DROP INDEX "home_meta_meta_image_idx";
  DROP INDEX "about_meta_meta_image_idx";
  DROP INDEX "workshop_meta_meta_image_idx";
  ALTER TABLE "_products_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_products_v" ADD COLUMN "published_locale" "enum__products_v_published_locale";
  ALTER TABLE "_lookbooks_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_lookbooks_v" ADD COLUMN "published_locale" "enum__lookbooks_v_published_locale";
  ALTER TABLE "orders" ADD COLUMN "locale" "enum_orders_locale" DEFAULT 'vi';
  ALTER TABLE "_articles_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_articles_v" ADD COLUMN "published_locale" "enum__articles_v_published_locale";
  ALTER TABLE "_promotions_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_promotions_v" ADD COLUMN "published_locale" "enum__promotions_v_published_locale";
  ALTER TABLE "_policies_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_policies_v" ADD COLUMN "published_locale" "enum__policies_v_published_locale";
  ALTER TABLE "products_colors_locales" ADD CONSTRAINT "products_colors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_colors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_colors_locales" ADD CONSTRAINT "_products_v_version_colors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_colors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lines_slides_locales" ADD CONSTRAINT "lines_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lines_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lines_locales" ADD CONSTRAINT "lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_locales" ADD CONSTRAINT "lookbooks_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_locales" ADD CONSTRAINT "lookbooks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lookbooks_v_locales" ADD CONSTRAINT "_lookbooks_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lookbooks_v_locales" ADD CONSTRAINT "_lookbooks_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lookbooks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promotions_locales" ADD CONSTRAINT "promotions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_promotions_v_locales" ADD CONSTRAINT "_promotions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_promotions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "policies_locales" ADD CONSTRAINT "policies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_policies_v_locales" ADD CONSTRAINT "_policies_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_policies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores_locales" ADD CONSTRAINT "stores_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_main_nav_locales" ADD CONSTRAINT "site_settings_main_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_main_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_info_locales" ADD CONSTRAINT "site_settings_footer_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_milestones_locales" ADD CONSTRAINT "about_milestones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_facts_locales" ADD CONSTRAINT "about_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshop_gallery_locales" ADD CONSTRAINT "workshop_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshop_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshop_sessions_locales" ADD CONSTRAINT "workshop_sessions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshop_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshop_locales" ADD CONSTRAINT "workshop_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workshop_locales" ADD CONSTRAINT "workshop_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshop"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "products_colors_locales_locale_parent_id_unique" ON "products_colors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_colors_locales_locale_parent_id_unique" ON "_products_v_version_colors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "lines_slides_locales_locale_parent_id_unique" ON "lines_slides_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "lines_locales_locale_parent_id_unique" ON "lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lookbooks_meta_meta_image_idx" ON "lookbooks_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "lookbooks_locales_locale_parent_id_unique" ON "lookbooks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_lookbooks_v_version_meta_version_meta_image_idx" ON "_lookbooks_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_lookbooks_v_locales_locale_parent_id_unique" ON "_lookbooks_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "promotions_locales_locale_parent_id_unique" ON "promotions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_promotions_v_locales_locale_parent_id_unique" ON "_promotions_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "policies_locales_locale_parent_id_unique" ON "policies_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_policies_v_locales_locale_parent_id_unique" ON "_policies_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "stores_locales_locale_parent_id_unique" ON "stores_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_main_nav_locales_locale_parent_id_unique" ON "site_settings_main_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_footer_info_locales_locale_parent_id_unique" ON "site_settings_footer_info_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_meta_meta_image_idx" ON "home_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_milestones_locales_locale_parent_id_unique" ON "about_milestones_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_facts_locales_locale_parent_id_unique" ON "about_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_meta_meta_image_idx" ON "about_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "workshop_gallery_locales_locale_parent_id_unique" ON "workshop_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "workshop_sessions_locales_locale_parent_id_unique" ON "workshop_sessions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "workshop_meta_meta_image_idx" ON "workshop_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "workshop_locales_locale_parent_id_unique" ON "workshop_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_lookbooks_v_snapshot_idx" ON "_lookbooks_v" USING btree ("snapshot");
  CREATE INDEX "_lookbooks_v_published_locale_idx" ON "_lookbooks_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_promotions_v_snapshot_idx" ON "_promotions_v" USING btree ("snapshot");
  CREATE INDEX "_promotions_v_published_locale_idx" ON "_promotions_v" USING btree ("published_locale");
  CREATE INDEX "_policies_v_snapshot_idx" ON "_policies_v" USING btree ("snapshot");
  CREATE INDEX "_policies_v_published_locale_idx" ON "_policies_v" USING btree ("published_locale");
  -- Chép nội dung hiện có (tiếng Việt) sang bảng _locales trước khi xóa cột cũ — không mất dữ liệu production
  INSERT INTO "products_locales" ("name", "subtitle", "description", "details", "sizing", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id") SELECT "name", "subtitle", "description", "details", "sizing", "meta_title", "meta_description", "meta_image_id", 'vi', "id" FROM "products";
  INSERT INTO "_products_v_locales" ("version_name", "version_subtitle", "version_description", "version_details", "version_sizing", "version_meta_title", "version_meta_description", "version_meta_image_id", "_locale", "_parent_id") SELECT "version_name", "version_subtitle", "version_description", "version_details", "version_sizing", "version_meta_title", "version_meta_description", "version_meta_image_id", 'vi', "id" FROM "_products_v";
  INSERT INTO "lines_slides_locales" ("caption", "_locale", "_parent_id") SELECT "caption", 'vi', "id" FROM "lines_slides";
  INSERT INTO "lines_locales" ("label", "overline", "intro", "tagline", "_locale", "_parent_id") SELECT "label", "overline", "intro", "tagline", 'vi', "id" FROM "lines";
  INSERT INTO "lookbooks_locales" ("title", "desc", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id") SELECT "title", "desc", "meta_title", "meta_description", "meta_image_id", 'vi', "id" FROM "lookbooks";
  INSERT INTO "_lookbooks_v_locales" ("version_title", "version_desc", "version_meta_title", "version_meta_description", "version_meta_image_id", "_locale", "_parent_id") SELECT "version_title", "version_desc", "version_meta_title", "version_meta_description", "version_meta_image_id", 'vi', "id" FROM "_lookbooks_v";
  INSERT INTO "articles_locales" ("title", "excerpt", "content", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id") SELECT "title", "excerpt", "content", "meta_title", "meta_description", "meta_image_id", 'vi', "id" FROM "articles";
  INSERT INTO "_articles_v_locales" ("version_title", "version_excerpt", "version_content", "version_meta_title", "version_meta_description", "version_meta_image_id", "_locale", "_parent_id") SELECT "version_title", "version_excerpt", "version_content", "version_meta_title", "version_meta_description", "version_meta_image_id", 'vi', "id" FROM "_articles_v";
  INSERT INTO "promotions_locales" ("title", "desc", "_locale", "_parent_id") SELECT "title", "desc", 'vi', "id" FROM "promotions";
  INSERT INTO "_promotions_v_locales" ("version_title", "version_desc", "_locale", "_parent_id") SELECT "version_title", "version_desc", 'vi', "id" FROM "_promotions_v";
  INSERT INTO "policies_locales" ("title", "content", "_locale", "_parent_id") SELECT "title", "content", 'vi', "id" FROM "policies";
  INSERT INTO "_policies_v_locales" ("version_title", "version_content", "_locale", "_parent_id") SELECT "version_title", "version_content", 'vi', "id" FROM "_policies_v";
  INSERT INTO "stores_locales" ("region", "footer_region", "hours", "_locale", "_parent_id") SELECT "region", "footer_region", "hours", 'vi', "id" FROM "stores";
  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id") SELECT "alt", 'vi', "id" FROM "media";
  INSERT INTO "site_settings_main_nav_locales" ("label", "_locale", "_parent_id") SELECT "label", 'vi', "id" FROM "site_settings_main_nav";
  INSERT INTO "site_settings_footer_info_locales" ("label", "_locale", "_parent_id") SELECT "label", 'vi', "id" FROM "site_settings_footer_info";
  INSERT INTO "site_settings_locales" ("tagline", "copyright", "product_story_eyebrow", "product_story_title", "product_story_text", "product_story_cta_label", "price_note", "seo_title", "seo_description", "_locale", "_parent_id") SELECT "tagline", "copyright", "product_story_eyebrow", "product_story_title", "product_story_text", "product_story_cta_label", "price_note", "seo_title", "seo_description", 'vi', "id" FROM "site_settings";
  INSERT INTO "home_locales" ("hero_overline", "hero_title", "hero_cta_label", "store_banner_eyebrow", "store_banner_text", "store_banner_cta_label", "quote_eyebrow", "quote_text", "quote_cite", "closing_title", "closing_cta_label", "journal_title", "journal_desc", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id") SELECT "hero_overline", "hero_title", "hero_cta_label", "store_banner_eyebrow", "store_banner_text", "store_banner_cta_label", "quote_eyebrow", "quote_text", "quote_cite", "closing_title", "closing_cta_label", "journal_title", "journal_desc", "meta_title", "meta_description", "meta_image_id", 'vi', "id" FROM "home";
  INSERT INTO "about_milestones_locales" ("title", "text", "_locale", "_parent_id") SELECT "title", "text", 'vi', "id" FROM "about_milestones";
  INSERT INTO "about_facts_locales" ("label", "value", "_locale", "_parent_id") SELECT "label", "value", 'vi', "id" FROM "about_facts";
  INSERT INTO "about_locales" ("title", "subtitle", "quote", "origin_title", "origin_text", "wide_caption", "milestones_title", "heritage_eyebrow", "heritage_title", "heritage_text", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id") SELECT "title", "subtitle", "quote", "origin_title", "origin_text", "wide_caption", "milestones_title", "heritage_eyebrow", "heritage_title", "heritage_text", "meta_title", "meta_description", "meta_image_id", 'vi', "id" FROM "about";
  INSERT INTO "workshop_gallery_locales" ("alt", "_locale", "_parent_id") SELECT "alt", 'vi', "id" FROM "workshop_gallery";
  INSERT INTO "workshop_sessions_locales" ("title", "day", "_locale", "_parent_id") SELECT "title", "day", 'vi', "id" FROM "workshop_sessions";
  INSERT INTO "workshop_locales" ("hero_title", "intro", "quote_a", "quote_b", "bench_title", "bench_text", "booking_title", "booking_desc", "booking_note", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id") SELECT "hero_title", "intro", "quote_a", "quote_b", "bench_title", "bench_text", "booking_title", "booking_desc", "booking_note", "meta_title", "meta_description", "meta_image_id", 'vi', "id" FROM "workshop";
  ALTER TABLE "products" DROP COLUMN "name";
  ALTER TABLE "products" DROP COLUMN "subtitle";
  ALTER TABLE "products" DROP COLUMN "description";
  ALTER TABLE "products" DROP COLUMN "details";
  ALTER TABLE "products" DROP COLUMN "sizing";
  ALTER TABLE "products" DROP COLUMN "meta_title";
  ALTER TABLE "products" DROP COLUMN "meta_description";
  ALTER TABLE "products" DROP COLUMN "meta_image_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_name";
  ALTER TABLE "_products_v" DROP COLUMN "version_subtitle";
  ALTER TABLE "_products_v" DROP COLUMN "version_description";
  ALTER TABLE "_products_v" DROP COLUMN "version_details";
  ALTER TABLE "_products_v" DROP COLUMN "version_sizing";
  ALTER TABLE "_products_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_products_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_products_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "lines_slides" DROP COLUMN "caption";
  ALTER TABLE "lines" DROP COLUMN "label";
  ALTER TABLE "lines" DROP COLUMN "overline";
  ALTER TABLE "lines" DROP COLUMN "intro";
  ALTER TABLE "lines" DROP COLUMN "tagline";
  ALTER TABLE "lookbooks" DROP COLUMN "title";
  ALTER TABLE "lookbooks" DROP COLUMN "desc";
  ALTER TABLE "lookbooks" DROP COLUMN "meta_title";
  ALTER TABLE "lookbooks" DROP COLUMN "meta_description";
  ALTER TABLE "lookbooks" DROP COLUMN "meta_image_id";
  ALTER TABLE "_lookbooks_v" DROP COLUMN "version_title";
  ALTER TABLE "_lookbooks_v" DROP COLUMN "version_desc";
  ALTER TABLE "_lookbooks_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_lookbooks_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_lookbooks_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "articles" DROP COLUMN "title";
  ALTER TABLE "articles" DROP COLUMN "excerpt";
  ALTER TABLE "articles" DROP COLUMN "content";
  ALTER TABLE "articles" DROP COLUMN "meta_title";
  ALTER TABLE "articles" DROP COLUMN "meta_description";
  ALTER TABLE "articles" DROP COLUMN "meta_image_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_title";
  ALTER TABLE "_articles_v" DROP COLUMN "version_excerpt";
  ALTER TABLE "_articles_v" DROP COLUMN "version_content";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "promotions" DROP COLUMN "title";
  ALTER TABLE "promotions" DROP COLUMN "desc";
  ALTER TABLE "_promotions_v" DROP COLUMN "version_title";
  ALTER TABLE "_promotions_v" DROP COLUMN "version_desc";
  ALTER TABLE "policies" DROP COLUMN "title";
  ALTER TABLE "policies" DROP COLUMN "content";
  ALTER TABLE "_policies_v" DROP COLUMN "version_title";
  ALTER TABLE "_policies_v" DROP COLUMN "version_content";
  ALTER TABLE "stores" DROP COLUMN "region";
  ALTER TABLE "stores" DROP COLUMN "footer_region";
  ALTER TABLE "stores" DROP COLUMN "hours";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "site_settings_main_nav" DROP COLUMN "label";
  ALTER TABLE "site_settings_footer_info" DROP COLUMN "label";
  ALTER TABLE "site_settings" DROP COLUMN "tagline";
  ALTER TABLE "site_settings" DROP COLUMN "copyright";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_title";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_text";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_cta_label";
  ALTER TABLE "site_settings" DROP COLUMN "price_note";
  ALTER TABLE "site_settings" DROP COLUMN "seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "seo_description";
  ALTER TABLE "home" DROP COLUMN "hero_overline";
  ALTER TABLE "home" DROP COLUMN "hero_title";
  ALTER TABLE "home" DROP COLUMN "hero_cta_label";
  ALTER TABLE "home" DROP COLUMN "store_banner_eyebrow";
  ALTER TABLE "home" DROP COLUMN "store_banner_text";
  ALTER TABLE "home" DROP COLUMN "store_banner_cta_label";
  ALTER TABLE "home" DROP COLUMN "quote_eyebrow";
  ALTER TABLE "home" DROP COLUMN "quote_text";
  ALTER TABLE "home" DROP COLUMN "quote_cite";
  ALTER TABLE "home" DROP COLUMN "closing_title";
  ALTER TABLE "home" DROP COLUMN "closing_cta_label";
  ALTER TABLE "home" DROP COLUMN "journal_title";
  ALTER TABLE "home" DROP COLUMN "journal_desc";
  ALTER TABLE "home" DROP COLUMN "meta_title";
  ALTER TABLE "home" DROP COLUMN "meta_description";
  ALTER TABLE "home" DROP COLUMN "meta_image_id";
  ALTER TABLE "about_milestones" DROP COLUMN "title";
  ALTER TABLE "about_milestones" DROP COLUMN "text";
  ALTER TABLE "about_facts" DROP COLUMN "label";
  ALTER TABLE "about_facts" DROP COLUMN "value";
  ALTER TABLE "about" DROP COLUMN "title";
  ALTER TABLE "about" DROP COLUMN "subtitle";
  ALTER TABLE "about" DROP COLUMN "quote";
  ALTER TABLE "about" DROP COLUMN "origin_title";
  ALTER TABLE "about" DROP COLUMN "origin_text";
  ALTER TABLE "about" DROP COLUMN "wide_caption";
  ALTER TABLE "about" DROP COLUMN "milestones_title";
  ALTER TABLE "about" DROP COLUMN "heritage_eyebrow";
  ALTER TABLE "about" DROP COLUMN "heritage_title";
  ALTER TABLE "about" DROP COLUMN "heritage_text";
  ALTER TABLE "about" DROP COLUMN "meta_title";
  ALTER TABLE "about" DROP COLUMN "meta_description";
  ALTER TABLE "about" DROP COLUMN "meta_image_id";
  ALTER TABLE "workshop_gallery" DROP COLUMN "alt";
  ALTER TABLE "workshop_sessions" DROP COLUMN "title";
  ALTER TABLE "workshop_sessions" DROP COLUMN "day";
  ALTER TABLE "workshop" DROP COLUMN "hero_title";
  ALTER TABLE "workshop" DROP COLUMN "intro";
  ALTER TABLE "workshop" DROP COLUMN "quote_a";
  ALTER TABLE "workshop" DROP COLUMN "quote_b";
  ALTER TABLE "workshop" DROP COLUMN "bench_title";
  ALTER TABLE "workshop" DROP COLUMN "bench_text";
  ALTER TABLE "workshop" DROP COLUMN "booking_title";
  ALTER TABLE "workshop" DROP COLUMN "booking_desc";
  ALTER TABLE "workshop" DROP COLUMN "booking_note";
  ALTER TABLE "workshop" DROP COLUMN "meta_title";
  ALTER TABLE "workshop" DROP COLUMN "meta_description";
  ALTER TABLE "workshop" DROP COLUMN "meta_image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_colors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_colors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lines_slides_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lines_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_lookbooks_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "promotions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_promotions_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "policies_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_policies_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stores_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_main_nav_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_info_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_milestones_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_facts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workshop_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workshop_sessions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workshop_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_colors_locales" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "_products_v_version_colors_locales" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "lines_slides_locales" CASCADE;
  DROP TABLE "lines_locales" CASCADE;
  DROP TABLE "lookbooks_locales" CASCADE;
  DROP TABLE "_lookbooks_v_locales" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "promotions_locales" CASCADE;
  DROP TABLE "_promotions_v_locales" CASCADE;
  DROP TABLE "policies_locales" CASCADE;
  DROP TABLE "_policies_v_locales" CASCADE;
  DROP TABLE "stores_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "site_settings_main_nav_locales" CASCADE;
  DROP TABLE "site_settings_footer_info_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "about_milestones_locales" CASCADE;
  DROP TABLE "about_facts_locales" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  DROP TABLE "workshop_gallery_locales" CASCADE;
  DROP TABLE "workshop_sessions_locales" CASCADE;
  DROP TABLE "workshop_locales" CASCADE;
  DROP INDEX "_products_v_snapshot_idx";
  DROP INDEX "_products_v_published_locale_idx";
  DROP INDEX "_lookbooks_v_snapshot_idx";
  DROP INDEX "_lookbooks_v_published_locale_idx";
  DROP INDEX "_articles_v_snapshot_idx";
  DROP INDEX "_articles_v_published_locale_idx";
  DROP INDEX "_promotions_v_snapshot_idx";
  DROP INDEX "_promotions_v_published_locale_idx";
  DROP INDEX "_policies_v_snapshot_idx";
  DROP INDEX "_policies_v_published_locale_idx";
  ALTER TABLE "products" ADD COLUMN "name" varchar;
  ALTER TABLE "products" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "products" ADD COLUMN "description" varchar;
  ALTER TABLE "products" ADD COLUMN "details" varchar;
  ALTER TABLE "products" ADD COLUMN "sizing" varchar;
  ALTER TABLE "products" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "products" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "products" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_name" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_subtitle" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_details" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_sizing" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "lines_slides" ADD COLUMN "caption" varchar;
  ALTER TABLE "lines" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "lines" ADD COLUMN "overline" varchar;
  ALTER TABLE "lines" ADD COLUMN "intro" varchar;
  ALTER TABLE "lines" ADD COLUMN "tagline" varchar;
  ALTER TABLE "lookbooks" ADD COLUMN "title" varchar;
  ALTER TABLE "lookbooks" ADD COLUMN "desc" varchar;
  ALTER TABLE "lookbooks" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "lookbooks" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "lookbooks" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_lookbooks_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_lookbooks_v" ADD COLUMN "version_desc" varchar;
  ALTER TABLE "_lookbooks_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_lookbooks_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_lookbooks_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "articles" ADD COLUMN "title" varchar;
  ALTER TABLE "articles" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "articles" ADD COLUMN "content" jsonb;
  ALTER TABLE "articles" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_excerpt" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "promotions" ADD COLUMN "title" varchar;
  ALTER TABLE "promotions" ADD COLUMN "desc" varchar;
  ALTER TABLE "_promotions_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_promotions_v" ADD COLUMN "version_desc" varchar;
  ALTER TABLE "policies" ADD COLUMN "title" varchar;
  ALTER TABLE "policies" ADD COLUMN "content" jsonb;
  ALTER TABLE "_policies_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_policies_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "stores" ADD COLUMN "region" varchar NOT NULL;
  ALTER TABLE "stores" ADD COLUMN "footer_region" varchar NOT NULL;
  ALTER TABLE "stores" ADD COLUMN "hours" varchar NOT NULL;
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "site_settings_main_nav" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "site_settings_footer_info" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "tagline" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "copyright" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_story_eyebrow" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_story_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_story_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_story_cta_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "price_note" varchar DEFAULT 'Giá đã bao gồm VAT.';
  ALTER TABLE "site_settings" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "home" ADD COLUMN "hero_overline" varchar;
  ALTER TABLE "home" ADD COLUMN "hero_title" varchar NOT NULL;
  ALTER TABLE "home" ADD COLUMN "hero_cta_label" varchar;
  ALTER TABLE "home" ADD COLUMN "store_banner_eyebrow" varchar;
  ALTER TABLE "home" ADD COLUMN "store_banner_text" varchar;
  ALTER TABLE "home" ADD COLUMN "store_banner_cta_label" varchar;
  ALTER TABLE "home" ADD COLUMN "quote_eyebrow" varchar;
  ALTER TABLE "home" ADD COLUMN "quote_text" varchar;
  ALTER TABLE "home" ADD COLUMN "quote_cite" varchar;
  ALTER TABLE "home" ADD COLUMN "closing_title" varchar;
  ALTER TABLE "home" ADD COLUMN "closing_cta_label" varchar;
  ALTER TABLE "home" ADD COLUMN "journal_title" varchar;
  ALTER TABLE "home" ADD COLUMN "journal_desc" varchar;
  ALTER TABLE "home" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "home" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "home" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "about_milestones" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "about_milestones" ADD COLUMN "text" varchar;
  ALTER TABLE "about_facts" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "about_facts" ADD COLUMN "value" varchar NOT NULL;
  ALTER TABLE "about" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "about" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "about" ADD COLUMN "quote" varchar;
  ALTER TABLE "about" ADD COLUMN "origin_title" varchar;
  ALTER TABLE "about" ADD COLUMN "origin_text" varchar;
  ALTER TABLE "about" ADD COLUMN "wide_caption" varchar;
  ALTER TABLE "about" ADD COLUMN "milestones_title" varchar;
  ALTER TABLE "about" ADD COLUMN "heritage_eyebrow" varchar;
  ALTER TABLE "about" ADD COLUMN "heritage_title" varchar;
  ALTER TABLE "about" ADD COLUMN "heritage_text" varchar;
  ALTER TABLE "about" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "about" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "about" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "workshop_gallery" ADD COLUMN "alt" varchar;
  ALTER TABLE "workshop_sessions" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "workshop_sessions" ADD COLUMN "day" varchar NOT NULL;
  ALTER TABLE "workshop" ADD COLUMN "hero_title" varchar NOT NULL;
  ALTER TABLE "workshop" ADD COLUMN "intro" varchar;
  ALTER TABLE "workshop" ADD COLUMN "quote_a" varchar;
  ALTER TABLE "workshop" ADD COLUMN "quote_b" varchar;
  ALTER TABLE "workshop" ADD COLUMN "bench_title" varchar;
  ALTER TABLE "workshop" ADD COLUMN "bench_text" varchar;
  ALTER TABLE "workshop" ADD COLUMN "booking_title" varchar;
  ALTER TABLE "workshop" ADD COLUMN "booking_desc" varchar;
  ALTER TABLE "workshop" ADD COLUMN "booking_note" varchar;
  ALTER TABLE "workshop" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "workshop" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "workshop" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "products" ADD CONSTRAINT "products_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks" ADD CONSTRAINT "lookbooks_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lookbooks_v" ADD CONSTRAINT "_lookbooks_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workshop" ADD CONSTRAINT "workshop_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_meta_meta_image_idx" ON "products" USING btree ("meta_image_id");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v" USING btree ("version_meta_image_id");
  CREATE INDEX "lookbooks_meta_meta_image_idx" ON "lookbooks" USING btree ("meta_image_id");
  CREATE INDEX "_lookbooks_v_version_meta_version_meta_image_idx" ON "_lookbooks_v" USING btree ("version_meta_image_id");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles" USING btree ("meta_image_id");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v" USING btree ("version_meta_image_id");
  CREATE INDEX "home_meta_meta_image_idx" ON "home" USING btree ("meta_image_id");
  CREATE INDEX "about_meta_meta_image_idx" ON "about" USING btree ("meta_image_id");
  CREATE INDEX "workshop_meta_meta_image_idx" ON "workshop" USING btree ("meta_image_id");
  ALTER TABLE "_products_v" DROP COLUMN "snapshot";
  ALTER TABLE "_products_v" DROP COLUMN "published_locale";
  ALTER TABLE "_lookbooks_v" DROP COLUMN "snapshot";
  ALTER TABLE "_lookbooks_v" DROP COLUMN "published_locale";
  ALTER TABLE "orders" DROP COLUMN "locale";
  ALTER TABLE "_articles_v" DROP COLUMN "snapshot";
  ALTER TABLE "_articles_v" DROP COLUMN "published_locale";
  ALTER TABLE "_promotions_v" DROP COLUMN "snapshot";
  ALTER TABLE "_promotions_v" DROP COLUMN "published_locale";
  ALTER TABLE "_policies_v" DROP COLUMN "snapshot";
  ALTER TABLE "_policies_v" DROP COLUMN "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum__lookbooks_v_published_locale";
  DROP TYPE "public"."enum_orders_locale";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum__promotions_v_published_locale";
  DROP TYPE "public"."enum__policies_v_published_locale";`)
}
