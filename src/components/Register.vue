<template>
  <main class="form-signin">
    <div class="card">
      <div class="card-body">
        <form v-on:submit.prevent="registerUser">
          <h2 class="h3 mb-3 fw-normal text-center">Please sign up</h2>

          <div class="form-group">
            <label>First Name</label>
            <input type="text" class="form-control form-control-lg" placeholder="First name" v-model="payload.first_name"/>
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input type="text" class="form-control form-control-lg" placeholder="Last name" v-model="payload.last_name"/>
          </div>

          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control form-control-lg" placeholder="Username" v-model="payload.username"/>
          </div>

          <div class="form-group">
            <label>Email address</label>
            <input type="email" class="form-control form-control-lg" placeholder="Email address" v-model="payload.email"/>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control form-control-lg" placeholder="Password" v-model="payload.password"/>
          </div>

          <div class="form-group">
            <label>Confirm password</label>
            <input type="password" class="form-control form-control-lg" placeholder="Confirm Password" v-model="payload.password_confirm"/>
          </div>


          <div class="w-100 form-group">
            <button class="btn btn-primary" type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'register',
  data() {
    return {
      payload: {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirm: "",
      },
    }
  },
  methods: {
    registerUser() {
      this.$store.dispatch('registerUser', this.payload)
        .then(() => {
          $("#authClose").click()
          this.$router.push({ name: 'home' })
        })
    }
  }
}
</script>
