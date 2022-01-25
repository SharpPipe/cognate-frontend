import Vue from 'vue'
import Vuex from 'vuex'
import { Api } from './axios-api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accessToken: localStorage.getItem('access_token') || null, // makes sure the user is logged in even after refreshing the page
        refreshToken: localStorage.getItem('refresh_token') || null,
        APIData: '',
    },
    mutations: {
        updateLocalStorage (state, { access, refresh }) {
            localStorage.setItem('access_token',  access)
            localStorage.setItem('refresh_token', access)
            state.accessToken  = access
            state.refreshToken = refresh
        },
        updateAccess (state, access) {
            state.accessToken = access
        },
        destroyToken (state) {
            state.accessToken  = null
            state.refreshToken = null
        }
    },
    getters: {
        loggedIn (state) {
            return state.accessToken != null
        },
    },
    actions: {
        loginUser (context, credentials){
            return new Promise((resolve, reject) => {
                Api.post('/api/token/', {
                    username: credentials.username,
                    password: credentials.password
                })
                    .then(response => {
                        context.commit('updateLocalStorage', { access: response.data.access, refresh: response.data.refresh })
                        resolve()
                    })
                    .catch(error => {
                        console.log(credentials)

                        reject(error)
                    })
            })
        },
        logoutUser (context) {
            if (context.getters.loggedIn) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                context.commit('destroyToken')
            }
        },
        registerUser (context, data) {
            return new Promise((resolve, reject) => {
                Api.post('/api/register', {
                    first_name: data.first_name,
                    last_name : data.last_name,
                    username  : data.username,
                    email     : data.email,
                    password  : data.password,
                    password_confirm: data.password_confirm,
                })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        refreshToken (context) {
            return new Promise( (resolve, reject) => {
                Api.post('/api/token/refresh', {
                    refresh: context.state.refreshToken
                })
                    .then(response => {
                        console.log('New access successfully generated')
                        context.commit('updateAccess', response.data.access)
                        resolve(response.data.access)
                    })
                    .catch(error => {
                        console.log('Error in refreshToken Task')
                        reject(error)
                    })
            })
        }
    }
})