<template>
  <div class="repo">
    <div class="container">
      <h4>{{ APIData.project_name }}</h4>
      <ProgressBar
        class="mb-2"
        :currentPoints="currentPointsNew"
        :minCoursePoints="minCoursePoints"
        :maxCoursePoints="maxCoursePoints"
      />
      <div class="row m-1">
        <div class="col-4 p-0">
          <RepoRadar :radardata="radarData" />
          <div class="form-group">
            <label>Management</label>
            <input
              type="range"
              min="0"
              max="10"
              v-model="radarData[0].value"
              class="form-control-range"
            />

            <label>Tests</label>
            <input
              type="range"
              min="0"
              max="10"
              v-model="radarData[1].value"
              class="form-control-range"
            />

            <label>Issues</label>
            <input
              type="range"
              min="0"
              max="10"
              v-model="radarData[2].value"
              class="form-control-range"
            />

            <label>Time Spent</label>
            <input
              type="range"
              min="0"
              max="10"
              v-model="radarData[3].value"
              class="form-control-range"
            />

            <label>Code lines</label>
            <input
              type="range"
              min="0"
              max="10"
              v-model="radarData[4].value"
              class="form-control-range"
            />

            <label>Style</label>
            <input
              type="range"
              min="0"
              max="10"
              v-model="radarData[5].value"
              class="form-control-range"
            />
          </div>
        </div>
        <div class="col-8 p-0">
          <GitTime />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "../components/ProgressBar";
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
export default {
  name: 'Repo',
  components: {
    ProgressBar,
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
      },
      currentPoints: 34,
      minCoursePoints: 0,
      maxCoursePoints: 100,
    }
  },
  computed: {
    currentPointsNew() {
      let sum = 0
      for (var thing in this.radarData) {
        console.log(this.radarData[thing].value)
        sum += +this.radarData[thing].value
      }
      console.log(sum)
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

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  background-color: #dddddd;
  height: 10px;
  border-radius: 5px;
  box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.7);
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  background: #66ee66;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  height: 15px;
  width: 15px;
  background: #66ee66;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
</style>