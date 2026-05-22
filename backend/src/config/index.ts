import dotenv from "dotenv";
dotenv.config();

function required(key: string, fallback?: string): string {
  const v = process.env[key] ?? fallback;
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiUrl: process.env.API_URL || "http://localhost:4000",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  databaseUrl: required("DATABASE_URL", "postgresql://localhost:5432/propvault"),
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
    index: process.env.ELASTICSEARCH_INDEX || "properties",
  },
  jwt: {
    secret: required("JWT_SECRET", "dev-secret-change-in-production-min-32-chars"),
    refreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret-change-in-production"),
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
    from: process.env.EMAIL_FROM || "noreply@propvault.com",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
  },
  googleMaps: process.env.GOOGLE_MAPS_API_KEY || "",
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },
};
