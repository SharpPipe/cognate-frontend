<template>
  <div class="groups">

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
                    <a class="text-primary" href="/repos">{{ group.name }} </a>
                  </h5>
                  <p class="card-text">{{ group.description }}</p>
                  <p class="card-text">Children type: {{ group.children_type }}</p>
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
import {Api} from "../axios-api";
import {mapState} from 'vuex'

export default {
  name: 'Groups',
  data() {
    return {
      APIData: []
    }
  },
  computed: mapState(['APIData']),
  created() {
    Api.get('groups/', {headers: {Authorization: `Bearer ${this.$store.state.accessToken}`}})
        .then(response => {
          this.$store.state.APIData = response.data
        })
        .catch(err => {
          console.log(err)
        })
  }
}
</script>
