<template>
  <div class="milestone">
    <div class="container">
      <h2>Assessing configuration for the course {{ $route.params.name }}</h2>

      <div class="mb-4">
        <div class="input-group mb-2">
          <input
            type="text"
            class="form-control"
            placeholder="New assessment element with points worth"
            aria-label="Assessing element"
            aria-describedby="button-addon1"
            v-model="payload.name"
          />
          <select
            required
            class="form-control my-0 col-sm-2"
            v-model="payload.assessment_type"
          >
            <option value selected disabled hidden>Assessment Type</option>
            <option value="C">Custom</option>
            <option value="S">Sum</option>
            <option value="I">Min</option>
            <option value="M">Max</option>
            <option value="A">Automatic</option>
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
            >
              Add Node
            </button>
          </div>
        </div>

        <div v-if="payload.assessment_type == 'A'" class="input-group mb-2">
          <select
            required
            class="form-control my-0 col-3"
            v-model="payload.automation_type"
          >
            <option value selected disabled hidden>Automation Type</option>
            <option value="T">Time Spent Goal</option>
            <option value="L">Lines Added Goal</option>
          </select>
          <input
            type="number"
            class="form-control"
            v-model="payload.amount_needed"
          />
          <div class="input-group-append">
            <span v-if="payload.automation_type == 'T'" class="input-group-text"
              >hours of work done</span
            >
            <span v-if="payload.automation_type == 'L'" class="input-group-text"
              >lines added</span
            >
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

        <div class="row m-0">
          <div class="input-group mb-2 col px-0">
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
            <date-picker
              id="starttime"
              v-model="payload.start"
              disabled
              :config="options"
            ></date-picker>
            <div class="input-group-text rounded-0 mx-n1">to</div>
            <date-picker
              id="endtime"
              disabled
              v-model="payload.end"
              :config="options"
            ></date-picker>
          </div>

          <div class="mb-2 col-3 px-0 pl-2">
            <div class="input-group-text">
              Is Project Assessment Node? &nbsp;
              <input type="checkbox" v-model="payload.project_assessment" />
            </div>
          </div>
        </div>

        <div
          class="row rounded m-0 input-group"
          v-if="selectedNode.data.id !== 0"
        >
          <div
            class="col border border-right-0 border-secondary rounded-left pt-1"
          >
            Selected: &nbsp;
            <em class="font-weight-bold">{{ selectedNode.data.name }}</em>
            <br />Points worth: &nbsp;
            <em class="font-weight-bold">{{ formatedPoints }}</em>
            <br />Description: &nbsp;
            <em class="font-weight-bold">{{
              selectedNode.data.description
            }}</em>
            <div v-if="selectedNode.assessment_milestone">
              Start: &nbsp;
              <em class="font-weight-bold">{{
                selectedNode.assessment_milestone.start
              }}</em>
              <br />End: &nbsp;
              <em class="font-weight-bold">{{
                selectedNode.assessment_milestone.end
              }}</em>
            </div>
            <div v-else>
              Project assessment: &nbsp;
              <em class="font-weight-bold">{{
                selectedNode.project_assessment
              }}</em>
            </div>
          </div>

          <!-- Delete Button -->

          <div class style="display: grid">
            <button
              class="btn btn-outline-warning rounded-0 rounded-tr"
              data-target="#editNodeModal"
              data-toggle="modal"
              type="button"
            >
              Edit Node
            </button>
            <button
              class="btn btn-outline-info rounded-0"
              @click="copyNode"
              type="button"
            >
              Clone Node
            </button>
            <button
              class="btn btn-outline-danger rounded-0 rounded-br"
              data-target="#deleteNodeModal"
              data-toggle="modal"
              type="button"
            >
              Delete Node
            </button>
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
                  <h5 class="modal-title text-danger" id="deleteNodeModalLabel">
                    Delete Node {{ selectedNode.data.name }}
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you quite sure you want to delete this node?</p>
                  <p>
                    Deleting a node from the tree will unlink all children and
                    delete all user assessments that are directly tied to that
                    node.
                  </p>

                  <div class="border rounded p-2">
                    <span>Points worth: &nbsp;</span>
                    <em class="font-weight-bold h4">{{ formatedPoints }}</em>
                    <br />
                    <span v-if="selectedNode.data.description"
                      >Description: &nbsp;</span
                    >
                    <em class="font-weight-bold">{{
                      selectedNode.data.description
                    }}</em>
                  </div>

                  <div
                    v-if="selectedNode.data.subnodecount > 1"
                    class="alert alert-danger my-3"
                  >
                    This action will delete
                    {{ selectedNode.data.subnodecount }} subnodes too!
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    class="btn btn-outline-danger rounded"
                    data-dismiss="modal"
                    type="button"
                    @click="deleteNode"
                  >
                    Delete Node
                  </button>
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
                  <h5 class="modal-title text-warning" id="editNodeModalLabel">
                    Edit Node {{ selectedNode.data.name }}
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
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
                    <div v-if="selectedNode.assessment_milestone">
                      <date-picker
                        id="starttime"
                        v-model="selectedNode.assessment_milestone.start"
                        :config="options"
                        class="mb-2"
                      ></date-picker>
                      <date-picker
                        id="endtime"
                        v-model="selectedNode.assessment_milestone.end"
                        :config="options"
                      ></date-picker>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    class="btn btn-outline-success rounded"
                    data-dismiss="modal"
                    type="button"
                    @click="editNode"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CourseAssessmentTree
        v-if="graphData"
        :assessmentdata="graphData"
        v-on:select="updateSelected"
      />
    </div>
  </div>
</template>

<script>
import CourseAssessmentTree from "../components/visualizations/CourseAssessmentTreeLinear.vue";
import { Api } from "../axios-api";

// https://github.com/ankurk91/vue-bootstrap-datetimepicker
import datePicker from "vue-bootstrap-datetimepicker";
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

export default {
  name: "GroupAssessingTree",
  components: {
    CourseAssessmentTree,
    datePicker,
  },
  computed: {
    // https://stackoverflow.com/a/47204204/5188258
    formatedPoints() {
      return Math.round(this.selectedNode.data.total * 100) / 100;
    },
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
        assessment_type: "",
        project_assessment: false,
        start: "",
        end: "",
        description: "",
        automation_type: "",
        amount_needed: 0,
      },
      selectedNode: {
        id: null,
        assessment_milestone: null,
        project_assessment: false,
        data: {
          name: "",
          id: null,
          total: 0,
          description: "",
          subnodecount: 0,
        },
      },
      graphData: null,
      addedNode: null,
      deletedNode: null,
      groupid: this.$route.params.groupid,
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    forceUpdate() {
      this.key++;
    },
    resetSelected() {
      this.selectedNode = {
        id: null,
        data: { name: "", id: null, total: 0 },
      };
    },
    updateSelected(nodeData) {
      this.selectedNode = nodeData;
    },
    getTree() {
      Api.get("groups/" + this.groupid + "/assessment/")
        .then((response) => {
          this.graphData = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addNode() {
      // Milestone end time day inclusive
      if (document.getElementById("ms_check").checked) {
        this.payload.start = this.payload.start + "T00:00:00Z";
        this.payload.end = this.payload.end + "T23:59:00Z";
      }
      if (this.payload.name && this.selectedNode.id) {
        Api.post(
          "assessment_category/" + this.selectedNode.id + "/",
          this.payload
        )
          .then(() => {
            this.getTree();
          })
          .catch((err) => console.log(err));
      }
    },
    deleteNode() {
      // Don't delete the root, please
      if (this.selectedNode.data.id !== this.graphData.id) {
        Api.delete("assessment_category/" + this.selectedNode.id + "/")
          .then(() => {
            this.resetSelected();
            this.getTree();
          })
          .catch((err) => console.log(err));
      }
    },
    editNode() {
      let payload = {
        total: this.selectedNode.data.total,
        name: this.selectedNode.data.name,
        description: this.selectedNode.data.description,
      };
      if (this.selectedNode.assessment_milestone) {
        payload.start = this.selectedNode.assessment_milestone.start;
        payload.end = this.selectedNode.assessment_milestone.end;
        if (payload.start.length <= 10)
          payload.start = payload.start + "T00:00:00Z";
        if (payload.end.length <= 10) payload.end = payload.end + "T23:59:00Z";
      }
      Api.put("assessment_category/" + this.selectedNode.id + "/", payload)
        .then(() => {
          this.getTree();
        })
        .catch((err) => console.log(err));
    },
    copyNode() {
      Api.post("assessment_category/" + this.selectedNode.id + "/copy/").then(
        () => {
          this.$nextTick(() => {
            this.getTree();
          });
        }
      );
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
        end.disabled = true;
        start.value = "";
        end.value = "";
        this.payload.start = "";
        this.payload.end = "";
        this.payload.assessmentmilestone = false;
      }
    },
  },
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
.rounded-tr {
  border-top-right-radius: 0.25rem !important;
}
.rounded-br {
  border-bottom-right-radius: 0.25rem !important;
}
</style>