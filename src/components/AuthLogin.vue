<template>
  <main class="form-signin">
    <div class="card">
      <div class="card-body">

        <div class="alert alert-danger" role="alert" v-if="wrongCredentials">Wrong credentials!</div>

        <form v-on:submit.prevent="loginUser">
          <h2 class="h3 mb-3 fw-normal text-center">Please sign in</h2>

          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control form-control-lg" placeholder="Username" v-model="payload.username"/>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control form-control-lg" placeholder="Password" v-model="payload.password"/>
          </div>

          <div class="w-100 form-group">
            <button class="btn btn-primary" type="submit" id="btnLogin">Login</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import $ from 'jquery'
import { Api } from "../axios-api";


export default {
  name: 'Login',
  data() {
    return {
      payload: {
        username: "",
        password: "",
      },
      wrongCredentials: false,  // activates message if true
    }
  },
  methods: {
    loginUser() {
      this.$store.dispatch('loginUser', this.payload)
      .then(() => {
        this.checkStorePassword()
        this.wrongCredentials = false
      })
      .catch(error => {
        console.log(error)
        this.wrongCredentials = true
      })

    }, 
    checkStorePassword() {
      Api.get("/profile/")
        .then(response => {
          if (response.data.data.store_password)
            this.$store.commit('updatePassword', this.payload.password)
          else 
            this.$store.commit('updatePassword', null)

          $("#authClose").click()
          this.$router.push({ name: 'groups' })
        })
        .catch(error => console.log(error))
    }
  },
}
</script>
