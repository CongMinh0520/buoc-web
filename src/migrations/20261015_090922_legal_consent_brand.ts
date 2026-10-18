import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "customers" ALTER COLUMN "marketing_opt_in" SET DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN "invoice_requested" boolean DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN "invoice_company_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "invoice_tax_code" varchar;
  ALTER TABLE "orders" ADD COLUMN "invoice_email" varchar;
  ALTER TABLE "orders" ADD COLUMN "invoice_address" varchar;
  ALTER TABLE "orders" ADD COLUMN "consent_terms_accepted_at" timestamp(3) with time zone;
  ALTER TABLE "orders" ADD COLUMN "consent_policy_versions" varchar;
  ALTER TABLE "customers" ADD COLUMN "consent_privacy_accepted_at" timestamp(3) with time zone;
  ALTER TABLE "customers" ADD COLUMN "consent_policy_versions" varchar;
  ALTER TABLE "customers" ADD COLUMN "consent_marketing_changed_at" timestamp(3) with time zone;
  ALTER TABLE "site_settings" ADD COLUMN "favicon_media_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "favicon_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "order_prefix" varchar DEFAULT 'DH';
  ALTER TABLE "site_settings" ADD COLUMN "product_story_eyebrow" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_story_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_story_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_story_cta_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_story_cta_href" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_address" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_representative" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_tax_code" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_registration_no" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_registration_issued" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_complaint_phone" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_complaint_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "price_note" varchar DEFAULT 'Giá đã bao gồm VAT.';
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_media_id_media_id_fk" FOREIGN KEY ("favicon_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_favicon_favicon_media_idx" ON "site_settings" USING btree ("favicon_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_favicon_media_id_media_id_fk";
  
  DROP INDEX "site_settings_favicon_favicon_media_idx";
  ALTER TABLE "customers" ALTER COLUMN "marketing_opt_in" SET DEFAULT true;
  ALTER TABLE "orders" DROP COLUMN "invoice_requested";
  ALTER TABLE "orders" DROP COLUMN "invoice_company_name";
  ALTER TABLE "orders" DROP COLUMN "invoice_tax_code";
  ALTER TABLE "orders" DROP COLUMN "invoice_email";
  ALTER TABLE "orders" DROP COLUMN "invoice_address";
  ALTER TABLE "orders" DROP COLUMN "consent_terms_accepted_at";
  ALTER TABLE "orders" DROP COLUMN "consent_policy_versions";
  ALTER TABLE "customers" DROP COLUMN "consent_privacy_accepted_at";
  ALTER TABLE "customers" DROP COLUMN "consent_policy_versions";
  ALTER TABLE "customers" DROP COLUMN "consent_marketing_changed_at";
  ALTER TABLE "site_settings" DROP COLUMN "favicon_media_id";
  ALTER TABLE "site_settings" DROP COLUMN "favicon_url";
  ALTER TABLE "site_settings" DROP COLUMN "order_prefix";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_title";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_text";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_cta_label";
  ALTER TABLE "site_settings" DROP COLUMN "product_story_cta_href";
  ALTER TABLE "site_settings" DROP COLUMN "company_name";
  ALTER TABLE "site_settings" DROP COLUMN "company_address";
  ALTER TABLE "site_settings" DROP COLUMN "company_representative";
  ALTER TABLE "site_settings" DROP COLUMN "company_tax_code";
  ALTER TABLE "site_settings" DROP COLUMN "company_registration_no";
  ALTER TABLE "site_settings" DROP COLUMN "company_registration_issued";
  ALTER TABLE "site_settings" DROP COLUMN "company_complaint_phone";
  ALTER TABLE "site_settings" DROP COLUMN "company_complaint_email";
  ALTER TABLE "site_settings" DROP COLUMN "price_note";`)
}
