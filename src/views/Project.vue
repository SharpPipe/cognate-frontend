<template>
  <div class="repo">
    <div v-if="projectDetails" class="container">
      <!--  GitLab links  -->
      <span
        v-for="gitlabrepo in projectDetails.repositories"
        :key="gitlabrepo.gitlab_id"
        class="w-50"
      >
        <span class="w-50 m-1 h5">
          <a :href="gitlabrepo.url" target="_blank">
            <font-awesome-icon icon="fa-brands fa-gitlab" />GitLab:
            <em>{{ gitlabrepo.name }}</em>
          </a>
        </span>
      </span>
      <div class="float-right">
        <router-link
          :to="{
            name: 'managerepo',
          }"
        >
          <div class="btn-sm btn-secondary">Manage project</div>
        </router-link>
      </div>

      <!--  Overview data  -->
      <div class="row m-1">
        <div class="col-4 p-0" v-if="radar.length">
          <RepoRadar class="p-1" :radardata="radar" />
        </div>

        <div class="col-5 p-0 d-flex flex-column align-content-stretch">
          <div class>
            <div
              v-for="dev in projectDetails.developers"
              :key="dev.username"
              class="d-flex col m-0"
            >
              <ProjectDeveloper :devData="dev" class="w-100 m-1" />
            </div>
          </div>
        </div>

        <div class="col-3 p-0">
          <ProjectTotalStats :totalStats="projectDetails.project" />
        </div>
      </div>

      <!--  Sprints  -->

      <table class="table table-borderless" id="sprint_table">
        <tr>
          <td
            v-for="milestone in projectDetails.milestones"
            :key="milestone.milestone_id"
            class="m-1 p-1"
          >
            <router-link
              :to="{
                name: 'assess-sprint',
                params: {
                  groupid: $route.params.groupid,
                  repoid: $route.params.repoid,
                  msid: milestone.milestone_id,
                  start: milestone.start_time,
                  end: milestone.end_time,
                },
              }"
            >
              <ProjectMilestoneCard class="m-0" :msData="milestone" />
            </router-link>
          </td>
        </tr>
      </table>

      <!--  Graph  -->
      <div class="row" v-if="gittimedata.length && devColours.loaded">
        <GitTime
          class="w-100"
          :gitdata="gittimedata"
          :colours="devColours.users"
        />
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
import ProjectTotalStats from "../components/ProjectTotalStats.vue";
import ProjectDeveloper from "../components/ProjectDeveloper";
import ProjectMilestoneCard from "../components/ProjectMilestoneCard.vue";
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";

import { Api } from "../axios-api";
export default {
  name: "Project",
  components: {
    GitTime,
    RepoRadar,
    ProjectDeveloper,
    ProjectTotalStats,
    ProjectMilestoneCard,
  },
  updated() {
    // Start the milestone table at the end
    document.getElementById("sprint_table").scrollBy(1000, 0);
  },
  data() {
    return {
      radarData: [
        [
          { axis: "Retro", value: 1 },
          { axis: "Meeting", value: 3 },
          { axis: "Branches", value: 2 },
          { axis: "Planning", value: 2 },
          { axis: "Issues", value: 1 },
        ],
      ],
      currentPoints: 30,
      minCoursePoints: 0,
      maxCoursePoints: 2000,
      milestones: null,
      assessmentMilestones: null,
      issueData: [],

      projectTimeRange: [
        new Date(2022, 0, 24, 0, 0, 0),
        new Date(2022, 7, 16, 0, 0, 0),
      ],
      comments: [],
      projectDetails: [],

      radar: [],
      gittimedata: [],
      devColours: {
        loaded: false,
        users: {},
      },
    };
  },
  created() {
    const repoid = this.$route.params.repoid;
    Api.get("/projects/" + repoid + "/")
      .then((response) => {
        this.projectDetails = response.data;
        for (let dev of this.projectDetails.developers)
          this.devColours["users"][dev.username] = dev.colour;
        this.devColours.loaded = true;

        this.radar = this.formatMilestonePointsForRadarGraph(
          this.projectDetails.milestones
        );
      })
      .catch((err) => {
        console.log(err);
      });

    Api.get("/feedback/", { params: { type: "PA", project: repoid } })
      .then((response) => {
        this.comments = response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    Api.get("/projects/" + repoid + "/time_spent/", {
      params: {
        start: this.projectTimeRange[0].toISOString(),
        end: this.projectTimeRange[1].toISOString(),
      },
    })
      .then((response) => {
        this.gittimedata = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    formatedTime(timeString) {
      return new Date(timeString).toUTCString();
    },
    formatMilestonePointsForRadarGraph(milestones) {
      // This is the result of Kristjan building bad APIs
      let numOfDevs = milestones[0].user_points.length;
      for (let ms of milestones) {
        let r = [
          { axis: "Retro", value: 0 },
          { axis: "Meeting", value: 0 },
          { axis: "Branch management", value: 0 },
          { axis: "Planning", value: 0 },
          { axis: "Issues", value: 0 },
        ];
        for (let user of ms.user_points) {
          for (let key in user.assessments) {
            if (key !== "Effort") {
              if (key === "Meeting" || key === "Retro")
                r.find((o) => o.axis == key).value = user.assessments[key];
              else
                r.find((o) => o.axis == key).value +=
                  user.assessments[key] / numOfDevs;
            }
          }
        }
        this.radar = this.radar.concat(Array(r));
        r = [
          { axis: "Retro", value: 0 },
          { axis: "Meeting", value: 0 },
          { axis: "Branch management", value: 0 },
          { axis: "Planning", value: 0 },
          { axis: "Issues", value: 0 },
        ];
      }

      return this.radar;
    },
  },
};
</script>

<style scoped>
table {
  display: block;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 20px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 10px;
}
</style>