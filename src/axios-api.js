import axios from 'axios'

const Api = axios.create({
    baseURL: 'http://193.40.156.179:8081/',
    timeout: 1000,
})

export { Api }
