<template>
  <div class="nav-bar">
    <nav class="navbar navbar-expand-lg navbar-dark BG-DARK nav-1">
      <div class="container mw-0 px-3">

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
            <router-link :to = "{ name:'groups' }" exact>Groups</router-link>
            </li>
          </ul>
        </div>

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