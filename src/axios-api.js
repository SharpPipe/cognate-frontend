import axios from 'axios'

const getAPI = axios.create({
    baseURL: 'http://35.228.100.147:8000/',
    timeout: 1000,
})

export { getAPI }