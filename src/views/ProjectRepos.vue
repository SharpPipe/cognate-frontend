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
              :is="(n >= 5) ? 'span' : 'router-link'"
              :to="{
                name: 'group-milestone-summary',
                params: {
                  id: $route.params.id,
                  msid: n
                }
              }"
            >
              <p>Milestone {{ n }}</p>
            </router-link>
          </td>
        </tr>
      </table>

      <h4>Teams</h4>

      <div v-if="repos">
        <table class="table">
          <tr v-for="repo in repos" :key="repo.id">
            <td v-if="repo.users" class="p-1">
              <PieChart :id="`teampiechart${repo.id}`" :k="`${repo.id}`" :users="repo.users" />
            </td>

            <td class="p-1">
              <router-link
                :to="{ name: 'repo', params: { groupid: $route.params.id, repoid: repo.id } }"
                class="text-white"
              >{{ repo.name }}</router-link>
            </td>

            <td class="p-1 col-4">
              <div v-if="repo.mentors && repo.mentors.length > 0">
                <span class="badge badge-dark">{{ repo.mentors[0] }} asdfa</span>
                <br />
              </div>
              <span v-for="(dev, i) in repo.users" :key="i" class="pr-1">
                <div v-if="dev.points > 0" class="badge badge-success">
                  {{ dev.name }}:
                  <small>{{ Math.round(dev.points) }}</small>
                </div>
              </span>
            </td>

            <td class="p-1">
              <RepoChartMini :id="`repoms${repo.id}`" :k="repo.id" :milestones="repo.milestones" />
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import RepoChartMini from "../components/visualizations/RepoChartMini";
import PieChart from "../components/visualizations/PieChart.vue";

export default {
  name: 'Home',
  components: {
    RepoChartMini,
    PieChart
  },
  data() {
    return {
      repos: null
    }
  },
  created() {
    const url = 'groups/' + this.$route.params.id + "/"
    Api.get(url)
      .then(response => {
        this.repos = response.data
      })
      .catch(err => {
        console.log(err)
      })

  }
}
</script>
