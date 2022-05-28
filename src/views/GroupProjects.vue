<template>
  <div class="projects">
    <div class="container" v-if="projects">
      <div class="row justify-content-between">
        <span class="h4 my-1 mr-3">Milestones</span>
        <ProgressBar
          v-if="refreshIsOngoing"
          :currentPoints="+refreshDetail.process.completion_percentage"
          :minPoints="0"
          :maxPoints="100"
          class="w-75 my-auto"
        />
        <div v-if="projects.rights.includes('O') || projects.rights.includes('A')">
          <button
            class="btn-sm btn-secondary float-right"
            @click="refreshGroup($route.params.groupid)"
          >
            Refresh
          </button>
        </div>
      </div>

      <table class="table table-borderless">
        <tr v-if="projects.total_milestones">
          <td class="m-0 p-0" v-for="n in projects.total_milestones" :key="n">
            <router-link
              :is="n > projects.active_milestones ? 'span' : 'router-link'"
              :to="{
                name: 'group-milestone-summary',
                params: {
                  groupid: $route.params.groupid,
                  msid: n,
                },
              }"
            >
              <p>Milestone {{ n }}</p>
            </router-link>
          </td>
        </tr>
      </table>

      <h4>Teams</h4>

      <div v-if="projects">
        <table class="table">
          <tr v-for="project in projects.data" :key="project.id">
            <td v-if="project.users" class="p-1">
              <PieChart
                :id="`teampiechart${project.id}`"
                :k="`${project.id}`"
                :users="project.users"
              />
            </td>

            <td class="p-1">
              <router-link
                :to="{
                  name: 'project',
                  params: { groupid: $route.params.groupid, repoid: project.id },
                }"
                >{{ project.name }}</router-link
              >
            </td>

            <td class="p-1 col-4">
              <div v-if="project.mentors && project.mentors.length > 0">
                <span class="badge badge">{{ project.mentors[0] }}</span>
                <br />
              </div>
              <span v-for="(dev, i) in project.users" :key="i" class="pr-1">
                <div class="badge border">
                  <svg class="m-0 p-0" height="12" width="12">
                    <circle cx="6" cy="6" r="6" :fill="`#${dev.colour}`" />
                  </svg>
                  {{ dev.name }}:
                  <small>{{ Math.round(dev.points) }}</small>
                </div>
              </span>
            </td>

            <td class="p-1">
              <RepoChartMini
                :id="`repoms${project.id}`"
                :k="project.id"
                :milestones="project.milestones"
              />
            </td>
          </tr>
        </table>
      </div>
    </div>
    <center v-else>
      <LoadingAnimation />
    </center>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import RepoChartMini from "../components/visualizations/RepoChartMini";
import PieChart from "../components/visualizations/PieChart.vue";
import ProgressBar from "../components/ProgressBar.vue";
import LoadingAnimation from "../components/LoadingAnimation.vue";

export default {
  name: "GroupProjects",
  components: {
    RepoChartMini,
    PieChart,
    ProgressBar,
    LoadingAnimation,
  },
  data() {
    return {
      projects: null,
      refreshMeta: null,
      refreshDetail: {
        process: {
          completion_percentage: 0,
          status: "F",
        },
      },
      refreshIsOngoing: false,
      i: 0,
    };
  },
  created() {
    const url = "groups/" + this.$route.params.groupid + "/";
    Api.get(url)
      .then((response) => {
        this.projects = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    async refreshGroup(id) {
      Api.get("groups/" + id + "/update/")
        .then((response) => {
          this.refreshMeta = response.data;
          this.refreshIsOngoing = true;
          console.log(this.refreshMeta);
        })
        .then(() => {
          var int = setInterval(() => {
            if (this.refreshIsOngoing) {
              Api.get(
                "process/" +
                  this.refreshMeta.id +
                  "/" +
                  this.refreshMeta.hash +
                  "/"
              ).then((res) => {
                this.refreshDetail = res.data;
                this.refreshIsOngoing =
                  this.refreshDetail.process.status == "O";
              });
            } else {
              clearInterval(int);
            }
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
