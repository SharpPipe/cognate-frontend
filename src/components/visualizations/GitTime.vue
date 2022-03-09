<template>
  <svg :viewBox="`0 0 ${width} ${height}`" id="gittime" />
</template>

<script>
import * as d3 from 'd3'
import { Api } from "../../axios-api";
import _ from 'lodash'
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
    this.timeRange[0] = d3.isoParse(this.timeRange[0])
    this.timeRange[1] = d3.isoParse(this.timeRange[1])
    Api.get('/projects/' + this.$route.params.repoid + "/milestone/" + this.$route.params.msid + "/time_spent/")
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
        .domain(d3.extent(data, d => d.datetime))
        //.domain(d3.extent(this.timeRange))
        .range([margins.left, width - margins.right])



      let y = d3.scaleLinear()
        .domain([24, 0])
        .range([height - margins.bottom, margins.top])


      let c = (devName, highlight) => {
        let scaled = 0
        scaled = (360 / 26) * (devName.charCodeAt(0) - 97)
        scaled += (360 / 26 ** 2) * (devName.charCodeAt(1) - 97)
        if (highlight) {
          return d3.hsl(scaled, 1, 0.7, 1)
        } else {
          return d3.hsl(scaled, 0.7, 0.6, 0.75)
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
        .attr("class", "gittime-tooltip")
        .style("opacity", 0)

      // Pie
      let groups = _.groupBy(data, d => d.author)
      _.forEach(groups, (value, key) => {
        groups[key] = value.reduce((total, item) => item.amount + total, 0)
      })
      let effort = []
      for (let k in groups) effort.push(groups[k])

      let pie = d3.pie().sort(null).padAngle(Math.PI / 180 * 5)(effort)

      let radius = height / 3;
      let pieNode = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .attr("opacity", 0.3)

      let arcs = pieNode.selectAll(".arc")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "arc")

      arcs.append("path")
        .attr("d", d => d3.arc().outerRadius(radius).innerRadius(radius * 0.66)(d))
        .attr("fill", d => c(Object.keys(groups).find(key => groups[key] === d.data), false))

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
        .attr("ref", "line")
        .on("mouseover", (event, d) => {
          //d3.select(this.$refs.line).style("fill", "aliceblue")
          d3.select(event.target).attr("stroke", d => c(d.author, true))
          div.transition()
            .duration(100)
            .style("opacity", 1);
          div.html(d.subject + "<br/>" + d.amount + "min")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 60) + "px");
        })
        .on("mouseout", (event) => {
          d3.select(event.target).attr("stroke", d => c(d.author, false))
          div.transition()
            .duration(500)
            .style("opacity", 0);
        })
        .on("click", (e, d) => {
          console.log(d.datetime)


        })



      /*       svg.append("text")
              .attr("dy", 15)
              .attr("dx", width / 2 - 60)
              .attr("fill", "#666")
              .text("Sprint 1 time data") */


      return svg.node();
    }
  },
}
</script>

<style >
.gittime-tooltip {
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