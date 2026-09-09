import axios from 'axios';

const API_URL = 'http://localhost:3000/';


async function getAllTables() {

    const response = await axios.get(API_URL + 'tables');

    return response.data;
}


async function getAllTask() {

    const response = await axios.get(API_URL + 'tasks');

    return response.data;
}


export {
    getAllTables,
    getAllTask
};