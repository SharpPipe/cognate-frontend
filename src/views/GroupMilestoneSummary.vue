<template>
  <div class="group-milestone-summary">
    <div class="container">
      <h4>Milestone {{ $route.params.msid }}</h4>

      <h4>Teams</h4>

      <div v-if="APIData">
        <table class="table table-sm">
          <thead class="thead">
            <th scope="col"></th>
            <td scope="col"></td>
            <td scope="col" v-for="(c, i) in assessmentCategories" :key="i">
              <input type="checkbox" v-model="downloadCategories[i]" />
            </td>
            <th>
              <button class="btn-sm btn-secondary" @click="downloadCSV">
                Download CSV
              </button>
            </th>
          </thead>
          <thead class="thead">
            <th scope="col">Team</th>
            <td scope="col">Developer</td>
            <td scope="col" v-for="(c, i) in assessmentCategories" :key="i">
              {{ c }}
            </td>
            <th>Total</th>
          </thead>
          <tbody>
            <template v-for="repo in APIData">
              <tr v-for="(dev, i) in repo.users_data" :key="dev.id">
                <th
                  scope="row"
                  v-if="i === 0"
                  :rowspan="repo.users_data.length"
                >
                  {{ repo.project_name }}
                </th>
                <td>
                  <svg class="m-0 p-0" height="12" width="12">
                    <circle cx="6" cy="6" r="6" :fill="`#${dev.colour}`" />
                  </svg>
                  {{ dev.username }}
                </td>
                <td scope="row" v-for="point in dev.data" :key="point.id">
                  {{ +point.given_points }}/{{ +point.total }}
                </td>
                <span
                  v-for="teampoint in repo.project_data"
                  :key="teampoint.id"
                >
                  <td
                    scope="row"
                    v-if="i === 0"
                    :rowspan="repo.users_data.length"
                  >
                    <b>{{ +teampoint.given_points }}/{{ +teampoint.total }} </b>
                  </td>
                </span>
                <th scope="row">
                  {{ sumpoints(dev.data, repo.project_data) }}
                </th>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <center v-else>
        <LoadingAnimation />
      </center>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import LoadingAnimation from "../components/LoadingAnimation.vue";
import { keys, pickBy } from "lodash";

export default {
  name: "GroupMilestoneSummary",
  components: { LoadingAnimation },
  data() {
    return {
      APIData: null,
      assessmentCategories: {},
      downloadCategories: {},
    };
  },
  created() {
    const url =
      "groups/" +
      this.$route.params.groupid +
      "/milestone/" +
      this.$route.params.msid +
      "/";
    Api.get(url)
      .then((response) => {
        this.APIData = response.data.data;
        for (let c of this.APIData[0].users_data[0].data) {
          this.assessmentCategories[c.id] = c.name;
          this.downloadCategories[c.id] = true;
        }
        for (let c of this.APIData[0].project_data) {
          this.assessmentCategories[c.id] = c.name;
          this.downloadCategories[c.id] = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    sumpoints(devData, projectData) {
      let devSum = devData
        .map((x) => +x.given_points)
        .reduce((acc, item) => acc + item, 0);
      let projectSum = projectData
        .map((x) => +x.given_points)
        .reduce((acc, item) => acc + item, 0);
      return devSum + projectSum;
    },
    downloadCSV() {
      Api.post("groups/" + this.$route.params.groupid + "/assessment_csv/", {
        assessments: keys(pickBy(this.downloadCategories)),
      })
        .then((response) => {
          console.log(response.data);
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(new Blob([response.data]));
          const filename =
            "G" +
            this.$route.params.groupid +
            "MS" +
            this.$route.params.msid +
            ".csv";
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>