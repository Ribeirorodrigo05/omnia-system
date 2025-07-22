import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./server/database/schemas/*",
	dbCredentials: {
		url: process.env["DATABASE_URL"]!,
	},
	verbose: true,
	strict: true,
});
