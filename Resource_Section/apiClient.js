const axios =require("axios");
require('dotenv').config();
const apiClient = axios.create({
   baseURL:'https://eu-central-1.hapio.net/v1/',
   headers: {
    'Authorization' : `Bearer ${process.env.API_KEY}`}
});

module.exports={apiClient};