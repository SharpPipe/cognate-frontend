<template>
  <div class="repos">
    <div class="container">
      <div class="row d-flex">
        <div class="flex-grow-1">
          <h2>{{ $route.params.name }}</h2>
        </div>
        <div class="text-muted">Group ID: {{ $route.params.group_id }}</div>
      </div>

      <h4>Milestones</h4>

      <table class="table table-borderless">
        <tr>
          <td class="m-0 p-0" v-for="n in 7" :key="n">
            <router-link
              :is="(n >= 3) ? 'span' : 'router-link'"
              :to="{
                name: 'group-milestone-summary',
                params: {
                  id: $route.params.id,
                  msid: n
                }
              }"
            >
              <p>Milestone {{n}}</p>
            </router-link>
          </td>

        </tr>
      </table>




      <h4>Teams</h4>

      <div>
        <table class="table">
          <tr v-for="repo in APIData" :key="repo.id">

            <td class="p-1">
                <PieChart :id="`teampiechart${repo.id}`" :k="`${repo.id}`" :users="repo.users"/>
            </td>

            <td class="p-1">
              <router-link
                :to="{ name: 'repo', params: { groupid: $route.params.id, repoid: repo.id } }"
                class="text-white"
              >{{ repo.name }}</router-link>
            </td>

            <td class="p-1 col-4">
              <div v-if="repo.mentors.length > 0">
                <span class="badge badge-dark">
                  {{repo.mentors[0]}} asdfa
                </span>
              <br/>
              </div>
              <span v-for="dev in repo.users" :key=dev class="pr-1">
                <div v-if="dev.points > 0" class="badge badge-success">
                  {{dev.name}}:
                <small>{{Math.round(dev.points)}}</small>
                </div>
              </span>
            </td>


            <td class="p-1">
              <RepoChartMini :id="`repoms${repo.id}`" :k="`${repo.id}`"/>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import { mapState } from 'vuex'
import RepoChartMini from "../components/visualizations/RepoChartMini";
import PieChart from "../components/visualizations/PieChart.vue";

export default {
  name: 'Home',
  components: {
    RepoChartMini,
    PieChart
},
  computed: mapState(['APIData']),
  created() {
    const url = 'projects/' + this.$route.params.id + "/"
    Api.get(url)
      .then(response => {
        this.$store.state.APIData = response.data

      })
      .catch(err => {
        console.log(err)
      })

  }
}
</script>
