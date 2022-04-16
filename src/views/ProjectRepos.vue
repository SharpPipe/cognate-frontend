<template>
  <div class="repos">
    <div class="container" v-if="repos">
      <div class="row justify-content-between">
        <span class="h4 my-1 mr-3">Milestones</span>
        <ProgressBar
          v-if="refreshIsOngoing"
          :currentPoints="(+refreshDetail.process.completion_percentage)"
          :minPoints="0"
          :maxPoints="100"
          class="w-75 my-auto"
        />
        <div v-if="repos.rights.includes('O') || repos.rights.includes('A')">
          <button
            class="btn-sm btn-secondary float-right"
            @click="refreshGroup($route.params.id)"
          >Refresh</button>
          <router-link tag="button" class="btn-sm btn-secondary float-right"
              :to="{
                name: 'group-admin-view',
                params: { id: $route.params.id }
              }"
          >Config</router-link>
        </div>
      </div>

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
          <tr v-for="repo in repos.data" :key="repo.id">
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
                <span class="badge badge-dark">{{ repo.mentors[0] }}</span>
                <br />
              </div>
              <span v-for="(dev, i) in repo.users" :key="i" class="pr-1">
                <div class="badge badge-dark">
                  <svg class="m-0 p-0" height="12" width="12">
                    <circle cx="6" cy="6" r="6" :fill="`#${dev.colour}`" />
                  </svg>
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
import ProgressBar from "../components/ProgressBar.vue";

export default {
  name: 'Home',
  components: {
    RepoChartMini,
    PieChart,
    ProgressBar,
  },
  data() {
    return {
      repos: null,
      refreshMeta: null,
      refreshDetail: {
        process: {
          completion_percentage: 0,
          status: "F"
        }
      },
      refreshIsOngoing: false,
      i: 0
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
  },
  methods: {
    async refreshGroup(id) {
      Api.get('projects/' + id + "/update/")
        .then(response => {
          this.refreshMeta = response.data
          this.refreshIsOngoing = true
          console.log(this.refreshMeta)
        })
        .then(() => {
          var int = setInterval(() => {
            if (this.refreshIsOngoing) {
              Api.get('process/' + this.refreshMeta.id + '/' + this.refreshMeta.hash + '/')
                .then(res => {
                  this.refreshDetail = res.data
                  this.refreshIsOngoing = this.refreshDetail.process.status == "O"
                })
            }
            else {
              clearInterval(int)
            }
          }, 2000)
        })
        .catch(err => {
          console.log(err)
        })
    },
  },
}
</script>
