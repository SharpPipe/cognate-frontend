<template>
  <div class="repo">
    <div class="container">
      <h4>{{ APIData.project_name }}</h4>
      <ProgressBar
        class="mb-2"
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
              <RepoDeveloper name="Dev" spentTime="23" class="m-2" />
            </div>
          </div>
        </div>
        <div class="col-3 p-0">
          <RepoTotalStats spent="33" codelines="6344" />
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
import RepoDeveloper from "../components/RepoDeveloper";
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
    RepoDeveloper,
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
      currentPoints: 15,
      minCoursePoints: 0,
      maxCoursePoints: 600,
    }
  },
  watch: {
    radarData(change) {
      console.log(change)
    }
  }
}
</script>
