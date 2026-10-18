import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_gender" AS ENUM('nam', 'nu', 'unisex');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_gender" AS ENUM('nam', 'nu', 'unisex');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lookbooks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lookbooks_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('cod', 'vnpay', 'momo');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('unpaid', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_customers_gender" AS ENUM('Nữ', 'Nam', 'Khác');
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('new', 'confirmed', 'cancelled');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('Bộ sưu tập', 'Xưởng', 'Chăm sóc', 'Sự kiện');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('Bộ sưu tập', 'Xưởng', 'Chăm sóc', 'Sự kiện');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_promotions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__promotions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_policies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__policies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "products_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"hex" varchar
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"size" varchar,
  	"stock" numeric DEFAULT 0,
  	"sku" varchar
  );
  
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"subtitle" varchar,
  	"line_id" integer,
  	"gender" "enum_products_gender" DEFAULT 'unisex',
  	"price" numeric,
  	"is_new" boolean DEFAULT false,
  	"description" varchar,
  	"details" varchar,
  	"sizing" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_products_v_version_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"hex" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"size" varchar,
  	"stock" numeric DEFAULT 0,
  	"sku" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_subtitle" varchar,
  	"version_line_id" integer,
  	"version_gender" "enum__products_v_version_gender" DEFAULT 'unisex',
  	"version_price" numeric,
  	"version_is_new" boolean DEFAULT false,
  	"version_description" varchar,
  	"version_details" varchar,
  	"version_sizing" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "lines_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "lines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"overline" varchar,
  	"intro" varchar,
  	"tagline" varchar,
  	"tint" varchar DEFAULT 'rgba(0,0,0,0)',
  	"order" numeric DEFAULT 0,
  	"hero_media_id" integer,
  	"hero_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lookbooks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"line_id" integer,
  	"desc" varchar,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lookbooks_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "lookbooks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "_lookbooks_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_line_id" integer,
  	"version_desc" varchar,
  	"version_image_media_id" integer,
  	"version_image_url" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lookbooks_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_lookbooks_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"image" varchar,
  	"color" varchar NOT NULL,
  	"size" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"qty" numeric NOT NULL
  );
  
  CREATE TABLE "orders_transactions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" varchar,
  	"ref" varchar,
  	"amount" numeric,
  	"result" varchar,
  	"at" timestamp(3) with time zone,
  	"raw" jsonb
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"customer_id" integer,
  	"email" varchar NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"shipping_name" varchar NOT NULL,
  	"shipping_phone" varchar NOT NULL,
  	"shipping_line" varchar NOT NULL,
  	"shipping_ward" varchar NOT NULL,
  	"shipping_province" varchar NOT NULL,
  	"shipping_note" varchar,
  	"subtotal" numeric NOT NULL,
  	"shipping_fee" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"payment_method" "enum_orders_payment_method" NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'unpaid',
  	"restocked" boolean DEFAULT false,
  	"points_awarded" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customers_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"is_default" boolean,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"line" varchar NOT NULL,
  	"province" varchar NOT NULL,
  	"ward" varchar NOT NULL
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar,
  	"gender" "enum_customers_gender",
  	"birthday" timestamp(3) with time zone,
  	"shoe_size" varchar,
  	"marketing_opt_in" boolean DEFAULT true,
  	"points" numeric DEFAULT 0,
  	"email_verified" boolean DEFAULT false,
  	"cart" jsonb,
  	"otp_hash" varchar,
  	"otp_expires" timestamp(3) with time zone,
  	"otp_attempts" numeric,
  	"otp_purpose" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "loyalty_transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"points" numeric NOT NULL,
  	"order_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"read_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"session" varchar NOT NULL,
  	"store" varchar,
  	"status" "enum_bookings_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category" "enum_articles_category",
  	"published_at" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"cover_media_id" integer,
  	"cover_url" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__articles_v_version_category",
  	"version_published_at" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_cover_media_id" integer,
  	"version_cover_url" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"desc" varchar,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"href" varchar DEFAULT '/danh-muc/tat-ca',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_promotions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_promotions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_desc" varchar,
  	"version_image_media_id" integer,
  	"version_image_url" varchar,
  	"version_href" varchar DEFAULT '/danh-muc/tat-ca',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__promotions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"version" varchar,
  	"effective_date" timestamp(3) with time zone,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_policies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_policies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_version" varchar,
  	"version_effective_date" timestamp(3) with time zone,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__policies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "stores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"region" varchar NOT NULL,
  	"footer_region" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"address" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"hours" varchar NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"lines_id" integer,
  	"lookbooks_id" integer,
  	"orders_id" integer,
  	"customers_id" integer,
  	"loyalty_transactions_id" integer,
  	"notifications_id" integer,
  	"bookings_id" integer,
  	"articles_id" integer,
  	"promotions_id" integer,
  	"policies_id" integer,
  	"stores_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"customers_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_main_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar NOT NULL,
  	"wordmark" varchar NOT NULL,
  	"tagline" varchar,
  	"hotline" varchar,
  	"email" varchar,
  	"copyright" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_media_id" integer,
  	"og_image_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_line_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line_id" integer NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_overline" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_cta_label" varchar,
  	"hero_cta_href" varchar,
  	"hero_image_media_id" integer,
  	"hero_image_url" varchar,
  	"store_banner_eyebrow" varchar,
  	"store_banner_text" varchar,
  	"store_banner_cta_label" varchar,
  	"store_banner_cta_href" varchar,
  	"store_banner_image_media_id" integer,
  	"store_banner_image_url" varchar,
  	"quote_eyebrow" varchar,
  	"quote_text" varchar,
  	"quote_cite" varchar,
  	"quote_image_media_id" integer,
  	"quote_image_url" varchar,
  	"closing_line_id" integer,
  	"closing_title" varchar,
  	"closing_cta_label" varchar,
  	"closing_image_media_id" integer,
  	"closing_image_url" varchar,
  	"journal_title" varchar,
  	"journal_desc" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"lookbooks_id" integer
  );
  
  CREATE TABLE "about_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_media_id" integer,
  	"image_url" varchar
  );
  
  CREATE TABLE "about_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"hero_image_media_id" integer,
  	"hero_image_url" varchar,
  	"quote" varchar,
  	"origin_title" varchar,
  	"origin_text" varchar,
  	"wide_image_media_id" integer,
  	"wide_image_url" varchar,
  	"wide_caption" varchar,
  	"milestones_title" varchar,
  	"heritage_eyebrow" varchar,
  	"heritage_title" varchar,
  	"heritage_image_media_id" integer,
  	"heritage_image_url" varchar,
  	"heritage_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "workshop_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"alt" varchar
  );
  
  CREATE TABLE "workshop_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"day" varchar NOT NULL,
  	"time" varchar NOT NULL,
  	"seats" numeric DEFAULT 8
  );
  
  CREATE TABLE "workshop" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_image_media_id" integer,
  	"hero_image_url" varchar,
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
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "products_colors" ADD CONSTRAINT "products_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."lines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_colors" ADD CONSTRAINT "_products_v_version_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants" ADD CONSTRAINT "_products_v_version_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_images" ADD CONSTRAINT "_products_v_version_images_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_images" ADD CONSTRAINT "_products_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_line_id_lines_id_fk" FOREIGN KEY ("version_line_id") REFERENCES "public"."lines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lines_slides" ADD CONSTRAINT "lines_slides_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lines_slides" ADD CONSTRAINT "lines_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lines" ADD CONSTRAINT "lines_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks" ADD CONSTRAINT "lookbooks_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."lines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks" ADD CONSTRAINT "lookbooks_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks" ADD CONSTRAINT "lookbooks_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_rels" ADD CONSTRAINT "lookbooks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_rels" ADD CONSTRAINT "lookbooks_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lookbooks_v" ADD CONSTRAINT "_lookbooks_v_parent_id_lookbooks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lookbooks_v" ADD CONSTRAINT "_lookbooks_v_version_line_id_lines_id_fk" FOREIGN KEY ("version_line_id") REFERENCES "public"."lines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lookbooks_v" ADD CONSTRAINT "_lookbooks_v_version_image_media_id_media_id_fk" FOREIGN KEY ("version_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lookbooks_v" ADD CONSTRAINT "_lookbooks_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lookbooks_v_rels" ADD CONSTRAINT "_lookbooks_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_lookbooks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lookbooks_v_rels" ADD CONSTRAINT "_lookbooks_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_transactions" ADD CONSTRAINT "orders_transactions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_addresses" ADD CONSTRAINT "customers_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_media_id_media_id_fk" FOREIGN KEY ("version_cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotions" ADD CONSTRAINT "promotions_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_promotions_v" ADD CONSTRAINT "_promotions_v_parent_id_promotions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."promotions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_promotions_v" ADD CONSTRAINT "_promotions_v_version_image_media_id_media_id_fk" FOREIGN KEY ("version_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_parent_id_policies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."policies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stores" ADD CONSTRAINT "stores_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lines_fk" FOREIGN KEY ("lines_id") REFERENCES "public"."lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lookbooks_fk" FOREIGN KEY ("lookbooks_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_transactions_fk" FOREIGN KEY ("loyalty_transactions_id") REFERENCES "public"."loyalty_transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stores_fk" FOREIGN KEY ("stores_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_main_nav" ADD CONSTRAINT "site_settings_main_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_info" ADD CONSTRAINT "site_settings_footer_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_media_id_media_id_fk" FOREIGN KEY ("og_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_line_sections" ADD CONSTRAINT "home_line_sections_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."lines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_line_sections" ADD CONSTRAINT "home_line_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_image_media_id_media_id_fk" FOREIGN KEY ("hero_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_store_banner_image_media_id_media_id_fk" FOREIGN KEY ("store_banner_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_quote_image_media_id_media_id_fk" FOREIGN KEY ("quote_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_closing_line_id_lines_id_fk" FOREIGN KEY ("closing_line_id") REFERENCES "public"."lines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_closing_image_media_id_media_id_fk" FOREIGN KEY ("closing_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_lookbooks_fk" FOREIGN KEY ("lookbooks_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_milestones" ADD CONSTRAINT "about_milestones_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_milestones" ADD CONSTRAINT "about_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_facts" ADD CONSTRAINT "about_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_hero_image_media_id_media_id_fk" FOREIGN KEY ("hero_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_wide_image_media_id_media_id_fk" FOREIGN KEY ("wide_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_heritage_image_media_id_media_id_fk" FOREIGN KEY ("heritage_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workshop_gallery" ADD CONSTRAINT "workshop_gallery_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workshop_gallery" ADD CONSTRAINT "workshop_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshop_sessions" ADD CONSTRAINT "workshop_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshop" ADD CONSTRAINT "workshop_hero_image_media_id_media_id_fk" FOREIGN KEY ("hero_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workshop" ADD CONSTRAINT "workshop_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_colors_order_idx" ON "products_colors" USING btree ("_order");
  CREATE INDEX "products_colors_parent_id_idx" ON "products_colors" USING btree ("_parent_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_image_media_idx" ON "products_images" USING btree ("image_media_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_line_idx" ON "products" USING btree ("line_id");
  CREATE INDEX "products_meta_meta_image_idx" ON "products" USING btree ("meta_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "_products_v_version_colors_order_idx" ON "_products_v_version_colors" USING btree ("_order");
  CREATE INDEX "_products_v_version_colors_parent_id_idx" ON "_products_v_version_colors" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_variants_order_idx" ON "_products_v_version_variants" USING btree ("_order");
  CREATE INDEX "_products_v_version_variants_parent_id_idx" ON "_products_v_version_variants" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_images_order_idx" ON "_products_v_version_images" USING btree ("_order");
  CREATE INDEX "_products_v_version_images_parent_id_idx" ON "_products_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_images_image_image_media_idx" ON "_products_v_version_images" USING btree ("image_media_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_line_idx" ON "_products_v" USING btree ("version_line_id");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "lines_slides_order_idx" ON "lines_slides" USING btree ("_order");
  CREATE INDEX "lines_slides_parent_id_idx" ON "lines_slides" USING btree ("_parent_id");
  CREATE INDEX "lines_slides_image_image_media_idx" ON "lines_slides" USING btree ("image_media_id");
  CREATE UNIQUE INDEX "lines_key_idx" ON "lines" USING btree ("key");
  CREATE INDEX "lines_hero_hero_media_idx" ON "lines" USING btree ("hero_media_id");
  CREATE INDEX "lines_updated_at_idx" ON "lines" USING btree ("updated_at");
  CREATE INDEX "lines_created_at_idx" ON "lines" USING btree ("created_at");
  CREATE UNIQUE INDEX "lookbooks_slug_idx" ON "lookbooks" USING btree ("slug");
  CREATE INDEX "lookbooks_line_idx" ON "lookbooks" USING btree ("line_id");
  CREATE INDEX "lookbooks_image_image_media_idx" ON "lookbooks" USING btree ("image_media_id");
  CREATE INDEX "lookbooks_meta_meta_image_idx" ON "lookbooks" USING btree ("meta_image_id");
  CREATE INDEX "lookbooks_updated_at_idx" ON "lookbooks" USING btree ("updated_at");
  CREATE INDEX "lookbooks_created_at_idx" ON "lookbooks" USING btree ("created_at");
  CREATE INDEX "lookbooks__status_idx" ON "lookbooks" USING btree ("_status");
  CREATE INDEX "lookbooks_rels_order_idx" ON "lookbooks_rels" USING btree ("order");
  CREATE INDEX "lookbooks_rels_parent_idx" ON "lookbooks_rels" USING btree ("parent_id");
  CREATE INDEX "lookbooks_rels_path_idx" ON "lookbooks_rels" USING btree ("path");
  CREATE INDEX "lookbooks_rels_products_id_idx" ON "lookbooks_rels" USING btree ("products_id");
  CREATE INDEX "_lookbooks_v_parent_idx" ON "_lookbooks_v" USING btree ("parent_id");
  CREATE INDEX "_lookbooks_v_version_version_slug_idx" ON "_lookbooks_v" USING btree ("version_slug");
  CREATE INDEX "_lookbooks_v_version_version_line_idx" ON "_lookbooks_v" USING btree ("version_line_id");
  CREATE INDEX "_lookbooks_v_version_image_version_image_media_idx" ON "_lookbooks_v" USING btree ("version_image_media_id");
  CREATE INDEX "_lookbooks_v_version_meta_version_meta_image_idx" ON "_lookbooks_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_lookbooks_v_version_version_updated_at_idx" ON "_lookbooks_v" USING btree ("version_updated_at");
  CREATE INDEX "_lookbooks_v_version_version_created_at_idx" ON "_lookbooks_v" USING btree ("version_created_at");
  CREATE INDEX "_lookbooks_v_version_version__status_idx" ON "_lookbooks_v" USING btree ("version__status");
  CREATE INDEX "_lookbooks_v_created_at_idx" ON "_lookbooks_v" USING btree ("created_at");
  CREATE INDEX "_lookbooks_v_updated_at_idx" ON "_lookbooks_v" USING btree ("updated_at");
  CREATE INDEX "_lookbooks_v_latest_idx" ON "_lookbooks_v" USING btree ("latest");
  CREATE INDEX "_lookbooks_v_rels_order_idx" ON "_lookbooks_v_rels" USING btree ("order");
  CREATE INDEX "_lookbooks_v_rels_parent_idx" ON "_lookbooks_v_rels" USING btree ("parent_id");
  CREATE INDEX "_lookbooks_v_rels_path_idx" ON "_lookbooks_v_rels" USING btree ("path");
  CREATE INDEX "_lookbooks_v_rels_products_id_idx" ON "_lookbooks_v_rels" USING btree ("products_id");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX "orders_transactions_order_idx" ON "orders_transactions" USING btree ("_order");
  CREATE INDEX "orders_transactions_parent_id_idx" ON "orders_transactions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_code_idx" ON "orders" USING btree ("code");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_shipping_shipping_phone_idx" ON "orders" USING btree ("shipping_phone");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "customers_addresses_order_idx" ON "customers_addresses" USING btree ("_order");
  CREATE INDEX "customers_addresses_parent_id_idx" ON "customers_addresses" USING btree ("_parent_id");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "loyalty_transactions_customer_idx" ON "loyalty_transactions" USING btree ("customer_id");
  CREATE INDEX "loyalty_transactions_order_idx" ON "loyalty_transactions" USING btree ("order_id");
  CREATE INDEX "loyalty_transactions_updated_at_idx" ON "loyalty_transactions" USING btree ("updated_at");
  CREATE INDEX "loyalty_transactions_created_at_idx" ON "loyalty_transactions" USING btree ("created_at");
  CREATE INDEX "notifications_customer_idx" ON "notifications" USING btree ("customer_id");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_cover_cover_media_idx" ON "articles" USING btree ("cover_media_id");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles" USING btree ("meta_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_cover_version_cover_media_idx" ON "_articles_v" USING btree ("version_cover_media_id");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE UNIQUE INDEX "promotions_slug_idx" ON "promotions" USING btree ("slug");
  CREATE INDEX "promotions_image_image_media_idx" ON "promotions" USING btree ("image_media_id");
  CREATE INDEX "promotions_updated_at_idx" ON "promotions" USING btree ("updated_at");
  CREATE INDEX "promotions_created_at_idx" ON "promotions" USING btree ("created_at");
  CREATE INDEX "promotions__status_idx" ON "promotions" USING btree ("_status");
  CREATE INDEX "_promotions_v_parent_idx" ON "_promotions_v" USING btree ("parent_id");
  CREATE INDEX "_promotions_v_version_version_slug_idx" ON "_promotions_v" USING btree ("version_slug");
  CREATE INDEX "_promotions_v_version_image_version_image_media_idx" ON "_promotions_v" USING btree ("version_image_media_id");
  CREATE INDEX "_promotions_v_version_version_updated_at_idx" ON "_promotions_v" USING btree ("version_updated_at");
  CREATE INDEX "_promotions_v_version_version_created_at_idx" ON "_promotions_v" USING btree ("version_created_at");
  CREATE INDEX "_promotions_v_version_version__status_idx" ON "_promotions_v" USING btree ("version__status");
  CREATE INDEX "_promotions_v_created_at_idx" ON "_promotions_v" USING btree ("created_at");
  CREATE INDEX "_promotions_v_updated_at_idx" ON "_promotions_v" USING btree ("updated_at");
  CREATE INDEX "_promotions_v_latest_idx" ON "_promotions_v" USING btree ("latest");
  CREATE UNIQUE INDEX "policies_slug_idx" ON "policies" USING btree ("slug");
  CREATE INDEX "policies_updated_at_idx" ON "policies" USING btree ("updated_at");
  CREATE INDEX "policies_created_at_idx" ON "policies" USING btree ("created_at");
  CREATE INDEX "policies__status_idx" ON "policies" USING btree ("_status");
  CREATE INDEX "_policies_v_parent_idx" ON "_policies_v" USING btree ("parent_id");
  CREATE INDEX "_policies_v_version_version_slug_idx" ON "_policies_v" USING btree ("version_slug");
  CREATE INDEX "_policies_v_version_version_updated_at_idx" ON "_policies_v" USING btree ("version_updated_at");
  CREATE INDEX "_policies_v_version_version_created_at_idx" ON "_policies_v" USING btree ("version_created_at");
  CREATE INDEX "_policies_v_version_version__status_idx" ON "_policies_v" USING btree ("version__status");
  CREATE INDEX "_policies_v_created_at_idx" ON "_policies_v" USING btree ("created_at");
  CREATE INDEX "_policies_v_updated_at_idx" ON "_policies_v" USING btree ("updated_at");
  CREATE INDEX "_policies_v_latest_idx" ON "_policies_v" USING btree ("latest");
  CREATE INDEX "stores_image_image_media_idx" ON "stores" USING btree ("image_media_id");
  CREATE INDEX "stores_updated_at_idx" ON "stores" USING btree ("updated_at");
  CREATE INDEX "stores_created_at_idx" ON "stores" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_lines_id_idx" ON "payload_locked_documents_rels" USING btree ("lines_id");
  CREATE INDEX "payload_locked_documents_rels_lookbooks_id_idx" ON "payload_locked_documents_rels" USING btree ("lookbooks_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_loyalty_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_transactions_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_promotions_id_idx" ON "payload_locked_documents_rels" USING btree ("promotions_id");
  CREATE INDEX "payload_locked_documents_rels_policies_id_idx" ON "payload_locked_documents_rels" USING btree ("policies_id");
  CREATE INDEX "payload_locked_documents_rels_stores_id_idx" ON "payload_locked_documents_rels" USING btree ("stores_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_main_nav_order_idx" ON "site_settings_main_nav" USING btree ("_order");
  CREATE INDEX "site_settings_main_nav_parent_id_idx" ON "site_settings_main_nav" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_info_order_idx" ON "site_settings_footer_info" USING btree ("_order");
  CREATE INDEX "site_settings_footer_info_parent_id_idx" ON "site_settings_footer_info" USING btree ("_parent_id");
  CREATE INDEX "site_settings_og_image_og_image_media_idx" ON "site_settings" USING btree ("og_image_media_id");
  CREATE INDEX "home_line_sections_order_idx" ON "home_line_sections" USING btree ("_order");
  CREATE INDEX "home_line_sections_parent_id_idx" ON "home_line_sections" USING btree ("_parent_id");
  CREATE INDEX "home_line_sections_line_idx" ON "home_line_sections" USING btree ("line_id");
  CREATE INDEX "home_hero_image_hero_image_media_idx" ON "home" USING btree ("hero_image_media_id");
  CREATE INDEX "home_store_banner_image_store_banner_image_media_idx" ON "home" USING btree ("store_banner_image_media_id");
  CREATE INDEX "home_quote_image_quote_image_media_idx" ON "home" USING btree ("quote_image_media_id");
  CREATE INDEX "home_closing_closing_line_idx" ON "home" USING btree ("closing_line_id");
  CREATE INDEX "home_closing_image_closing_image_media_idx" ON "home" USING btree ("closing_image_media_id");
  CREATE INDEX "home_meta_meta_image_idx" ON "home" USING btree ("meta_image_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_lookbooks_id_idx" ON "home_rels" USING btree ("lookbooks_id");
  CREATE INDEX "about_milestones_order_idx" ON "about_milestones" USING btree ("_order");
  CREATE INDEX "about_milestones_parent_id_idx" ON "about_milestones" USING btree ("_parent_id");
  CREATE INDEX "about_milestones_image_image_media_idx" ON "about_milestones" USING btree ("image_media_id");
  CREATE INDEX "about_facts_order_idx" ON "about_facts" USING btree ("_order");
  CREATE INDEX "about_facts_parent_id_idx" ON "about_facts" USING btree ("_parent_id");
  CREATE INDEX "about_hero_image_hero_image_media_idx" ON "about" USING btree ("hero_image_media_id");
  CREATE INDEX "about_wide_image_wide_image_media_idx" ON "about" USING btree ("wide_image_media_id");
  CREATE INDEX "about_heritage_image_heritage_image_media_idx" ON "about" USING btree ("heritage_image_media_id");
  CREATE INDEX "about_meta_meta_image_idx" ON "about" USING btree ("meta_image_id");
  CREATE INDEX "workshop_gallery_order_idx" ON "workshop_gallery" USING btree ("_order");
  CREATE INDEX "workshop_gallery_parent_id_idx" ON "workshop_gallery" USING btree ("_parent_id");
  CREATE INDEX "workshop_gallery_image_image_media_idx" ON "workshop_gallery" USING btree ("image_media_id");
  CREATE INDEX "workshop_sessions_order_idx" ON "workshop_sessions" USING btree ("_order");
  CREATE INDEX "workshop_sessions_parent_id_idx" ON "workshop_sessions" USING btree ("_parent_id");
  CREATE INDEX "workshop_hero_image_hero_image_media_idx" ON "workshop" USING btree ("hero_image_media_id");
  CREATE INDEX "workshop_meta_meta_image_idx" ON "workshop" USING btree ("meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_colors" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_images" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "_products_v_version_colors" CASCADE;
  DROP TABLE "_products_v_version_variants" CASCADE;
  DROP TABLE "_products_v_version_images" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "lines_slides" CASCADE;
  DROP TABLE "lines" CASCADE;
  DROP TABLE "lookbooks" CASCADE;
  DROP TABLE "lookbooks_rels" CASCADE;
  DROP TABLE "_lookbooks_v" CASCADE;
  DROP TABLE "_lookbooks_v_rels" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders_transactions" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "customers_addresses" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "loyalty_transactions" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "promotions" CASCADE;
  DROP TABLE "_promotions_v" CASCADE;
  DROP TABLE "policies" CASCADE;
  DROP TABLE "_policies_v" CASCADE;
  DROP TABLE "stores" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings_main_nav" CASCADE;
  DROP TABLE "site_settings_footer_info" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_line_sections" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "about_milestones" CASCADE;
  DROP TABLE "about_facts" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "workshop_gallery" CASCADE;
  DROP TABLE "workshop_sessions" CASCADE;
  DROP TABLE "workshop" CASCADE;
  DROP TYPE "public"."enum_products_gender";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_gender";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum_lookbooks_status";
  DROP TYPE "public"."enum__lookbooks_v_version_status";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_customers_gender";
  DROP TYPE "public"."enum_bookings_status";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_promotions_status";
  DROP TYPE "public"."enum__promotions_v_version_status";
  DROP TYPE "public"."enum_policies_status";
  DROP TYPE "public"."enum__policies_v_version_status";
  DROP TYPE "public"."enum_users_role";`)
}
