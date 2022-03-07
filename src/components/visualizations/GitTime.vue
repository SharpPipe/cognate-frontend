<template>
  <svg :viewBox="`0 0 ${width} ${height}`" id="gittime" />
</template>

<script>
import * as d3 from 'd3'
import { Api } from "../../axios-api";
const width = 800
const height = 400
let data

export default {
  name: "GitTime",
  props: ["timeRange", "milestones"],
  data() {
    return {
      width, height,
      data: [],
      dataLoaded: false,
    }
  },
  watch: {
    dataLoaded() {
      if (!this.dataLoaded) return
      this.renderGraph()
    }
  },
  mounted() {
    if (!this.dataLoaded) return
    this.renderGraph()
  },
  created() {
    Api.get('/projects/' + this.$route.params.repoid + "/milestone/" + 1 + "/time_spent/")
      .then(response => {
        this.data = response.data.map(c => Object.assign(c, { datetime: d3.isoParse(c.datetime) }))
        this.dataLoaded = true
      })
      .catch(err => {
        console.log(err)
      })

  },
  methods: {
    renderGraph() {
      // Git Log code inspired by and definitely not directly stolen from 
      // https://observablehq.com/@webapelsin/git-log
      if (!this.dataLoaded) return
      data = this.data
      let svg = d3.select('#gittime')
      let margins = ({ top: 20, right: 50, bottom: 30, left: 50 })
      // axis

      let x = d3.scaleTime()
        //.domain(d3.extent(data, d => d.datetime))
        .domain(d3.extent(this.timeRange))
        .range([margins.left, width - margins.right])



      let y = d3.scaleLinear()
        .domain([24, 0])
        .range([height - margins.bottom, margins.top])


      let c = (devName, highlight) => {
        let scaled = 0
        scaled = (360 / 26) * (devName.charCodeAt(0) - 97)
        scaled += (360 / 26 ** 2) * (devName.charCodeAt(1) - 97)
        if (highlight) {
          return d3.hsl(scaled, 1, 0.7, 0.8)
        } else {
          return d3.hsl(scaled, 0.7, 0.6, 0.8)
        }
      }

      let xAxis = g => g
        .attr("transform", `translate(0,${height - margins.bottom})`)
        .call(d3.axisBottom(x).tickSize(-height + margins.top + margins.bottom))
        .call(g => g.select(".domain").attr('stroke', '#d8dbdb'))
        .call(g => g.selectAll("line").attr('stroke', '#d8dbdb').attr('stroke-opacity', '0.3'))

      let yAxis = g => g
        .attr("transform", `translate(${margins.left},0)`)
        .call(d3.axisRight(y).tickSize(width - margins.left - margins.right).tickFormat(v => v + ':00'))
        .call(g => g.select(".domain").attr('stroke', '#d8dbdb'))
        .call(g => g.selectAll("line").attr('stroke', '#d8dbdb').attr('stroke-opacity', '0.3'))

      svg.append("g").call(xAxis)
      svg.append("g").call(yAxis)

      // Tooltip
      let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

      // Lines
      let dayWidth = x(data[0].datetime) - x(data[0].datetime.setDate(data[0].datetime.getDate() + 1))

      svg.append("g")
        .attr("stroke", "#000")
        .selectAll("circle")
        .data(data)
        .enter().append("line")
        .attr("x1", d => x(d.datetime))
        .attr("y1", d => y(d.datetime.getHours() + d.datetime.getMinutes() / 60))
        .attr("x2", d => x(d.datetime))
        .attr("y2", d => y((d.datetime.getHours() + d.datetime.getMinutes() / 60) - (d.amount / 60)))
        .attr("stroke", d => c(d.author, false))
        .attr("stroke-width", -dayWidth)
        .attr("r", 8)
        .on("mouseover", (event, d) => {
          div.transition()
            .duration(100)
            .style("opacity", 1);
          div.html(d.subject + "<br/>" + d.amount + "min")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 60) + "px");
        })
        .on("mouseout", () => {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        })
        .on("click", (e, d) => {
          console.log(d.datetime)


        })

      svg.append("text")
        .attr("dy", 15)
        .attr("dx", width / 2 - 60)
        .attr("fill", "#666")
        .text("Sprint 1 time data")


      return svg.node();
    }
  },
}
</script>

<style >
.tooltip {
  position: absolute;
  text-align: center;
  padding: 2px;
  font: 16px sans-serif;
  background: #333;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}
</style>