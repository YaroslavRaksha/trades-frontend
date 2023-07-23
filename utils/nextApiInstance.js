import axios from 'axios';

const nextApiInstance = axios.create({
    baseURL:  process.env.NEXT_API || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default nextApiInstance;