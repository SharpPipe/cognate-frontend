<template>
  <div id="app">
    <Navbar/>
    <Breadcrumbs class="p-1 rounded-0"  style="background-color: #343a4080;" />
    <router-view/>
  </div>
</template>

<script>
import Navbar from "./components/BaseNavbar";

export default {
  name: 'App',
  components: {
    Navbar,
  },
}
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
