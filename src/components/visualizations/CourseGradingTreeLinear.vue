<template>
  <div id="divid">
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
        <select
          required
          class="form-control my-0 col-sm-2"
          v-model="payload.grade_type"
        >
          <option value="" selected disabled hidden>Grade Type</option>
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
          >
            Add Component
          </button>
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
      <div class="input-group d-flex">
        <div class="input-group-prepend flex-grow-1">
          <label class="input-group-text flex-grow-1" for="inputGroupSelect01">
            Selected: &nbsp;
            <em class="font-weight-bold">{{ currentNode.data.name, }} </em>
          </label>
          <label
            class="input-group-text flex-shrink-1"
            for="inputGroupSelect01"
          >
            Points worth: &nbsp;
            <em class="font-weight-bold">{{ currentNode.data.total, }} </em>
          </label>
        </div>
        <div class="input-group-append w-20">
          <button
            class="btn btn-outline-danger"
            type="button"
            id="button-addon2"
            @click="deleteNode"
          >
            Delete Node
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { Api } from "../../axios-api";
import { mapState } from "vuex";
// https://github.com/ankurk91/vue-bootstrap-datetimepicker
import datePicker from "vue-bootstrap-datetimepicker";
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
const width = 932;
const height = 932;
let data;

export default {
  name: "CourseGradingTree",
  props: ["gradedata"],
  computed: mapState(["APIData"]),
  components: {
    datePicker,
  },
  data() {
    return {
      date: new Date(),
      options: {
        format: "YYYY-MM-DD",
        useCurrent: false,
        locale: "en-gb",
      },
      width,
      height,
      data,
      dataLoaded: false,
      currentNode: {
        id: null,
        data: { name: "", id: null, total: 0 },
      },
      payload: {
        name: "",
        total: 5,
        grade_type: "",
        start: "",
        end: "",
        description: "",
      },
      graph: null,
      rootId: null,
    };
  },
  created() {
    /*     d3.json("/games.json").then((d) => {
      this.data = d;
      this.dataLoaded = true;
    }); */
  },
  mounted() {
    this.data = this.gradedata;
    function refactor(data = null) {
      return data;
    }
    this.rootId = this.gradedata.id;
    this.data = refactor(this.gradedata);

    this.dataLoaded = true;
    //this.renderGraph();
  },
  watch: {
    dataLoaded() {
      this.renderGraph();
    },
  },
  methods: {
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
    addNode() {
      console.log(this.payload);
      if (this.payload.name && this.currentNode.data.name) {
        Api.post(
          "grade_category/" + this.currentNode.data.id + "/",
          this.payload
        )
          .then(() => {
            this.$router.go();
          })
          .catch((err) => console.log(err));
      }
    },
    deleteNode() {
      if (this.currentNode.data.id !== this.gradedata.id) {
        // don't delete the root, please
        Api.delete("grade_category/" + this.currentNode.data.id + "/")
          .then(() => {
            this.currentNode = null;
            this.$router.go();
          })
          .catch((err) => console.log(err));
      }
    },
    renderGraph() {
      // Tidy Tree code inspired by and definitely not directly stolen from
      // https://observablehq.com/@asktree/interactive-tree-diagram-d3v4-v5
      // https://observablehq.com/@jacob-tu/collapsible-tree
      if (!this.dataLoaded) return;
      //let reftothis = this
      data = this.data;

      let self = this;

      let dx = 30;
      let dy = width / 6;
      let margin = { top: 20, right: 120, bottom: 20, left: 80 };

      let tree = d3.tree().nodeSize([dx, dy]);
      let diagonal = d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x);

      const root = d3.hierarchy(data);

      root.x0 = dy / 2;
      root.y0 = 0;

      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth && d.data.name.length === -1) d.children = null;
      });

      const svg = d3
        .create("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "16px sans-serif")
        .style("user-select", "none");

      const gLink = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#6e6")
        .attr("stroke-opacity", 0.3)
        .attr("stroke-width", 5);

      const gNode = svg
        .append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

      function update(source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore((node) => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + margin.top + margin.bottom;

        const transition = svg
          .transition()
          .duration(duration)
          .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
          .tween(
            "resize",
            window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
          );

        // Update the nodes…
        const node = gNode.selectAll("g").data(nodes, (d) => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node
          .enter()
          .append("g")
          .attr("transform", () => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", (event, d) => {
            self.currentNode.data.name = d.data.name;
            self.currentNode.data.id = d.data.id;
            self.currentNode.data.total = d.data.total;
            console.log(d.data);
            d.children = d.children ? null : d._children;
            update(d);
          });

        nodeEnter
          .append("circle")
          .attr("r", 12)
          .attr("fill", (d) => (d._children ? "#444" : "#aaa"))
          .attr("stroke-width", 10);

        nodeEnter
          .append("text")
          .attr("dy", "0.31em")
          .attr("x", 0)
          .attr("text-anchor", "middle")
          .style("font", "10px sans-serif")
          .text((d) => Math.round(d.data.total));

        nodeEnter
          .append("text")
          .attr("dy", "0.31em")
          .attr("x", (d) => (d._children ? -18 : 18))
          .attr("text-anchor", (d) => (d._children ? "end" : "start"))
          .text((d) => d.data.name)
          .clone(true)
          .lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 5)
          .attr("stroke", "#eeeeeedd");

        // Transition nodes to their new position.
        //const nodeUpdate = node
        node
          .merge(nodeEnter)
          .transition(transition)
          .attr("transform", (d) => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        //const nodeExit = node
        node
          .exit()
          .transition(transition)
          .remove()
          .attr("transform", () => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path").data(links, (d) => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link
          .enter()
          .append("path")
          .attr("d", () => {
            const o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
          });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition).attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link
          .exit()
          .transition(transition)
          .remove()
          .attr("d", () => {
            const o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
          });

        // Stash the old positions for transition.
        root.eachBefore((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      update(root);
      document.getElementById("divid").appendChild(svg.node());
      return svg.node();
    },
  },
};
</script>

<style >
select:invalid,
select option[value=""] {
  color: #6c757d;
}
</style>