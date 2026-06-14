CREATE TABLE "files" (
	"id" uuid PRIMARY KEY NOT NULL,
	"folder_id" uuid NOT NULL,
	"name" text NOT NULL,
	"size_bytes" bigint,
	"mime_type" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "files_folder_id_idx" ON "files" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "files_folder_name_idx" ON "files" USING btree ("folder_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "files_folder_name_unique" ON "files" USING btree ("folder_id","name");--> statement-breakpoint
CREATE INDEX "folders_parent_id_idx" ON "folders" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "folders_parent_name_idx" ON "folders" USING btree ("parent_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "folders_parent_name_unique" ON "folders" USING btree ("parent_id","name");