import axios from 'axios';

const nextApiInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
});

export default nextApiInstance;