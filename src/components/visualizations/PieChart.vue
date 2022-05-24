<template>
    <svg :width="width" :height="height" />
</template>

<script>
import d3 from '@/assets/d3'
const width = 64
const height = 64

export default {
    name: "PieChart",
    props: ["points", "k", "users"],
    data() {
        return {
            width, height,
        }
    },
    mounted() {
        if (this.k == undefined) return

        this.makeChart()
    },
    methods: {
        makeChart() {
            if (this.k == undefined) return

            let data = this.users 

            let svg = d3.select("#teampiechart" + this.k)

            const g = svg.append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')


            let pie = d3.pie()
              .value(d => d.points)

            let arc = d3.arc()
                .innerRadius(0)
                .outerRadius((height - 10) / 2)
                .cornerRadius(1)

            let arcs = g.selectAll('arc')
                .data(pie(data))
                .enter()
                .append('g')

            arcs.append("path")
                .attr("fill", (d) => "#" + d.data.colour + "ee")
                .attr("d", arc)

            return svg
        }

    },
}
</script>

<style scoped>
</style>