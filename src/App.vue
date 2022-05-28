<template>
  <div id="app">
    <Navbar @switchlight="switchMode"/>
    <Breadcrumbs class="p-1 rounded-0" />
    <router-view/>
  </div>
</template>

<script>
import Navbar from "./components/BaseNavbar";
import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.css'
import '@forevolve/bootstrap-dark/dist/css/toggle-bootstrap.css'
import '@forevolve/bootstrap-dark/dist/css/toggle-bootstrap-dark.css'

export default {
  name: 'App',
  components: {
    Navbar,
  },
  data() {
    return {
      lightmode: false
    }
  },
  created() {
    document.body.className = 'bootstrap-dark'
  },
  methods: {
    switchMode () {
      this.lightmode = !this.lightmode
      document.body.className = this.lightmode ? 'bootstrap' : 'bootstrap-dark'
    },
  }
}

</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
