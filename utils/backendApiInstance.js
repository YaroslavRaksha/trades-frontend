import axios from 'axios';

const backendApiInstance = axios.create({
    baseURL: process.env.BACKEND_API || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default backendApiInstance;