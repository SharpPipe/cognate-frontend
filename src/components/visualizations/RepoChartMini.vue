<template>
  <svg :width="width" :height="height" />
</template>

<script>
import d3 from '@/assets/d3'
import $ from "jquery";

const width = 320;
const height = 50;

export default {
  name: "GroupChartMini",
  props: ["ms_data", "k", "milestones"],
  data() {
    return {
      width,
      height,
    };
  },
  mounted() {
    if (this.k == undefined) return;

    this.makeChart();
  },
  methods: {
    makeChart() {
      if (this.k == undefined) return;

      let svg = d3.select("#repoms" + this.k);

      let x = d3
        .scaleLinear()
        .domain([0, 6])
        .range([20, width - 20]);

      //let color = ["#343a40", "#dc3545", "#fd7e14", "#ffc107", "#28a745"]
      let c = (points) => {
        if (points.reduce((x, y) => x + y, 0) === 0) return "#dc3545";
        if (points.includes(0)) return "#ffc107";
        return "#28a745";
      };

      // Tooltip
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });

      // Circles
      svg
        .append("g")
        .selectAll("circle")
        .data(this.milestones)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => x(i))
        .attr("cy", height / 2)
        .attr("r", 15)
        .attr("fill", (d) =>
          c(
            d.user_points
              .filter((u) => !u.name.includes("project"))
              .map((u) => +u.points)
          )
        )
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.6)
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .attr("data-html", true)
        .attr(
          "title",
          (d) =>
            "<b>Milestone " +
            d.milestone_id +
            "</b>" +
            d.user_points
              .map((u) => "<br/>" + u.name + ": " + Math.round(u.points))
              .join("")
        );

      return svg;
    },
  },
};
</script>
