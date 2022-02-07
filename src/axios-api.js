import axios from 'axios'
import store from './store'

const Api = axios.create({
    baseURL: 'http://193.40.156.179:8081/',
    timeout: 1000,
    headers: {
        'Authorization': `Bearer ${store.state.accessToken}`,
        'Content-type':  'application/json'
    }
})

export { Api }
