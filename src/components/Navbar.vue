<template>
  <div class="navbar">

    <nav class="navbar navbar-expand-md navbar-dark primary-color">
      <a class="navbar-brand font-italic" href="/">Cognate</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent"
              aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item nav-link">
            <router-link :to="{ name:'groups' }" exact>Groups</router-link>
          </li>

          <li class="nav-item nav-link">
            <router-link :to="{ name:'browse' }" exact>Browse</router-link>
          </li>

          <li class="nav-item disabled nav-link">
            <router-link :to="{ name:'pricing' }" exact>Pricing</router-link>
          </li>
        </ul>
      </div>

    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style scoped>

</style>