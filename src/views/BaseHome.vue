<template>
  <div class="home">
    <div
      class="
        container
        h-100
        d-flex
        align-itmes-center
        justify-content-center
        w-50
      "
    >
      <div class="jumbotron my-auto bg-transparent align-middle">
        <h1 class="display-1 font-weight-lighter font-italic">Cognate</h1>
        <p class="lead">Some people still know how learning is monitored.</p>
        <hr class="my-4" />
        <p>
          Using modular dynamics and the common spectral analysis we are able to
          not only predict put alter the course of the success of a project.
        </p>
        <router-link class="btn btn-info btn-lg" :to="{ name: 'groups' }" exact
          >My Groups</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";

export default {
  name: "BaseHome",
  created() {
    // To check if we are still logged in
    // and if not then refresh the tokens
    Api.get("/").catch((err) => console.log(err));
  },
};
</script>

<style scoped>
.home {
  height: 80vh;
}
</style>
