/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DB_LOCAL_URI: "mongodb://localhost:27017/bookit",
    DB_URI:
      "mongodb+srv://kristarus:kris123123@cluster0.gvltt.mongodb.net/bookit?retryWrites=true&w=majority",
    NEXTAUTH_URL: "https://bookit-kristarus.vercel.app",
    CLOUD_NAME: "draft-kristarus-cloud",
    CLOUD_API_KEY: "959332914594497",
    CLOUD_API_SECRET: "oCPb7kRlem6LJpsTKHLOin-MX7U",
    SMTP_HOST: "smtp.mail.ru",
    SMTP_PORT: 587,
    SMTP_FROM_NAME: "BookIt",
    SMTP_FROM_EMAIL: "test_the_salon@mail.ru",
    SMTP_EMAIL_USER: "test_the_salon@mail.ru",
    SMTP_EMAIL_PASS: "a4Qi8XTCLwLdFjmWvvB6",
    PAYPAL_CLIENT_ID:
      "AVxskFyJ61JncyAVEWxCigpBfDaqKH_oCkih6ROvA3kgzkLzDmCsyH3P5CZG73KxNc2MfT5pFCBVn5s6",
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
