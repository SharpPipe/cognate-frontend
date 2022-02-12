<template>
  <div id="divid">
    <div class="mb-4">
      <div class="input-group mb-2">
        <input
          type="text"
          class="form-control"
          placeholder="New grade element"
          aria-label="Grade element"
          aria-describedby="button-addon1"
          v-model="newNode.name"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-success"
            type="button"
            id="button-addon2"
          >
            Add Child
          </button>
        </div>
      </div>
      <div class="input-group d-flex">
        <div class="input-group-prepend flex-grow-1">
          <label class="input-group-text flex-grow-1" for="inputGroupSelect01">
            Selected: &nbsp;
            <em class="font-weight-bold">{{ currentNode.data.name }} </em>
          </label>
        </div>
        <div class="input-group-append w-20">
          <button
            class="btn btn-outline-danger"
            type="button"
            id="button-addon2"
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
const width = 932;
const height = 932;
let data;

export default {
  name: "CourseGradingTree",
  data() {
    return {
      width,
      height,
      data,
      dataLoaded: false,
      currentNode: {
        id: null,
        data: { name: "" },
      },
      newNode: {
        id: 0,
        name: "",
      },
    };
  },
  created() {
    //d3.json("/gradingmockdata2.json")
    d3.json("/games.json").then((d) => {
      this.data = d;
      this.dataLoaded = true;
    });
  },
  mounted() {
    this.renderGraph();
  },
  watch: {
    dataLoaded() {
      if (!this.dataLoaded) return;
      console.log("data loaded");
      this.renderGraph();
      console.log("graph rendered");
    },
  },
  methods: {
    renderGraph() {
      // Git Log code inspired by and definitely not directly stolen from
      // https://observablehq.com/@aaronkyle/interactive-tree-diagram-d3v3
      // https://observablehq.com/@asktree/interactive-tree-diagram-d3v4-v5
      // https://observablehq.com/@esperanc/d3-radial-tidy-tree
      if (!this.dataLoaded) return;
      //let reftothis = this
      data = this.data;

      let self = this;

      let dx = 24;
      let dy = width / 6;
      let margin = { top: 10, right: 120, bottom: 10, left: 80 };

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
        if (d.depth && d.data.name.length !== 7) d.children = null;
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
            d.children = d.children ? null : d._children;
            update(d);
          });

        nodeEnter
          .append("circle")
          .attr("r", 10)
          .attr("fill", (d) => (d._children ? "#444" : "#aaa"))
          .attr("stroke-width", 10);

        nodeEnter
          .append("text")
          .attr("dy", "0.31em")
          .attr("x", (d) => (d._children ? -15 : 15))
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
</style>