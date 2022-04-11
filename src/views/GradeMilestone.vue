<template>
  <div class="container" v-if="APIData">
    <h3>{{ APIData.project_name }}</h3>
    <div class="row m-1">
      <!--  RepoRadar  -->
      <div class="col-4 p-0" v-if="radarData">
        <RepoRadar :radardata="radarData" :key="key" />
      </div>

      <!--  GitTime  -->
      <div class="col-8 px-3" v-if="gittimedata.length">
        <GitTime :gitdata="gittimedata" />
      </div>
      <div class="col-8 px-3 m-auto" v-else>
        <h4 class="text-center text-warning">NO SPENT TIME DATA AVAILABLE</h4>
      </div>
    </div>

    <!--  Grade Individual Student  -->
    <div class="row m-1">
      <div class="col" :v-if="APIData" v-for="dev in APIData.project_data" :key="dev.id">
        <RepoGradeStudent
          :points="dev.data"
          :devName="dev.username"
          :spentTime="dev.spent_time"
          v-on:pointsChanged="updateRadar"
        />
      </div>
    </div>

    <!--  Grade the whole team  -->
    <div class="row mx-3 p-1">
      <RepoGradeTeam 
        :radarData="radarData" 
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
import { Api } from "../axios-api"

export default {
  name: 'Repo',
  components: {
    GitTime,
    RepoRadar,
    RepoGradeStudent,
    RepoGradeTeam,
  },
  data() {
    return {
      key: 0,  // to force update
      msg: null,
      APIData: null,
      radarData: [
        { axis: "Retro", value: 0 },
        { axis: "Meeting", value: 0 },
        { axis: "Branch management", value: 0 },
        { axis: "Planning", value: 0 },
        { axis: "Issues", value: 0 },
      ],
      payload: {
        feedback: "",
        type: "PA",
        project: null,
      },
      gittimedata: null,
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
        this.payload.project = this.$route.params.repoid
        Api.post('/feedback/', this.payload)
          .catch(err => {
            console.log(err)
          })
      }
    },
    updateTeamPoints(event) {
      return event
    },
    updateRadar() {
      var numStudents = this.APIData.project_data.length
      this.radarData[2].value = 0
      this.radarData[3].value = 0
      this.radarData[4].value = 0
      for (var i in this.APIData.project_data) {
        this.radarData[2].value += this.APIData.project_data[i].data[2].given_points / numStudents
        this.radarData[3].value += this.APIData.project_data[i].data[3].given_points / numStudents
        this.radarData[4].value += this.APIData.project_data[i].data[4].given_points / numStudents
      }
      this.key++;
    },
    makePayload() {
      let payload = []
      for (let i in this.APIData.project_data) {
        this.APIData.project_data[i].data[0].given_points = this.radarData[0].value
        this.APIData.project_data[i].data[1].given_points = this.radarData[1].value
        let studentpoints = []
        for (let p in this.APIData.project_data[i].data) {
          studentpoints[p] = {
            "user_group_id": this.APIData.project_data[i].id,
            "grade_id": this.APIData.project_data[i].data[p].id,
            "points": +this.APIData.project_data[i].data[p].given_points
          }
        }
        payload.push.apply(payload, studentpoints)
      }
      return payload
    }
  },
  created() {
    Api.get('/projects/' + this.$route.params.repoid + "/milestone/" + this.$route.params.msid + "/")
      .then(response => {
        this.APIData = response.data.data
        this.APIData.project_data.forEach(d => d.data.forEach(d => { return d.given_points = +d.given_points }))
        // Initial team points
        console.log(this.APIData.project_data)
        this.radarData[0].value = this.APIData.project_data[0].data[0].given_points 
        this.radarData[1].value = this.APIData.project_data[0].data[1].given_points 
        this.updateRadar()
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
    currentPoints() {
      let sum = 0
      for (var grade in this.radarData) 
        sum += +this.radarData[grade].value
      return sum
    }
  },
}
</script>
