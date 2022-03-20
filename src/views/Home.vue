<template>
  <div class="home h-100">

    <div class="container h-100 d-flex">
      <div class="jumbotron my-auto">
        <h1 class="display-1 font-weight-lighter font-italic">Cognate</h1>
        <p class="lead">Some people still know how learning is monitored.</p>
        <hr class="my-4">
        <p>Using modular dynamics and the common spectral analysis we are able to not only predict put alter the course of the success of a project.</p>
        <a class="btn btn-info btn-lg" href="#" role="button">Learn more</a>
      </div>
    </div>

  </div>
</template>

<script>
import { Api } from '../axios-api'

export default {
  name: 'Home',
  data() {
    return {}
  },
  created() {
    // To check if we are still logged in
    // and if not then refresh the tokens
    Api.get("/")
      .then(() => console.log("refreshed"))
      .catch(err => console.log(err))

  },
}
</script>
