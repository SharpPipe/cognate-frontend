<template>
  <main class="form-signin">
    <div class="card">
      <div class="card-body">
        <form v-on:submit.prevent="submitForm">
          <h2 class="h3 mb-3 fw-normal text-center">Please sign up</h2>

          <div class="form-group">
            <label>First Name</label>
            <input type="text" class="form-control form-control-lg" placeholder="First name" v-model="form.first_name"/>
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input type="text" class="form-control form-control-lg" placeholder="Last name" v-model="form.last_name"/>
          </div>

          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control form-control-lg" placeholder="Username" v-model="form.username"/>
          </div>

          <div class="form-group">
            <label>Email address</label>
            <input type="email" class="form-control form-control-lg" placeholder="Email address" v-model="form.email"/>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control form-control-lg" placeholder="Password" v-model="form.password"/>
          </div>

          <div class="form-group">
            <label>Confirm password</label>
            <input type="password" class="form-control form-control-lg" placeholder="Confirm Password" v-model="form.password_confirm"/>
          </div>

          <div class="notification is-danger" v-if="errors.length">
            <p v-for="error in errors" v-bind:key="error">{{error}}</p>
          </div>

          <div class="w-100 form-group">
            <button class="btn btn-primary" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { getAPI} from "../axios-api";

export default {
  data() {
    return {
      form: {
        "first_name": "",
        "last_name": "",
        "username": "",
        "email": "",
        "password": "",
        "password_confirm": ""
      }
    }
  },
  methods: {
    submitForm() {
      console.log(this.form);
      getAPI.post('/api/v1/accounts/register/', this.form)
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