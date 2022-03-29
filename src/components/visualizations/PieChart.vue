<template>
    <svg :width="width" :height="height" />
</template>

<script>
import * as d3 from 'd3'
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

            //let data = Array.from(Array(3)).map(()=>Math.random())
            let data = this.users.map(o => +o.points) 
            console.log(data)

            let svg = d3.select("#teampiechart" + this.k)

            const g = svg.append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

            let color = ["#6610f2", "#dc3545", "#fd7e14", "#abbc11"]

            let pie = d3.pie()

            let arc = d3.arc()
                .innerRadius(0)
                .outerRadius((height - 10) / 2)
                .cornerRadius(1)

            

            let arcs = g.selectAll('arc')
                .data(pie(data))
                .enter()
                .append('g')

            arcs.append("path")
                .attr("fill", (d, i) => color[i])
                .attr("d", arc)

/*             let arcOuter = d3.arc()
                .innerRadius(arc.outerRadius()())
                .outerRadius(arc.outerRadius()() + 5)

            arcs.append("path")
                .attr("fill", "gray")
                .attr("opacity", 0.6)
                .attr("d", arcOuter) */

            return svg
        }

    },
}
</script>

<style scoped>
</style>