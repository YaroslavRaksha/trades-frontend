import axios from 'axios';

const nextApiInstance = axios.create({
    baseURL: 'https://exchanger-trades-zp.vercel.app',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default nextApiInstance;
