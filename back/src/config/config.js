export const config = {
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || "your_access_secret_key",
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key",
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d"
  },
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  },
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};