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
        <div class="row rounded m-0 bg-dark input-group" v-if="selectedNode.data.id !== 0">
          <div class="col border border-right-0 border-secondary rounded-left">
            Selected: &nbsp;
            <em class="font-weight-bold">{{ selectedNode.data.name, }}</em>
            <br />Points worth: &nbsp;
            <em class="font-weight-bold">{{ formatedPoints }}</em>
            <br />Description: &nbsp;
            <em class="font-weight-bold">{{ selectedNode.data.description }}</em>
          </div>

          <!-- Delete Button -->

          <div class="input-group-append w-20">
            <button
              class="btn btn-outline-warning"
              data-target="#editNodeModal"
              data-toggle="modal"
              type="button"
            >Edit Node</button>
            <button
              class="btn btn-outline-danger rounded-r"
              data-target="#deleteNodeModal"
              data-toggle="modal"
              type="button"
            >Delete Node</button>
          </div>

          <!-- Delete Modal -->
          <div
            class="modal fade"
            id="deleteNodeModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="deleteNodeModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5
                    class="modal-title text-danger"
                    id="deleteNodeModalLabel"
                  >Delete Node {{ selectedNode.data.name }}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you quite sure you want to delete this node?</p>
                  <p>Deleting a node from the tree will unlink all children and delete all user grades that are directly tied to that node.</p>

                  <div class="border rounded p-2">
                    <span>Points worth: &nbsp;</span>
                    <em class="font-weight-bold h4">{{ formatedPoints }}</em>
                    <br />
                    <span v-if="selectedNode.data.description">Description: &nbsp;</span>
                    <em class="font-weight-bold">{{ selectedNode.data.description }}</em>
                  </div>

                  <div
                    v-if="selectedNode.data.subnodecount > 1"
                    class="alert alert-danger my-3"
                  >This action will delete {{ selectedNode.data.subnodecount }} subnodes too!</div>
                </div>
                <div class="modal-footer">
                  <button
                    class="btn btn-outline-danger rounded"
                    data-dismiss="modal"
                    type="button"
                    @click="deleteNode"
                  >Delete Node</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Modal -->
          <div
            class="modal fade"
            id="editNodeModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="editNodeModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5
                    class="modal-title text-warning"
                    id="editNodeModalLabel"
                  >Edit Node {{ selectedNode.data.name }}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control mb-2"
                      placeholder="Node name"
                      v-model="selectedNode.data.name"
                    />
                    <input
                      type="text"
                      class="form-control mb-2"
                      placeholder="Description"
                      v-model="selectedNode.data.description"
                    />
                    <input
                      type="number"
                      class="form-control mb-2"
                      placeholder="Points worth"
                      v-model="selectedNode.data.total"
                    />
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    class="btn btn-outline-success rounded"
                    data-dismiss="modal"
                    type="button"
                    @click="editNode"
                  >Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CourseGradingTree v-if="graphData" :gradedata="graphData" v-on:select="updateSelected" />
    </div>
  </div>
</template>

<script>
import CourseGradingTree from "../components/visualizations/CourseGradingTreeLinear.vue";
import { Api } from "../axios-api";


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
        data: { name: "", id: null, total: 0, description: "", subnodecount: 0 },
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
    forceUpdate() {
      this.key++
    },
    resetSelected() {
      this.selectedNode = {
        id: null,
        data: { name: "", id: null, total: 0 },
      }
    },
    updateSelected(nodeData) {
      this.selectedNode = nodeData
    },
    getTree() {
      Api.get("groups/" + this.groupid + "/grading/")
        .then((response) => {
          this.graphData = response.data
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addNode() {
      // Milestone end time day inclusive
      if (document.getElementById("ms_check").checked) {
        this.payload.start = this.payload.start + "T00:00:00Z"
        this.payload.end = this.payload.end + "T23:59:00Z"
      }

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
    editNode() {
      let payload = {
        total: this.selectedNode.data.total,
        name: this.selectedNode.data.name,
        description: this.selectedNode.data.description,
      }
      Api.put("grade_category/" + this.selectedNode.id + "/", payload)
        .then(() => {
          this.getTree()
        })
        .catch((err) => console.log(err));
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
.rounded-r {
  border-top-right-radius: 0.25rem !important;
  border-bottom-right-radius: 0.25rem !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>