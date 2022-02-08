<template>
  <svg :viewBox="`0 0 ${width} ${height}`">
      <rect v-for="(b, i) in bars" :key="i"
            :width="`${barWidth}`"
            :height="`${b * height}`"
            :fill="`hsl(90, 100%, ${10 + Math.floor(b* 25)}%)`"
            :transform="`translate(${i*barWidth}, ${height - b * height})`"
      />
  </svg>
</template>

<script>
import * as d3 from 'd3'
const width  = 800
const height = width / 2
const barN   = 16
let barWidth = width / barN
let data

export default {
  name: "GitTime",
  data() {
    return {
      width, height,
      barWidth,
      data,
    }
  },
  created() {
    this.bars = Array.from(Array(barN)).map(()=>Math.random())

    this.data = d3.json('/gittimemockdata.json')



  },
}
</script>

<style scoped>

</style>