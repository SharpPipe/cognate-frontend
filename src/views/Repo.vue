<template>
  <div class="repo">
    <div class="container">
      <h4>{{ APIData.project_name }}</h4>
      <ProgressBar
        class="mb-2"
        :currentPoints="currentPointsNew"
        :minPoints="minCoursePoints"
        :maxPoints="maxCoursePoints"
      />
      <div class="row m-1">
        <div class="col-4 p-0">
          <RepoRadar class="p-1" :radardata="radarData" />
        </div>
        <div class="col-4 p-0">
          <ProjectDevs class="m-2" />
        </div>
        <div class="col-4 p-0">
          <RepoTotalStats />
        </div>
      </div>
      <table class="table">
        <tr>
          <router-link
            :to="{
              name: 'grade-milestone',
              params: {
                groupid: $route.params.groupid,
                repoid: $route.params.repoid,
                msid: 1
              }
            }"
          >
            <td class="p-1">
              <RepoMilestoneCard nr="1" ms_status="ungraded" points="0" />
            </td>
          </router-link>

          <td class="p-1" v-for="n in 6" :key="n">
            <RepoMilestoneCard :nr="n" ms_status="TBA" points="0" />
          </td>
        </tr>
      </table>
      <div class="row">
        <GitTime />
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "../components/ProgressBar";
import ProjectDevs from "../components/ProjectDevs";
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
import RepoTotalStats from "../components/RepoTotalStats.vue";
import RepoMilestoneCard from "../components/RepoMilestoneCard.vue";
export default {
  name: 'Repo',
  components: {
    ProgressBar,
    GitTime,
    RepoRadar,
    ProjectDevs,
    RepoTotalStats,
    RepoMilestoneCard
  },
  data() {
    return {
      radarData: [
        { axis: "Management", value: 8 },
        { axis: "Tests", value: 5 },
        { axis: "Issues", value: 10 },
        { axis: "Time Spent", value: 8 },
        { axis: "Codelines", value: 8 },
        { axis: "Style", value: 4 }
      ],
      APIData: {
        'project_name': 'Minecraft',
      },
      currentPoints: 34,
      minCoursePoints: 0,
      maxCoursePoints: 600,
    }
  },
  computed: {
    currentPointsNew() {
      let sum = 0
      for (var thing in this.radarData) {
        sum += +this.radarData[thing].value
      }
      return sum
    }

  },
  watch: {
    radarData(change) {
      console.log(change)
    }
  }
}
</script>
