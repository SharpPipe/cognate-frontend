<template>
  <div id="gradingTree"></div>
</template>

<script>
import * as d3 from "d3";
const width = 1000;
const height = 1000;


let dx = 30;
let dy = width / 6;
let margin = { top: 20, right: 120, bottom: 20, left: 80 };

let tree = d3.tree().nodeSize([dx, dy]);
let diagonal = d3
  .linkHorizontal()
  .x((d) => d.y)
  .y((d) => d.x);

let root


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

export default {
  name: "CourseGradingTree",
  props: ["gradedata"],
  data() {
    return {
      width,
      height,
      selected: {
        id: null,
        data: { name: "", total: 0, description: "", subnodecount: 0},
      },
      root,
    };
  },
  beforeUpdate() {
    root = null
    document.getElementById("gradingTree").innerHTML = null
  },
  mounted() {
    this.$nextTick(() => {
      this.renderGraph()
    })
  },
  watch: {
    gradedata() {
      this.renderGraph()
    }
  },
  methods: {
    countSubnodes(node) {
      if (node.children === undefined || node.children === null) return 1
      let n = 0
      for (let c of node.children) n += this.countSubnodes(c)
      return n
    },
    renderGraph() {
      // Tidy Tree code inspired by and definitely not directly stolen from
      // https://observablehq.com/@asktree/interactive-tree-diagram-d3v4-v5
      // https://observablehq.com/@jacob-tu/collapsible-tree

      this.root = d3.hierarchy(this.gradedata);

      this.root.x0 = dy / 2;
      this.root.y0 = 0;


      this.root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth && d.data.name.length === -1) d.children = null;
      });

      this.update(this.root);
      document.getElementById("gradingTree").appendChild(svg.node());
      this.update(this.root);
      return svg.node();
    },
    update(source) {
      const duration = 250;
      const nodes = this.root.descendants().reverse();
      const links = this.root.links();

      // Compute the new tree layout.
      tree(this.root);

      let left = this.root;
      let right = this.root;
      this.root.eachBefore((node) => {
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
        .on("dblclick", (event, d) => {
          d.children = d.children ? null : d._children;
          this.update(d);
        })
        .on("click", (event, d) => {
          this.selected.id = d.data.id;
          this.selected.data.name = d.data.name;
          this.selected.data.total = d.data.total;
          this.selected.data.description = d.data.description;
          this.selected.data.subnodecount = this.countSubnodes(d)
          this.$emit('select', this.selected);
          this.update(d);
        });

      nodeEnter
        .append("circle")
        .attr("r", 12)
        .attr("fill", (d) => (d._children ? "#ccc" : "#ccc"))
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
      this.root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
  },
};
</script>
