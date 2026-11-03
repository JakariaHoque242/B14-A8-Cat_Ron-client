import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://booknookUser:BookNook2026Pass@cluster0.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db("booknookDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET || "booknook_auth_super_secret_session_key_2026",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
