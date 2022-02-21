<template>

  <svg :viewBox="`0 0 ${width} ${height}`" id="gittime" />

</template>

<script>
import * as d3 from 'd3'
const width = 800
const height = 400
let data

export default {
  name: "GitTime",
  data() {
    return {
      width, height,
      data,
      dataLoaded: false,
    }
  },
  created() {
    d3.json("/gittimemockdatams.json")
      .then(d => {
        this.data = d
        this.dataLoaded = true
        d.map(c => Object.assign(c, { datetime: d3.isoParse(c.datetime) }))
      })
  },
  mounted() {
    this.renderGraph()
  },
  watch: {
    dataLoaded() {
      if (!this.dataLoaded) return
      this.renderGraph()
    }
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
        .range([margins.left, width - margins.right])

      let y = d3.scaleLinear()
        .domain([24, 0])
        .range([height - margins.bottom, margins.top])

      let z = (datetime) => {
        // return 0 if it is Saturday or Sunday
        if (datetime.getDay() == 0 || datetime.getDay() == 6)
          return 0;

        // return 1 if commit was made between 8 AM and 5 PM
        // otherwise return 0
        return (datetime.getHours() >= 8 && datetime.getHours() < 17) ? 1 : 0;
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
      // Dots

      svg.append("g")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.datetime))
        .attr("cy", d => y(d.datetime.getHours() + d.datetime.getMinutes() / 60))
        //.attr("fill", d => z(d.datetime) == 1 ? '#66ee66' : "#0c6e0c")
        .attr("fill", d => z(d.datetime) == 1 ? '#666' : "#444")
        .attr("r", 4);

      

      return svg.node();
    }
  },
}
</script>

<style scoped>
</style>