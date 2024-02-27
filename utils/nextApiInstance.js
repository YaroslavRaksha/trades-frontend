import axios from 'axios';

const nextApiInstance = axios.create({
    baseURL: 'https://trades-frontend.vercel.app/',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default nextApiInstance;
