require("dotenv").config();

const constants = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 7750,
    BASE_URL: process.env.BASE_URL || `http://localhost:7750`,
    PATH_SVG: process.env.PATH_SVG || `http://localhost:7750/`,
    
};
module.exports = constants;
