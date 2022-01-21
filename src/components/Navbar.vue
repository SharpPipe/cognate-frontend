<template>
  <div class="nav-bar">
    <nav class="navbar navbar-expand-lg navbar-dark primary-color">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
              aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand font-italic font-weight-light" href="/">Cognate</a>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
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
          <li class="nav-item nav-link">
            <router-link :to="{ name:'signin' }" exact >signin</router-link>
          </li>
          <li class="nav-item nav-link">
            <router-link :to="{ name:'signup' }" exact >signup</router-link>
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