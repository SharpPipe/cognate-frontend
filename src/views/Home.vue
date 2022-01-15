<template>
  <div class="home h-100">
    <Navbar/>

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
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Home',
  data() {
    return {}
  },
  components: {
    Navbar,
  },
}
</script>

<style scoped>

</style>
