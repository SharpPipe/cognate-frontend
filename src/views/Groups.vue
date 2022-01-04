<template>
  <div class="groups">
    <Navbar/>
    <center>
      <h1>Gitlab Hub</h1>
      <h3>Groups</h3>
    </center>



    <div class="album py-2 bg-light">
      <div class="container">
        <div class="row">
          <div v-for="group in APIData" :key="group.id">
            <div class="card">
              <div class="row no-gutters">
                <div class="col-auto">
                  <img src="//placehold.it/150" class="img-fluid" alt="">
                </div>
                <div class="col">
                  <div class="card-block px-2 py-2">
                    <h4 class="card-title"><a class="text-secondary" href="">{{ group.group_name }}</a></h4>
                    <p class="card-text">{{ group.description }}</p>
                    <a href="#" class="btn btn-primary">BUTTON</a>
                  </div>
                </div>
              </div>
              <div class="card-footer w-100 text-muted">
                Footer stating Kristjan is a spicy boy
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {getAPI} from '../axios-api'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Groups',
  data() {
    return {
      APIData: []
    }
  },
  components: {
    Navbar,
  },
  created() {
    getAPI.get('/groups',)
        .then(response => {
          console.log('Post API has recieved data')
          this.APIData = response.data
        })
        .catch(err => {
          console.log(err)
        })
  }
}

</script>

<style scoped>

</style>
