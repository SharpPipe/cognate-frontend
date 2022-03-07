<template>
  <div class="repo">
    <div class="container">
      <h4 v-if="APIData">{{ APIData.name }}</h4>
      <ProgressBar
        class="mb-2 mx-2"
        :currentPoints="currentPoints"
        :minPoints="minCoursePoints"
        :maxPoints="maxCoursePoints"
      />
      <div class="row m-1">
        <div class="col-4 p-0">
          <RepoRadar class="p-1" :radardata="radarData" />
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column justify-content-end flex-grow-1">
            <div v-for="dev in 3" :key="dev">
              <RepoDeveloper name="Dev" spentTime="--" class="m-2" />
            </div>
          </div>
        </div>
        <div class="col-3 p-0">
          <RepoTotalStats spent="----" codelines="----" />
        </div>
      </div>
      <table class="table table-borderless">
        <tr>
          <td v-for="(milestone, i) in milestones" :key="i" class="m-0 p-0">
            <router-link
              :to="{
                name: 'grade-milestone',
                params: {
                  groupid: $route.params.groupid,
                  repoid: $route.params.repoid,
                  msid: i + 1
                }
              }"
            >
              <RepoMilestoneCard
                class="m-0"
                nr="1"
                ms_status="ungraded"
                points="-"
                :ms_data="milestone"
              />
            </router-link>
          </td>
        </tr>
      </table>
      <div class="row">
        <GitTime class="w-100" :milestones="milestones" :timeRange="projectTimeRange"/>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "../components/ProgressBar";
import RepoDeveloper from "../components/RepoDeveloper";
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
import RepoTotalStats from "../components/RepoTotalStats.vue";
import RepoMilestoneCard from "../components/RepoMilestoneCard.vue";

import { mapState } from 'vuex'
import { Api } from "../axios-api";
export default {
  name: 'Repo',
  components: {
    ProgressBar,
    GitTime,
    RepoRadar,
    RepoDeveloper,
    RepoTotalStats,
    RepoMilestoneCard
  },
  computed: mapState(['APIData']),
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
      issueData: [],
      projectTimeRange: [new Date(2022, 0, 24, 0,0,0), new Date(2022, 5, 16,0,0,0)]
    }
  },
  created() {
    const url = 'repositories/' + this.$route.params.repoid + "/update/"
    Api.get(url)
      .then(response => {
        this.$store.state.APIData = response.data.data
      })
      .catch(err => {
        console.log(err)
      })

    Api.get("/projects/" + this.$route.params.repoid + "/milestones/")
      .then(response => {
        this.milestones = response.data.reverse()
      })
      .catch(err => {
        console.log(err)
      })


  },
}
</script>

<style scoped>
table {
  table-layout: fixed;
}
</style>