<template>
  <div class="repos">
    <div class="container">
      <div class='row d-flex'>
        <div class='flex-grow-1'><h3>Project Name</h3></div>
        <div class='text-muted'>Group ID: {{APIData[0].project_group}}</div>
      </div>

      <div>
        <table class="table">
          <tr v-for="repo in APIData" :key="repo.id">
            <td>
                <img src="//placehold.it/80" class="img-fluid" alt="">
            </td>

            <td>
                <div class="col p-0 my-auto">
                  {{repo.name}}
                </div>
            </td>

            <td>
                <div class="col my-auto">
                  <div class="text-secondary">
                    Best Management <br>
                    0.00 | 1.2 | 23
                  </div>
                </div>
            </td>

            <td>
              <RepoChartMini/>
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
import RepoChartMini from "../components/visualizations/RepoChartMini";

export default {
  name: 'Home',
  data() {
    return {
    }
  },
  components: {
    RepoChartMini,
  },
  computed: mapState(['APIData']),
  created() {
    Api.get('projects/' + this.$route.params.id, {headers: {Authorization: `Bearer ${this.$store.state.accessToken}`}})
        .then(response => {
          this.$store.state.APIData = response.data
          console.log(response.data)

        })
        .catch(err => {
          console.log(err)
        })
    
  }
}
</script>
