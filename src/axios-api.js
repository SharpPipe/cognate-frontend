import axios from 'axios'
import store from './store'
//import router from './routes'

const Api = axios.create({
    //baseURL: 'http://193.40.156.179:8081/',
    baseURL: 'http://localhost:8081/',
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

// https://www.bezkoder.com/vue-refresh-token/
Api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalConfig = error.config;
        if (originalConfig.url !== "/api/token/" && error.response) {
            console.log("err respnse: " + error.response.status)
            if (error.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const rs = await Api.post("/api/token/refresh/", {
                        refresh: store.state.refreshToken
                    });
                    const accessToken  = rs.data.access
                    store.dispatch("refreshToken", accessToken)
                    return Api(originalConfig)

                } catch (_error) {
                    return Promise.reject(_error)
                }

            }

        }
    }
)

export { Api }
