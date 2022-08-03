//pm2 start ecosystem.config.js --env production
module.exports = {
    apps: [
        {
            name: "docx_converter",
            script: "server.js",
            autorestart: true,
            max_memory_restart: "4G",
            // cron_restart: "0 5 * * *",
            env: {
                COMMON_VARIABLE: "true",
                NODE_ENV: "local",
                PORT: 7750,
                BASE_URL: "http://localhost:7750",
            },
            env_development: {
                COMMON_VARIABLE: "true",
                NODE_ENV: "local",
                PORT: 7750,
                BASE_URL: "http://localhost:7750",
            },
            env_production: {
                COMMON_VARIABLE: "true",
                NODE_ENV: "local",
                PORT: 7750,
                BASE_URL: "http://localhost:7750",
            },
        },
    ],
};
