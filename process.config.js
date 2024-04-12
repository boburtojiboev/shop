module.exports = {
  apps: [
    {
      name: "ShoekerShop",
      cwd: "./",
      script: "./server.js",
      watch: true,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    instances: 1,
    exec_mode: "cluster",
    },
  ],
};
