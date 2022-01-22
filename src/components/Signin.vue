<template>
  <main class="form-signin">
    <div class="card">
      <div class="card-body">
        <form v-on:submit.prevent="submitForm">
          <h2 class="h3 mb-3 fw-normal text-center">Please sign in</h2>

          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control form-control-lg" placeholder="Username" v-model="form.login"/>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control form-control-lg" placeholder="Password" v-model="form.password"/>
          </div>

          <div class="checkbox mb-3">
            <label><input type="checkbox" value="remember-me"> Remember me</label>
          </div>

          <div class="w-100 form-group">
            <button class="btn btn-primary" type="submit">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import {getAPI} from "../axios-api";

export default {
  data() {
    return {
      form: {
        "login": "",
        "password": "",
      }
    }
  },
  methods: {
    submitForm() {
      console.log(this.form);
      getAPI.post('/api/v1/accounts/login/', this.form)
          .then((res) => {
            //Perform Success Action
            console.log(res);
            console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
            // error.response.status Check status code
          }).finally(() => {
        //Perform action in always
      });
    }
  }
}
</script>

<style lang="css">
</style>