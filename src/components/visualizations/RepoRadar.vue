<template>
  <div>
    <svg :viewBox="`0 0 400 400`" id="reporadar"/>
  </div>
</template>


<script>
import * as d3 from 'd3'

let data = [[
  { axis: "Management", value: 8 },
  { axis: "Tests", value: 5 },
  { axis: "Issues", value: 10 },
  { axis: "Time Spent", value: 8 },
  { axis: "Codelines", value: 8 },
  { axis: "Style", value: 4 }]
];

export default {
  name: "RepoRadar",
  props: ['radardata'],
  data() {
    return {
      data,
    }
  },

  mounted() {
    this.drawChart(this.radardata)
    // add watcher for radardata
    this.radardata.forEach(d => this.$watch(() => d.value, this.onRadarDataChange))

  },
  methods: {
    onRadarDataChange() {
      d3.select('svg').selectAll("*").remove()
      this.drawChart(this.radardata)
    },
    drawChart(radardata) {
      // Radar code inspired by and definitely not directly stolen from 
      // https://observablehq.com/@jacobtfisher/brand-identity-radar-chart
      data[0] = radardata
      const height = 400
      const width = 400
      const margin = 0
      const radius = (height - (margin * 2)) / 2 - 1
      const dotRadius = 4
      const axisCircles = 10
      //const axisLabelFactor = 1.3
      //const wrapWidth = 200
      const axesLength = 6
      const axesDomain = data[0].map(d => d.axis)
      const maxValue = 10
      /*
      function wrap(text, width) {
        text.each(function () {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.4, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
  
          while (words) {
            word = words.pop()
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }//wrap	
      */

      let rScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, radius])

      let angleSlice = Math.PI * 2 / axesLength

      let radarLine = d3.lineRadial()
        .curve(d3.curveCatmullRomClosed)
        .radius(d => rScale(d))
        .angle((d, i) => i * angleSlice)

      const svg = d3.select('#reporadar')

      const containerWidth = width - (margin * 2);
      const containerHeight = height - (margin * 2);
      const container = svg.append('g')
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .attr('transform', `translate(${(width / 2) + margin}, ${(height / 2) + margin})`);

      var axisGrid = container.append("g")
        .attr("class", "axisWrapper");

      axisGrid.selectAll(".levels")
        .data(d3.range(1, (axisCircles + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", (d) => radius / axisCircles * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", 0.1);

      const axis = axisGrid.selectAll(".axis")
        .data(axesDomain)
        .enter()
        .append("g")
        .attr("class", "axis");

      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "#191d21")
        .style("stroke-width", "4px");

      /*
      setTimeout(() => {
        axis.append("text")
          .attr("class", "legend")
          .style("font-size", "24px")
          .style("font-weight", "600")
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("dy", "0.35em")
          .attr("x", (d, i) => rScale(maxValue * axisLabelFactor * 1.11) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("y", (d, i) => rScale(maxValue * axisLabelFactor * 0.9) * Math.sin(angleSlice * i - Math.PI / 2))
          .text(d => d)
          .call(wrap, wrapWidth)
      }, 0);
      */

      let c = '#66ee66'
      const plots = container.append('g')
        .selectAll('g')
        .data(data)
        .join('g')
        .attr("fill", c)
        .style("fill-opacity", 0.8)
        .attr("stroke", c)
        .style("stroke_width", "3px");

      plots.append('path')
        .attr("d", d => radarLine(d.map(v => v.value)))
        .attr("fill", c)
        .attr("fill-opacity", 0.1)
        .attr("stroke", c)
        .attr("stroke-width", 2);

      plots.selectAll("circle")
        .data(d => d)
        .join("circle")
        .attr("r", dotRadius)
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill-opacity", 0.8);

      return svg.node();
    }
  },
}
</script>

<style scoped>
</style>