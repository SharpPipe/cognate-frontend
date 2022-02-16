<template>
  <div class="milestone">
    <div class="container">
      <h2>Grading for the Course {{ $route.params.name }}</h2>

      <div class="mb-4">
        <div class="input-group mb-2">
          <input
            type="text"
            class="form-control"
            placeholder="New grade element with points worth"
            aria-label="Grade element"
            aria-describedby="button-addon1"
            v-model="payload.name"
          />
          <select required class="form-control my-0 col-sm-2" v-model="payload.grade_type">
            <option value selected disabled hidden>Grade Type</option>
            <option value="C">Custom</option>
            <option value="S">Sum</option>
            <option value="I">Min</option>
            <option value="M">Max</option>
          </select>
          <input
            type="number"
            class="form-control col-sm-1"
            placeholder="points worth"
            aria-label="points worth"
            aria-describedby="button-addon-points"
            v-model="payload.total"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-success"
              type="button"
              id="button-addon2"
              @click="addNode"
            >Add Node</button>
          </div>
        </div>
        <div class="input-group mb-2">
          <input
            type="text"
            class="form-control"
            placeholder="Description"
            aria-label="description"
            aria-describedby="description"
            v-model="payload.description"
          />
        </div>
        <div class="input-group mb-2">
          <div class="input-group-prepend">
            <div class="input-group-text">
              Is Milestone? &nbsp;
              <input
                id="ms_check"
                type="checkbox"
                @change="toggleMilestone"
                aria-label="Checkbox for following text input"
              />
            </div>
          </div>
          <date-picker id="starttime" v-model="payload.start" disabled :config="options"></date-picker>
          <div class="input-group-text rounded-0 mx-n1">to</div>
          <date-picker id="endtime" disabled v-model="payload.end" :config="options"></date-picker>
        </div>
        <div class="input-group d-flex">
          <div class="input-group-prepend flex-grow-1">
            <label class="input-group-text flex-grow-1" for="inputGroupSelect01">
              Selected: &nbsp;
              <em class="font-weight-bold">{{ selectedNode.data.name, }}</em>
            </label>
            <label class="input-group-text flex-shrink-1" for="inputGroupSelect01">
              Points worth: &nbsp;
              <em class="font-weight-bold">{{ formatedPoints }}</em>
            </label>
          </div>
          <div class="input-group-append w-20">
            <button
              class="btn btn-outline-danger"
              type="button"
              id="button-addon2"
              @click="deleteNode"
            >Delete Node</button>
          </div>
        </div>
      </div>

      <CourseGradingTree
        v-if="graphData"
        :gradedata="graphData"
        :addnodes="addedNode"
        :delnodes="deletedNode"
        v-on:select="updateSelected"
      />
    </div>
  </div>
</template>

<script>
import CourseGradingTree from "../components/visualizations/CourseGradingTreeLinear.vue";
import { Api } from "../axios-api";
import { mapState } from 'vuex'


// https://github.com/ankurk91/vue-bootstrap-datetimepicker
import datePicker from "vue-bootstrap-datetimepicker";
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

export default {
  name: "Grading",
  components: {
    CourseGradingTree,
    datePicker,
  },
  computed: {
    // https://stackoverflow.com/a/47204204/5188258
    ...mapState(['APIData']),
    formatedPoints() {
      return Math.round(this.selectedNode.data.total * 100) / 100
    }
  },
  data() {
    return {
      date: new Date(),
      options: {
        format: "YYYY-MM-DD",
        useCurrent: false,
        locale: "en-gb",
      },
      payload: {
        name: "",
        total: 5,
        grade_type: "",
        start: "",
        end: "",
        description: "",
      },
      selectedNode: {
        id: null,
        data: { name: "", id: null, total: 0 },
      },
      graphData: null,
      addedNode: null,
      deletedNode: null,
      groupid: this.$route.params.id
    };
  },
  created() {
    this.getTree()
  },
  methods: {
    resetSelected() {
      this.selectedNode = {
        id: null,
        data: { name: "", id: null, total: 0 },
      }
    },
    updateSelected(nodeData) {
      this.selectedNode = nodeData
      console.log(this.selectedNode)
    },
    getTree() {
      Api.get("groups/" + this.groupid + "/grading/")
        .then((response) => {
          this.$store.state.APIData = response.data;
          this.graphData = response.data
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addNode() {

      if (this.payload.name && this.selectedNode.data.name) {
        Api.post(
          "grade_category/" + this.selectedNode.id + "/",
          this.payload
        )
          .then(() => {
            this.getTree()
          })
          .catch((err) => console.log(err));
      }
    },
    deleteNode() {
      // Don't delete the root, please
      if (this.selectedNode.data.id !== this.graphData.id) {
        Api.delete("grade_category/" + this.selectedNode.id + "/")
          .then(() => {
            this.resetSelected()
            this.getTree()
          })
          .catch((err) => console.log(err));
      }
    },
    toggleMilestone() {
      let check = document.getElementById("ms_check").checked;
      let start = document.getElementById("starttime");
      let end = document.getElementById("endtime");
      if (check) {
        start.disabled = false;
        end.disabled = false;
      } else {
        start.disabled = true;
        end.disabled = true
        start.value = "";
        end.value = ""
        this.payload.start = ""
        this.payload.end = ""
        this.payload.grademilestone = false
      }
    },
  }
};
</script>

<style scoped>
select:invalid,
select option[value=""] {
  color: #6c757d;
}
</style>