import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // your backend URL
    // You can set default headers here if needed
});

export default axiosInstance;
