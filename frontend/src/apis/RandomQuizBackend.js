import axios from 'axios';

export default axios.create({
    baseURL: "https://restaurant-roulette-backend.vercel.app/api/quiz"
});