import axios from 'axios'
import store from './store'
import router from './routes'

const Api = axios.create({
  baseURL: 'http://' + process.env.VUE_APP_API_URL + '/',
  //baseURL: 'http://localhost:8081/',
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
// https://blog.digital-craftsman.de/axios-interceptor-to-refresh-jwt-token-after-expiration/
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status !== 401) {
      return new Promise((resolve, reject) => {
        reject(error)
      })
    }

    if (error.config.url == '/api/token/refresh/' || error.response.message == 'Account is disabled.') {
      store.dispatch("logoutUser")
      router.push({ name: "home" })

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    const config = error.config;
    if (config.url !== "/api/token/" && error.response) {
      if (error.response.status === 401 && !config._retry) {
        config._retry = true;
        Api.post("/api/token/refresh/", {
          refresh: store.state.refreshToken
        }).then(rs => {
          store.dispatch("refreshToken", rs.data.access)
          return Api(config)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

    }
  }
)

export { Api }
