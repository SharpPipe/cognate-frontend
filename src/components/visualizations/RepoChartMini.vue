<template>
  <svg :width="width" :height="height" />
</template>

<script>
import * as d3 from 'd3'
const width = 320
const height = 50

export default {
  name: "GroupChartMini",
  props: ["ms_data", "k"],
  data() {
    return {
      width, height,
      msdata: [
        {
          status: 4,
          message: "All good",
          milestoneLinks: [],
        },
        {
          status: 3,
          message: "Graded, but points not in Moodle",
          milestoneLinks: [],
        },
        {
          status: 2,
          message: "Needs grading",
          milestoneLinks: [],
        },
        {
          status: 1,
          message: "Noone did anything",
          milestoneLinks: [],
        },
        {
          status: 0,
          message: "TBA",
          milestoneLinks: [],
        },
        {
          status: 0,
          message: "TBA",
          milestoneLinks: [],
        },
        {
          status: 0,
          message: "TBA",
          milestoneLinks: [],
        },
      ]
    }
  },
  mounted() {
    if (this.k == undefined) return

    this.makeChart()
  },
  methods: {
    makeChart() {
      if (this.k == undefined) return

      let svg = d3.select("#repoms" + this.k)

      let x = d3.scaleLinear()
        .domain([0,6])
        .range([20, width - 20])
      
      let color = ["#343a40", "#dc3545", "#fd7e14", "#ffc107", "#28a745"]

      // Tooltip
      let div = d3.select("body").append("div")
        .attr("class", "milestone-tooltip")
        .style("opacity", 0)
      
      // Circles
      svg.append("g")
        .selectAll("circle")
        .data(this.msdata)
        .enter().append("circle")
        .attr("cx", (d, i)=> x(i))
        .attr("cy", height/2)
        .attr("r", 15)
        .attr("fill", d=>color[d.status])
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.6)
        .on("mouseover", (event, d) => {
          var c = event.target
          var matrix = c.getScreenCTM()
            .translate(+c.getAttribute("cx"), +c.getAttribute("cy"))
          div.transition()
            .duration(100)
            .style("opacity", 1);
          let tooltip = div.html(d.message + "<br/>" + d.milestoneLinks)
          let w = tooltip.node().getBoundingClientRect().width
          tooltip.style("left", (window.pageXOffset + matrix.e - w / 2) + "px")
                 .style("top", (window.pageYOffset + matrix.f - 40) + "px")


          
          d3.select(c).attr("stroke", "lightgray")
        })
        .on("mouseout", (event) => {
          div.transition()
            .duration(100)
            .style("opacity", 0);
          d3.select(event.target).attr("stroke", "")
        })

     return svg
    }

  },
}
</script>

<style>
.milestone-tooltip {
  position: absolute;
  text-align: center;
  width: 50;
  padding: 2px;
  font: 16px sans-serif;
  background: #333;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}
</style>