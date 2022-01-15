<template>
  <div class="groups">
    <Navbar/>

    <div class="container">
      <h3>Groups</h3>

      <div v-for="group in APIData" :key="group.id">
        <div class="row py-1">
          <div class="card w-100">
            <div class="row justify-content-between">
              <div class="col-auto">
                <img src="//placehold.it/100" class="img-fluid" alt="">
              </div>
              <div class="col my-auto">
                <div class="card-block">
                  <h5 class="card-title">
                    <!-- TODO add real routing -->
                    <a class="text-primary" href="/repos">{{ group.group_name}} </a>
                  </h5>
                  <p class="card-text">{{ group.description }}</p>
                </div>
              </div>

              <div class="col my-auto d-flex justify-content-end">
                <img class="px-2 img-fluid"
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Sparkline_sp500.svg/188px-Sparkline_sp500.svg.png"
                     alt="sparkline"/>
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
      APIData: [{'id': 0, 'group_name': 'Java Tiimiprojektid', 'description': 'Games! Games! Games!'},
        {'id': 1, 'group_name': 'Veebiarendus', 'description': 'Oleg annab'},
        {'id': 2, 'group_name': 'Erialatutvustus', 'description': 'Onboarding to Taltech'}
      ]
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
