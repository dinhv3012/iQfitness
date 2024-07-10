import axios from 'axios';
import config from '../config.json';


const baseUrl = "https://api.api-ninjas.com/v1/exercises";



export const getExercises = (name, type, muscle, difficulty) => axios.get(`${baseUrl}?name=${name}&type=${type}&muscle=${muscle}&difficulty=${difficulty}`, { headers: { 'X-Api-Key': config.apiKey } })