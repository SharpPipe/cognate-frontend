<template>
    <div>
        <svg
            :viewBox="`0 0 ${width} ${height}`"
            :width="`${width}`"
            :height="`${height}`"
            id="gradetree"
        />
    </div>
</template>

<script>
import * as d3 from 'd3'
const width = 932
const height = 932
const radius = width / 1.8
let data

export default {
    name: "CourseGradingTree",
    data() {
        return {
            width, height,
            data,
            dataLoaded: false,
        }
    },
    created() {
        d3.json("/gradingmockdata2.json")
            .then(d => {
                this.data = d
                this.dataLoaded = true
            })

    },
    mounted() {
        this.renderGraph()
    },
    watch: {
        dataLoaded() {
            if (!this.dataLoaded) return
            console.log("data loaded")
            this.renderGraph()
            console.log("graph rendered")
        }
    },
    methods: {
        renderGraph() {
            // Git Log code inspired by and definitely not directly stolen from 
            // https://observablehq.com/@aaronkyle/interactive-tree-diagram-d3v3
            // https://observablehq.com/@asktree/interactive-tree-diagram-d3v4-v5
            if (!this.dataLoaded) return
            data = this.data
            let tree = data => d3.tree()
                .size([2 * Math.PI, radius])
                .separation((a, b) => (a.parent == b.parent ? 1 : 3) / a.depth)(d3.hierarchy(data))

            const svg = d3.select("#gradetree")
                .style("width", "100%")
                .style("height", "auto")
                .style("padding", "10px")
                .style("box-sizing", "border-box")
                .style("font", "12px sans-serif");

            const g = svg.append("g");

            const linkgroup = g.append("g")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5);

            const nodegroup = g.append("g")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3);

            function newdata(animate = true) {
                let root = tree(data);
                let links_data = root.links();
                let links = linkgroup
                    .selectAll("path")
                    .data(links_data, d => d.source.data.name + "_" + d.target.data.name);

                links.exit().remove();

                //let newlinks = links
                links
                    .enter()
                    .append("path")
                    .attr("d", d3.linkRadial()
                        .angle(d => d.x)
                        .radius(0.1));



                let t = d3.transition()
                    .duration(animate ? 400 : 0)
                    .ease(d3.easeLinear)
                    .on("end", function () {
                        const box = g.node().getBBox();
                        svg.transition().duration(1000).attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
                    });

                let alllinks = linkgroup.selectAll("path")
                alllinks
                    .transition(t)
                    .attr("d", d3.linkRadial()
                        .angle(d => d.x)
                        .radius(d => d.y));

                let nodes_data = root.descendants().reverse();
                let nodes = nodegroup
                    .selectAll("g")
                    .data(nodes_data, function (d) {
                        if (d.parent) {
                            return d.parent.data.name + d.data.name;
                        }
                        return d.data.name
                    });

                nodes.exit().remove();

                let newnodes = nodes
                    .enter().append("g");

                let allnodes = animate ? nodegroup.selectAll("g").transition(t) : nodegroup.selectAll("g");
                allnodes
                    .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);

                newnodes.append("circle")
                    .attr("r", 4.5)
                    .on("click", function (d) {
                        console.log("clickidy click click")
                        let altChildren = d.data.altChildren || [];
                        let children = d.data.children;
                        d.data.children = altChildren;
                        d.data.altChildren = children;
                        newdata();
                    });

                nodegroup.selectAll("g circle").attr("fill", function (d) {
                    let altChildren = d.data.altChildren || [];
                    let children = d.data.children;
                    return d.children || (children && (children.length > 0 || altChildren.length > 0)) ? "#555" : "#999"
                });

                newnodes.append("text")
                    .attr("dy", "0.31em")
                    .text(d => d.data.name)
                    .clone(true).lower()
                    .attr("stroke", "white");

                nodegroup.selectAll("g text")
                    .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
                    .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
                    .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null);

            }

            newdata(false);

            document.body.appendChild(svg.node());

            const box = g.node().getBBox();

            //box.width = box.height = Math.max(box.width, box.height)*1.2;
            svg.remove()
                .attr("width", box.width)
                .attr("height", box.height)
                .attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
            
            console.log(svg)
            return svg.node();

        },
    },
}
</script>

<style >
.node circle {
    fill: #eee;
    stroke: #6e6;
    stroke-width: 6px;
}

.node text {
    font: 14px sans-serif;
    color: #ddd;
}

.link {
    fill: none;
    stroke: rgb(130, 130, 130);
    stroke-width: 2px;
}
</style>