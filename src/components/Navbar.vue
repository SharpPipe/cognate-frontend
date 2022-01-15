<template>
  <div class="navbar">

    <nav class="navbar navbar-expand-md navbar-dark primary-color">
      <a class="navbar-brand font-italic font-weight-light" href="/">Cognate</a>

      <div class="navbar-expand">
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