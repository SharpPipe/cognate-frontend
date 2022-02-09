<template>
  <div class="repo">
    <div class="container">
      <h4>{{ APIData.project_name }}</h4>
      <div class="row m-1">
        <div class="col-4 p-0" id="repoRadarArea">
          <RepoRadar :radardata="radarData"/>
        </div>
        <div class="col-8 p-0" id="gitTimeArea">
          <GitTime  />
        </div>
      </div>

      <div class="form-group col-4">
        <label>Management</label>
        <input type="range" min="0" max="10" v-model="radarData[0].value" class="form-control-range"  />

        <label>Tests</label>
        <input type="range" min="0" max="10" v-model="radarData[1].value" class="form-control-range" />

        <label>Issues</label>
        <input type="range" min="0" max="10" v-model="radarData[2].value" class="form-control-range" />

        <label>Time Spent</label>
        <input type="range" min="0" max="10" v-model="radarData[3].value" class="form-control-range" />

        <label>Code lines</label>
        <input type="range" min="0" max="10" v-model="radarData[4].value" class="form-control-range" />

        <label>Style</label>
        <input type="range" min="0" max="10" v-model="radarData[5].value" class="form-control-range" />

      </div>
    </div>
  </div>
</template>

<script>
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
export default {
  name: 'Repo',
  components: {
    GitTime,
    RepoRadar,
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
      }
    }
  },
  watch: {
    radarData(change) {
      console.log(change)
    }
  }
}
</script>
