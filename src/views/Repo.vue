<template>
  <div class="repo">
    <div class="container">
      <!--  GitLab links  -->
      <h5 v-for="gitlabrepo in projectDetails.repositories" :key="gitlabrepo.gitlab_id">
        <a :href="gitlabrepo.url" target="_blank">
          <font-awesome-icon icon="fa-brands fa-gitlab" />GitLab:
          <em>{{ gitlabrepo.name }}</em>
        </a>
      </h5>

      <!--  Overview data  -->
      <div class="row m-1">
        <div class="col-4 p-0">
          <RepoRadar class="p-1" :radardata="radarData" />
        </div>

        <div class="col-5 p-0 d-flex flex-column align-content-stretch">
          <div class>
            <div
              v-for="dev in projectDetails.developers"
              :key="dev.username"
              class="d-flex col m-0"
            >
              <RepoDeveloper :devData="dev" class="w-100 m-1" />
            </div>
          </div>
        </div>

        <div class="col-3 p-0">
          <RepoTotalStats spent="----" codelines="----" />
        </div>
      </div>

      <!--  Sprints  -->
      <table class="table table-borderless">
        <tr>
          <td v-for="(milestone, i) in gradeMilestones" :key="i" class="m-1 p-1">
            <router-link
              :to="{
                name: 'grade-milestone',
                params: {
                  groupid: $route.params.groupid,
                  repoid: $route.params.repoid,
                  msid: i + 1,
                  start: milestone.start,
                  end: milestone.end,
                }
              }"
            >
              <RepoMilestoneCard
                class="m-0"
                :nr="milestone.milestone_order_id"
                ms_status="ungraded"
                points="-"
              />
            </router-link>
          </td>
        </tr>
      </table>

      <!--  Graph  -->
      <div class="row" v-if="gittimedata">
        <GitTime class="w-100" :gitdata="gittimedata" />
      </div>

      <!--  Comments  -->
      <div v-if="comments.length" class="border rounded p-3 my-2">
        <h4>Comments</h4>
        <div v-for="comment in comments" :key="comment.time" class="mb-2">
          <span class="badge badge-info">
            {{ comment.commenter.username }}
            <small>{{ formatedTime(comment.time) }}</small>
          </span>
          <br />
          {{ comment.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RepoDeveloper from "../components/RepoDeveloper";
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
import RepoTotalStats from "../components/RepoTotalStats.vue";
import RepoMilestoneCard from "../components/RepoMilestoneCard.vue";

import { Api } from "../axios-api";
export default {
  name: 'Repo',
  components: {
    GitTime,
    RepoRadar,
    RepoDeveloper,
    RepoTotalStats,
    RepoMilestoneCard
  },
  data() {
    return {
      radarData: [
        { axis: "Retro", value: 0 },
        { axis: "Meeting", value: 0 },
        { axis: "Branch management", value: 0 },
        { axis: "Planning", value: 0 },
        { axis: "Issues", value: 0 },
      ],
      currentPoints: 30,
      minCoursePoints: 0,
      maxCoursePoints: 2000,
      milestones: null,
      gradeMilestones: null,
      issueData: [],

      projectTimeRange: [new Date(2022, 0, 24, 0, 0, 0), new Date(2022, 7, 16, 0, 0, 0)],
      comments: [],
      projectDetails: [],

      gittimedata: null,
    }
  },
  created() {
    const repoid = this.$route.params.repoid

    Api.get("/feedback/", { params: { type: "PA", project: repoid } })
      .then(response => {
        this.comments = response.data
      })
      .catch(err => {
        console.log(err)
      })

    Api.get("/projects/" + repoid + "/")
      .then(response => {
        this.projectDetails = response.data
      })
      .catch(err => {
        console.log(err)
      })

    Api.get('/projects/' + repoid + "/time_spent/",
      {
        params: {
          start: this.projectTimeRange[0].toISOString(),
          end: this.projectTimeRange[1].toISOString()
        }
      })
      .then(response => {
        this.gittimedata = response.data
      })
      .catch(err => {
        console.log(err)
      })

  },
  methods: {
    formatedTime(timeString) {
      return new Date(timeString).toUTCString()
    }
  },
}
</script>

<style scoped>
table {
  table-layout: fixed;
}
</style>