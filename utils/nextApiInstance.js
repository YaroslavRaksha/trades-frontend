import axios from 'axios';

const nextApiInstance = axios.create({
    baseURL: 'https://my-exchanger-zp.vercel.app',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default nextApiInstance;
