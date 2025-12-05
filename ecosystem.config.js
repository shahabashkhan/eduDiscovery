module.exports = {
  apps: [
    {
      name: "edudiscovery",
      script: "./server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      },
    },
  ],
};
