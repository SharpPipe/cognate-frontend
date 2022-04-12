<template>
  <svg v-if="colours" :viewBox="`0 0 ${width} ${height}`" id="gittime" />
</template>

<script>
import * as d3 from 'd3'
import _ from 'lodash'
const width = 800
const height = 400
let data

export default {
  name: "GitTime",
  props: ["gitdata", "colours"],
  data() {
    return {
      width, height,
      data: [],
    }
  },
  mounted() {
    this.data = this.gitdata.map(c => Object.assign(c, { time: d3.isoParse(c.time) }))
    this.data = this.timezoneOffset(this.data)
    this.data = this.underflow(this.data)
    console.log(this.colours)

    this.renderGraph(this.colours)
  },
  methods: {
    timezoneOffset(data) {
      _.forEach(data, d => { d.time = new Date(d.time.valueOf() + d.time.getTimezoneOffset() * 60 * 1000) })
      return data
    },
    underflow(data) {
      let newLines = []
      _.forEach(data, d => {
        let start = new Date(d.time.valueOf() - d.amount * 1000 * 60)
        if (d.time.getDate() !== start.getDate()) {
          let nextDayMinutes = d.time.getHours() * 60 + d.time.getMinutes() // + d.time.getSeconds() / 60 + d.time.getMilliseconds() / (60 * 1000)
          let prevDayMinutes = d.amount - nextDayMinutes
          newLines.push({
            amount: prevDayMinutes,
            user: d.user,
            title: d.title,
            gitlab_link: d.gitlab_link,
            time: new Date(new Date(d.time.toDateString()).valueOf() - 1)
          })

          d.amount = nextDayMinutes
        }
      })
      data.push.apply(data, newLines)
      return data

    },
    renderGraph(colours) {
      // Git Log code inspired by and definitely not directly stolen from 
      // https://observablehq.com/@webapelsin/git-log
      if (!this.data.length) return
      data = this.data
      let svg = d3.select('#gittime')
      let margins = ({ top: 20, right: 50, bottom: 30, left: 30 })

      // Axis
      let domainExtent = d3.extent(data, d => new Date(d.time.toDateString().valueOf()))
      domainExtent[0] = new Date(domainExtent[0].getTime() - 24 * 60 * 60 * 1000)
      domainExtent[1] = new Date(domainExtent[1].getTime() + 24 * 60 * 60 * 1000)

      let x = d3.scaleTime()
        .domain(domainExtent)
        .range([margins.left, width - margins.right])


      let y = d3.scaleLinear()
        .domain([24, 0])
        .range([height - margins.bottom, margins.top])


      let c = (devName, hover) => {
        if (hover) {
          return "#" + colours[devName] + "ff"
        }
        else {
          return "#" + colours[devName] + "aa"
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
      let groups = _.groupBy(data, d => d.user)
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
      let dayWidth = x(new Date("2000-01-01")) - x(new Date("2000-01-02"))

      svg.append("g")
        .attr("stroke", "#000")
        .selectAll("circle")
        .data(data)
        .enter().append("line")
        .attr("x1", d => x(new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate())))
        .attr("y1", d => y(d.time.getHours() + d.time.getMinutes() / 60))
        .attr("x2", d => x(new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate())))
        .attr("y2", d => y(d.time.getHours() + d.time.getMinutes() / 60 - (d.amount / 60)))
        .attr("stroke", d => {
          let col = c(d.user, false) 
          return col
        })
        .attr("stroke-width", -dayWidth)
        .attr("ref", "line")
        .on("mouseover", (event, d) => {
          //d3.select(this.$refs.line).style("fill", "aliceblue")
          d3.select(event.target).attr("stroke", d => c(d.user, true))
          div.transition()
            .duration(100)
            .style("opacity", 1);
          div.html(d.title + "<br/>" + d.amount + "min")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 60) + "px");
        })
        .on("mouseout", (event) => {
          d3.select(event.target).attr("stroke", d => c(d.user, false))
          div.transition()
            .duration(500)
            .style("opacity", 0);
        })
        .on("dblclick", (e, d) => {
          if (d.gitlab_link !== null) {
            console.log(d.gitlab_link)
            window.open(d.gitlab_link, "_blank")
          }
        })


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