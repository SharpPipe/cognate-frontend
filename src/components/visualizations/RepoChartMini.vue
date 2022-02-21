<template>
  <svg :width="width" :height="height">
      <rect v-for="(b, i) in bars" :key="i"
            :width="`${barWidth}`"
            :height="`${b * height}`"
            :fill="`hsl(90, 70%, ${10 + Math.floor(b* 25)}%)`"
            :transform="`translate(${i*barWidth}, ${height - b * height})`"
      />
  </svg>
</template>

<script>
//import * as d3 from 'd3'
const width  = 320
const height = 60
const barN   = 64
let barWidth = width / barN

export default {
  name: "GroupChartMini",
  data() {
    return {
      width, height,
      dataLoaded: false,
      bars: [],
      barWidth,
    }
  },
  created() {
    this.bars = Array.from(Array(barN)).map(()=>Math.random())
  },
}
</script>

<style scoped>

</style>