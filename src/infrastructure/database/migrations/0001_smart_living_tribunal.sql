ALTER TABLE "cards" ADD COLUMN "publicId" varchar(10);--> statement-breakpoint

UPDATE "cards"
SET "publicId" = lpad(to_hex("id"), 10, '0')
WHERE "publicId" IS NULL;--> statement-breakpoint

ALTER TABLE "cards" ALTER COLUMN "publicId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_publicId_unique" UNIQUE("publicId");