CREATE TYPE "public"."bet_side" AS ENUM('HOME', 'AWAY');--> statement-breakpoint
CREATE TYPE "public"."league_status" AS ENUM('PLANNING', 'READY', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."league_type" AS ENUM('LEAGUE', 'CUP', 'OTHER');--> statement-breakpoint
CREATE TABLE "group" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "group_fund_transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_match_bet_id" integer NOT NULL,
	"group_league_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"stake_per_match" integer NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_fund_transaction_user_match_bet_id_unique" UNIQUE("user_match_bet_id")
);
--> statement-breakpoint
CREATE TABLE "group_league" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_league_config_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_league_id" integer NOT NULL,
	"stake_per_match" integer NOT NULL,
	"is_current" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_member" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "league" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"year" integer NOT NULL,
	"type" "league_type",
	"status" "league_status",
	"odd_key" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"started_at" timestamp,
	"end_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "league_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "match" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"home_team_id" integer NOT NULL,
	"away_team_id" integer NOT NULL,
	"status" "league_status",
	"odd_event_id" varchar(100),
	"type" "league_type",
	"handicap_value" double precision NOT NULL,
	"home_score" integer DEFAULT 0 NOT NULL,
	"away_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "match_odd_event_id_unique" UNIQUE("odd_event_id")
);
--> statement-breakpoint
CREATE TABLE "match_detail" (
	"match_id" integer PRIMARY KEY NOT NULL,
	"stadium" text,
	"referee" text,
	"home_scorers" jsonb,
	"away_scorers" jsonb,
	"yellow_cards" jsonb,
	"red_cards" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "match_update_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"handicap_value" numeric(4, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"abbreviation" varchar(50) NOT NULL,
	"nation" varchar(255) NOT NULL,
	"avatar_url" varchar(255),
	"avatar_id" varchar(255),
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_name_unique" UNIQUE("name"),
	CONSTRAINT "team_abbreviation_unique" UNIQUE("abbreviation")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"mongo_user_id" varchar(50) NOT NULL,
	"username" varchar(100),
	"email" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_mongo_user_id_unique" UNIQUE("mongo_user_id")
);
--> statement-breakpoint
CREATE TABLE "user_match_bet" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"match_id" integer NOT NULL,
	"group_league_id" integer NOT NULL,
	"selected_side" "bet_side" NOT NULL,
	"handicap_value" numeric(4, 2) NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_created_user_id_user_id_fk" FOREIGN KEY ("created_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_fund_transaction" ADD CONSTRAINT "group_fund_transaction_user_match_bet_id_user_match_bet_id_fk" FOREIGN KEY ("user_match_bet_id") REFERENCES "public"."user_match_bet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_fund_transaction" ADD CONSTRAINT "group_fund_transaction_group_league_id_group_league_id_fk" FOREIGN KEY ("group_league_id") REFERENCES "public"."group_league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_fund_transaction" ADD CONSTRAINT "group_fund_transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_fund_transaction" ADD CONSTRAINT "group_fund_transaction_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_league" ADD CONSTRAINT "group_league_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_league" ADD CONSTRAINT "group_league_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_league_config_history" ADD CONSTRAINT "group_league_config_history_group_league_id_group_league_id_fk" FOREIGN KEY ("group_league_id") REFERENCES "public"."group_league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_home_team_id_team_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_away_team_id_team_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_update_history" ADD CONSTRAINT "match_update_history_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_update_history" ADD CONSTRAINT "match_update_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_match_bet" ADD CONSTRAINT "user_match_bet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_match_bet" ADD CONSTRAINT "user_match_bet_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_match_bet" ADD CONSTRAINT "user_match_bet_group_league_id_group_league_id_fk" FOREIGN KEY ("group_league_id") REFERENCES "public"."group_league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_gft_user_group" ON "group_fund_transaction" USING btree ("user_id","group_league_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_groupleague_current" ON "group_league_config_history" USING btree ("group_league_id") WHERE "group_league_config_history"."is_current" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_league_name_year_oddkey" ON "league" USING btree ("name","year","odd_key");--> statement-breakpoint
CREATE INDEX "idx_umb_user_id" ON "user_match_bet" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_umb_match_id" ON "user_match_bet" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "idx_umb_user_group" ON "user_match_bet" USING btree ("user_id","group_league_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_umb_user_match_group" ON "user_match_bet" USING btree ("user_id","match_id","group_league_id");