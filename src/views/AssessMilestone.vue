<template>
  <div class="container" v-if="APIData">
    <h3>{{ APIData.project_name }}</h3>
    <div class="row m-1">
      <!--  RepoRadar  -->
      <div class="col-4 p-1" v-if="radarData.length">
        <RepoRadar :radardata="radarData" :key="key" />
      </div>

      <!--  GitTime  -->
      <div class="col-8 px-1" v-if="gittimedata.length">
        <GitTime :gitdata="gittimedata" :colours="devColours" />
      </div>
      <div class="col-8 px-1 m-auto" v-else>
        <h4 class="text-center text-warning">NO SPENT TIME DATA AVAILABLE</h4>
      </div>
    </div>

    <!--  Assess Individual Student  -->
    <div class="row m-1">
      <div
        class="col"
        :v-if="APIData"
        v-for="dev in APIData.users_data"
        :key="dev.id"
      >
        <RepoDeveloper disableable="true" :devData="dev" @toggle="toggleUser" />
        <RepoAssessStudent
          :deactivatedUsers="deactivatedUsers"
          :deactivated="deactivatedUsers[dev.username]"
          :points="dev.data"
          v-on:pointsChanged="updateRadar()"
        />
        <ProgressBar
          class="mb-2"
          :currentPoints="currentPoints(dev)"
          minPoints="0"
          :maxPoints="maxPoints()"
        />
      </div>
    </div>

    <!--  Assess the whole team  -->
    <div class="row mx-3 p-1">
      <!--         :teamPoints="APIData.project_data" -->
      <RepoAssessTeam
        :teamPoints="APIData.project_data"
        v-on:teamPointsChanged="updateRadar()"
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
        <button class="btn btn-success" @click="submitAssessment">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
import RepoAssessStudent from "../components/RepoAssessStudent.vue";
import RepoAssessTeam from "../components/RepoAssessTeam.vue";
import RepoDeveloper from "../components/RepoDeveloper.vue";
import ProgressBar from "../components/ProgressBar.vue";
import { Api } from "../axios-api";
import _ from "lodash";

export default {
  name: "AssessMilestone",
  components: {
    GitTime,
    RepoRadar,
    RepoAssessStudent,
    RepoAssessTeam,
    RepoDeveloper,
    ProgressBar,
  },
  data() {
    return {
      key: 0, // to force update
      msg: null,
      APIData: null,
      radarData: [
        [
          { axis: "Retro", value: 0 },
          { axis: "Meeting", value: 0 },
          { axis: "Branch management", value: 0 },
          { axis: "Planning", value: 0 },
          { axis: "Issues", value: 0 },
        ],
      ],
      payload: {
        feedback: "",
        type: "PA",
        project: this.$route.params.repoid,
      },
      gittimedata: [],
      devColours: {},
      deactivatedUsers: {},
    };
  },
  methods: {
    toggleUser(user) {
      if (user[1]) this.deactivatedUsers[user[0]] = false;
      else this.deactivatedUsers[user[0]] = true;
      this.$forceUpdate();
    },
    submitAssessment() {
      let pl = this.makePayload();
      Api.post("/bulk_assess/", pl)
        .then(() => {
          this.msg = "Points saved!";
          console.log("Assessments posted");
        })
        .catch((err) => {
          console.log(err);
        });
      if (this.payload.feedback) {
        Api.post("/feedback/", this.payload).catch((err) => {
          console.log(err);
        });
      }
    },
    updateRadar() {
      let num_students = this.APIData.users_data.length;
      for (let radarAxis of this.radarData[0]) radarAxis.value = 0;

      for (let student of this.APIData.users_data) {
        for (let student_assessment of student.data) {
          let axis = this.radarData[0].find(
            (a) => a.axis == student_assessment.name
          );
          if (axis)
            axis.value += student_assessment.given_points / num_students;
        }
      }

      for (let project_assessment of this.APIData.project_data) {
        let axis = this.radarData[0].find(
          (a) => a.axis == project_assessment.name
        );
        if (axis) axis.value = project_assessment.given_points;
      }

      this.key++;
    },
    makePayload() {
      let payload = [];

      // Individual teammember assessments
      for (let user of this.APIData.users_data) {
        if (!this.deactivatedUsers[user.username]) {
          let studentpoints = [];
          for (let p of user.data) {
            studentpoints.push({
              user_group_id: user.id,
              assessment_id: p.id,
              points: +p.given_points,
            });
          }
          payload.push.apply(payload, studentpoints);
        }
      }

      // Whole team assessments
      let user_ids = this.APIData.users_data.map((u) => [u.id,u.username]);
      for (let user of user_ids) {
        if (!this.deactivatedUsers[user[1]]) {
          let studentpoints = [];
          for (let p of this.APIData.project_data) {
            studentpoints.push({
              user_group_id: user[0],
              assessment_id: p.id,
              points: +p.given_points,
            });
          }
          payload.push.apply(payload, studentpoints);
        }
      }
      return payload;
    },
    // This should be done whit $computed variables so it will be more reactive
    currentPoints(dev) {
      if (!this.deactivatedUsers[dev.username]) {
        let student_total = dev.data.map((p) => +p.given_points);
        let project_total = this.APIData.project_data.map(
          (p) => +p.given_points
        );
        return _.sum(student_total) + _.sum(project_total);
      } else {
        return 0;
      }
    },
    maxPoints() {
      let student_total = this.APIData.users_data[0].data.map((p) => +p.total);
      let project_total = this.APIData.project_data.map((p) => +p.total);
      return _.sum(student_total) + _.sum(project_total);
    },
  },
  created() {
    Api.get(
      "/projects/" +
        this.$route.params.repoid +
        "/milestone/" +
        this.$route.params.msid +
        "/"
    )
      .then((response) => {
        this.APIData = response.data.data;

        this.APIData.project_data.forEach(
          (d) => (d.given_points = +d.given_points)
        );
        this.APIData.users_data.forEach((d) =>
          d.data.forEach((d) => (d.given_points = +d.given_points))
        );

        this.updateRadar();

        for (let dev of this.APIData.users_data)
          this.devColours[dev.username] = dev.colour;
        for (let dev of this.APIData.users_data)
          this.deactivatedUsers[dev.username] = false;
      })
      .catch((err) => {
        console.log(err);
      });

    Api.get(
      "/projects/" +
        this.$route.params.repoid +
        "/milestone/" +
        this.$route.params.msid +
        "/time_spent/"
    )
      .then((response) => {
        this.gittimedata = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  computed: {},
};
</script>
