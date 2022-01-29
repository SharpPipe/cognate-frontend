<template>
  <div class="groups">

    <div class="container">
      <h3>Groups</h3>

      <div>
        <table class="table">
          <tr v-for="group in APIData" :key="group.id">
            <td>

            <div class="row justify-content-between">

              <div class="col-auto">
                <img src="//placehold.it/120" class="img-fluid" alt="">
              </div>

              <div class="col my-auto">
                <div>
                  <h5 class="text-capitalize">
                    <a class="text-white" href="/repos">{{ group.name }} </a>
                  </h5>
                  <p class="text-muted m-0">{{ group.description }}</p>
                  <p class="text-muted m-0">Children type: {{ group.children_type }}</p>
                </div>
              </div>

              <GroupChartMini/>

            </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import { Api }      from "../axios-api";
import { mapState } from 'vuex'
import GroupChartMini from "../components/visualizations/GroupChartMini";

export default {
  name: 'Groups',
  data() {
    return {
    }
  },
  components: {
    GroupChartMini,
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
