<template>
  <div class="container" v-if="APIData">
    <h3>{{ APIData.project_name }}</h3>
    <div class="row m-1">
      <!--  RepoRadar  -->
      <div class="col-4 p-0" v-if="radarData.length">
        <RepoRadar :radardata="Array(radarData)" :key="key" />
      </div>

      <!--  GitTime  -->
      <div class="col-8 px-3" v-if="gittimedata.length">
        <GitTime :gitdata="gittimedata" :colours="devColours" />
      </div>
      <div class="col-8 px-3 m-auto" v-else>
        <h4 class="text-center text-warning">NO SPENT TIME DATA AVAILABLE</h4>
      </div>
    </div>

    <!--  Grade Individual Student  -->
    <div class="row m-1">
      <div class="col" :v-if="APIData" v-for="dev in APIData.users_data" :key="dev.id">
        <RepoDeveloper :devData="dev" />
        <RepoGradeStudent :points="dev.data" v-on:pointsChanged="updateRadar" />
        <ProgressBar
            class="mb-2"
            :currentPoints="currentPoints(dev.data)"
            minPoints="0"
            :maxPoints="maxPoints()"
        />
      </div>
    </div>

    <!--  Grade the whole team  -->
    <div class="row mx-3 p-1">
      <!--         :teamPoints="APIData.project_data" -->
      <RepoGradeTeam
        :teamPoints="APIData.project_data"
        v-on:teamPointsChanged="updateTeamPoints($event)"
      />
    </div>

    <!--  Add Helpful Comment  -->
    <form class="form-group container m-2 pr-4">
      <div class="form-group">
        <textarea
          class="form-control"
          rows="3"
          v-model="payload.feedback"
          placeholder="What is the team doing right/wrong?"
        ></textarea>
      </div>
    </form>

    <div class="row mx-3 p-1 ml-1">
      <div v-if="msg" class="alert alert-success" role="alert">{{ msg }}</div>

      <div class="ml-auto mr-0">
        <button class="btn btn-success" @click="submitGrades">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
import RepoGradeStudent from "../components/RepoGradeStudent.vue";
import RepoGradeTeam from "../components/RepoGradeTeam.vue";
import RepoDeveloper from "../components/RepoDeveloper.vue";
import ProgressBar from "../components/ProgressBar.vue";
import { Api } from "../axios-api"
import _ from "lodash"

export default {
  name: 'Repo',
  components: {
    GitTime,
    RepoRadar,
    RepoGradeStudent,
    RepoGradeTeam,
    RepoDeveloper,
    ProgressBar,
  },
  data() {
    return {
      key: 0,  // to force update
      msg: null,
      APIData: null,
      radarData: [
        { axis: "Retro", value: 0 },
        { axis: "Meeting", value: 0 },
        { axis: "Branches", value: 0 },
        { axis: "Planning", value: 0 },
        { axis: "Issues", value: 0 },
      ],
      payload: {
        feedback: "",
        type: "PA",
        project: this.$route.params.repoid,
      },
      gittimedata: [],
      devColours: {},
    }
  },
  methods: {
    submitGrades() {
      let pl = this.makePayload()
      Api.post('/bulk_grade/', pl)
        .then(() => {
          this.msg = "Points saved!"
          console.log("Grades posted")
        })
        .catch(err => {
          console.log(err)
        })
      if (this.payload.feedback) {
        Api.post('/feedback/', this.payload)
          .catch(err => {
            console.log(err)
          })
      }
    },
    updateTeamPoints(event) {
      this.radarData[0].value = +this.radarData[0].value
      this.radarData[1].value = +this.radarData[1].value
      return event
    },
    updateRadar() {
      this.key++;
    },
    makePayload() {
      let payload = []

      // Individual team grades
      for (let user of this.APIData.users_data) {
        let studentpoints = []
        for (let p of user.data) {
          studentpoints.push(
            {
              "user_group_id": user.id,
              "grade_id": p.id,
              "points": +p.given_points
            }
          )
        }
        payload.push.apply(payload, studentpoints)
      }

      // Whole team grades
      let user_ids = this.APIData.users_data.map(u => u.id)
      for (let user_id of user_ids) {
        let studentpoints = []
        for (let p of this.APIData.project_data) {
          studentpoints.push(
            {
              "user_group_id": user_id,
              "grade_id": p.id,
              "points": +p.given_points
            }
          )
        }
        payload.push.apply(payload, studentpoints)
      }
      return payload
    },
    currentPoints(devData) {
      let student_total = devData.map(p => +p.given_points)
      let project_total = this.APIData.project_data.map(p => +p.given_points)
      return _.sum(student_total) + _.sum(project_total)
    },
    maxPoints() {
      let student_total = this.APIData.users_data[0].data.map(p => +p.total)
      let project_total = this.APIData.project_data.map(p => +p.total)
      return _.sum(student_total) + _.sum(project_total)
    }
  },
  created() {
    // Since Kristjan is a spicy boi, he decided it would be a good idea 
    // to change the order of grade data that comes in from the endpoint
    // for only the new milestones !!!! @markaa 11 apr 2022
    this.newendpoint = this.$route.params.msid > 3

    Api.get('/projects/' + this.$route.params.repoid + "/milestone/" + this.$route.params.msid + "/")
      .then(response => {
        this.APIData = response.data.data

        this.APIData.project_data.forEach(d => d.given_points = +d.given_points)
        this.APIData.users_data.forEach(d => d.data.forEach(d => d.given_points = +d.given_points ))

        //this.updateRadar()

        for (let dev of this.APIData.users_data) this.devColours[dev.username] = dev.colour
      })
      .catch(err => {
        console.log(err)
      })

    Api.get('/projects/' + this.$route.params.repoid + "/milestone/" + this.$route.params.msid + "/time_spent/")
      .then(response => {
        this.gittimedata = response.data
      })
      .catch(err => {
        console.log(err)
      })
  },
  computed: {
  },
}
</script>
