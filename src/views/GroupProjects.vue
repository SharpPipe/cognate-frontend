<template>
  <div class="projects">
    <div class="container" v-if="projects">
      <div class="row mx-0 justify-content-between">
        <span class="h4 my-1 mr-3">Milestones</span>
        <ProgressBar
          v-if="refreshIsOngoing"
          :currentPoints="+refreshDetail.process.completion_percentage"
          :minPoints="0"
          :maxPoints="100"
          class="w-75 my-auto"
        />
        <div v-if="projects.role.includes('O') || projects.role.includes('A')">
          <button
            class="btn-sm btn-secondary float-right"
            @click="preRefreshChecks($route.params.groupid)"
          >
            Refresh
          </button>
        </div>

        <div
          class="modal fade"
          id="passModal"
          data-backdrop=""
          tabindex="-1"
          role="dialog"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button
                  id="passClose"
                  type="button"
                  class="close"
                  data-dismiss="modal"
                >
                  <span>&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control mb-2"
                    placeholder="Enter password to refresh"
                    v-model="userpassword"
                  />
                </div>
              </div>
              <div class="modal-footer">
                <span>{{ passwordSendMsg }}</span>
                <button
                  class="btn btn-outline-success rounded"
                  type="button"
                  @click="getPassword"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
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
              <DonutChart
                :id="`teampiechart${project.id}`"
                :k="`${project.id}`"
                :users="project.users"
              />
            </td>

            <td class="p-1">
              <router-link
                :to="{
                  name: 'project',
                  params: {
                    groupid: $route.params.groupid,
                    repoid: project.id,
                  },
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
import { mapState } from "vuex";
import $ from "jquery";
import RepoChartMini from "../components/visualizations/RepoChartMini";
import DonutChart from "../components/visualizations/DonutChart.vue";
import ProgressBar from "../components/ProgressBar.vue";
import LoadingAnimation from "../components/LoadingAnimation.vue";

export default {
  name: "GroupProjects",
  components: {
    RepoChartMini,
    DonutChart,
    ProgressBar,
    LoadingAnimation,
  },
  computed: mapState(["username", "password"]),
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
      passwordSendMsg: null,
      userpassword: null,
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
    getPassword() {
      this.$store
        .dispatch("loginUser", {
          username: this.username,
          password: this.userpassword,
        })
        .then(() => {
          this.passwordSendMsg = "Success";
          this.refreshGroup(this.$route.params.groupid);
          $("#passClose").click();
        })
        .catch((error) => {
          console.log(error);
          this.passwordSendMsg = "Wrong credentials";
        });
    },
    preRefreshChecks(id) {
      if (this.password) {
        this.userpassword = this.password;
        this.refreshGroup(id);
      } else {
        $("#passModal").modal("show");
      }
    },
    async refreshGroup(id) {
      Api.post("groups/" + id + "/update/", { password: this.userpassword })
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
