<template>
  <svg :width="width" :height="height" />
</template>

<script>
import d3 from '@/assets/d3'
import $ from "jquery";

const width = 320;
const height = 65;
const milestone_w = 40
const milestone_padding = 10

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

      // Tooltip
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });

      let svg = d3.select("#repoms" + this.k);

      const userCount = this.milestones[0].user_points.length

      // Barchart groups
      const groups = svg
        .selectAll('g')
        .data(this.milestones)
        .join('g')
          .attr('transform', (d, i) => (i===0) ? `translate(${milestone_w * i}, 0)` : `translate(${(milestone_w + milestone_padding) * i}, 0)`)  
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
        )

      // Bars
      groups 
        .selectAll('rect')
        .data(d => d.user_points)
        .join('rect')
          .attr('x', (d, i) => i * milestone_w / userCount)
          .attr('y', (d) => height - d.points)
          .attr('width', () => milestone_w / userCount)
          .attr('height', (d) => +d.points + 0.01)
          .style('fill', d => '#' + d.colour)
          .style('stroke', '#66666666')
          .style('stroke-width', 1)

      return svg;
    },
  },
};
</script>
