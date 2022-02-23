import axios from 'axios'
import store from './store'
import router from './routes'

const Api = axios.create({
    baseURL: 'http://193.40.156.179:8081/',
    timeout: 5000,
    headers: {
        'Content-type': 'application/json'
    }
})

// Auto-refresh code from
// https://lewiskori.com/blog/how-to-auto-refresh-jwts-using-axios-interceptors/
Api.interceptors.request.use(
    (config) => {
        if (store.state.accessToken)
            config.headers.Authorization = `Bearer ${store.state.accessToken}`
        return config
    },
    error => Promise.reject(error)
)

Api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&  // Unauthorized
            originalRequest.url.includes("api/token/refresh/")
        ) {
            store.commit("destroyToken");
            router.push({ name: 'home' });
            return Promise.reject(error);
        } else if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await store.dispatch("refreshToken");
            return axios(originalRequest);
        }
        return Promise.reject(error);
    }
)

export { Api }
