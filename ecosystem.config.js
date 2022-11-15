//pm2 start ecosystem.config.js --env production
module.exports = {
    apps: [
        {
            name: "emf2svg",
            script: 'npm',
            args: 'start',
            time: true,
            exec_mode: 'fork', // need explicitly declare mode otherwise it will fallback to cluster mode and cause infinite reload
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "4G",
            // cron_restart: "0 5 * * *",
            // env: {
            //     NODE_ENV: "local",
            // },
            // env_development: {
            //     NODE_ENV: "local",
            // },
            // env_production: {
            //     NODE_ENV: "local",
            // },
        },
    ],
};
