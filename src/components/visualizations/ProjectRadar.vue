<template>
  <div>
    <svg :viewBox="`0 0 400 400`" id="reporadar" />
  </div>
</template>


<script>
import d3 from "@/assets/d3";

export default {
  name: "RepoRadar",
  props: ["radardata", "sprintNumber"],
  data() {
    return {
      defaultSprint: null
    }
  },

  mounted() {
    this.defaultSprint = this.sprintNumber

    this.drawChart(this.radardata, true);
  },
  methods: {
    onRadarDataChange() {
      d3.select("#reporadar").selectAll("*").remove(); // maybe add a sexy tween
      this.drawChart(this.radardata, this.defaultSprint === this.sprintNumber);
    },
    drawChart(radardata, isDefault) {
      // Radar code inspired by and definitely not directly stolen from
      // https://observablehq.com/@jacobtfisher/brand-identity-radar-chart
      const height = 400;
      const width = 400;
      const margin = 0;
      const radius = (height - margin * 2) / 2 - 1;
      const dotRadius = 4;
      const axisCircles = 5;
      //const axisLabelFactor = 1.3
      //const wrapWidth = 200
      const axesLength = radardata.length;
      const axesDomain = radardata.map((d) => d.axis);
      const maxValue = 5;

      let rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

      let angleSlice = (Math.PI * 2) / axesLength;

      let radarLine = d3
        .lineRadial()
        .curve(d3.curveCatmullRomClosed)
        .radius((d) => rScale(d))
        .angle((d, i) => i * angleSlice);

      const svg = d3.select("#reporadar");

      const containerWidth = width - margin * 2;
      const containerHeight = height - margin * 2;
      const container = svg
        .append("g")
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .attr(
          "transform",
          `translate(${width / 2 + margin}, ${height / 2 + margin})`
        );

      var axisGrid = container.append("g").attr("class", "axisWrapper");

      axisGrid
        .selectAll(".levels")
        .data(d3.range(1, axisCircles + 1).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", (d) => (radius / axisCircles) * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", 0.1);

      const axis = axisGrid
        .selectAll(".axis")
        .data(axesDomain)
        .enter()
        .append("g")
        .attr("class", "axis");

      axis
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr(
          "x2",
          (d, i) =>
            rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "y2",
          (d, i) =>
            rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .attr("class", "line")
        .style("stroke", () =>
          document.body.className === "bootstrap" ? "#fff" : "#191d21"
        )
        .style("stroke-width", "4px");

      // Labels
      const arc = d3.arc();
      axis
        .append("path")
        .attr("id", (d, i) => `textArc${i}`)
        .attr("d", (d, i) => {
          // Cutoff point is half the circle + little offset
          let angle = angleSlice * i;
          let offset = Math.PI / 16;
          if (
            angle < Math.PI / 2 + offset ||
            angle > (Math.PI * 3) / 2 - offset
          ) {
            // Top Half
            return arc({
              innerRadius: radius * 0.95,
              outerRadius: radius * 0.95,
              startAngle: angleSlice * i - angleSlice / 2 - 0.03,
              endAngle: angleSlice * i + angleSlice / 2 + 0.03,
            });
          } else {
            // Bottom Half
            return arc({
              innerRadius: radius * 0.95,
              outerRadius: radius * 0.95,
              startAngle: angleSlice * i + angleSlice / 2 + 0.03,
              endAngle: angleSlice * i - angleSlice / 2 - 0.03,
            });
          }
        })
        .attr("fill", "none")
        .attr("stroke", "none");

      axis
        .append("text")
        .attr("text-anchor", "middle")
        .append("textPath")
        .attr("href", (d, i) => `#textArc${i}`)
        .style("fill", "#ff7f0e")
        .attr("dominant-baseline", "middle")
        .attr("startOffset", "25%")
        .style("font-size", "20px")
        .style("font-weight", "400")
        .style("fill", "#6e6")
        .text((d) => d);

      // Line
      const c = "#66ee66";

      const plot = container
        .append("g")
        .selectAll("g")
        .data([radardata])
        .join("g")
        .attr("fill", isDefault ? c : "lightgray")
        .attr("fill-opacity", 0.25)
        .attr("stroke", isDefault ? c : "lightgray")
        .style("stroke_width", 2);
      
      plot
        .append("path")
          .attr("d", (d) => radarLine(d.map((v) => v.value))) 


      plot
        .selectAll("circle")
        .data((d) => d)
        .join("circle")
        .attr("r", dotRadius)
        .attr(
          "cx",
          (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .attr("fill-opacity", 1)

      return svg.node();
    },
  },
  watch: {
    sprintNumber() {
      this.onRadarDataChange()
    }
  },
};
</script>

<style scoped>
</style>