import axios from 'axios';

const backendApiInstance = axios.create({
    baseURL: 'https://trades-backend-postgres.vercel.app',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default backendApiInstance;