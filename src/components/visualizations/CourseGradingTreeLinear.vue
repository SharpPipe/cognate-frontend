<template>
    <div id="divid">
        <div class="border rounded">
            <div class="input-group mb-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="New grade element"
                    aria-label="Grade element"
                    aria-describedby="button-addon1"
                    v-model="newNode.name"
                />
                <div class="input-group-append">
                    <button
                        class="btn btn-outline-success"
                        type="button"
                        id="button-addon2"
                    >Add Node</button>
                </div>
            </div>
            <div class="input-group d-flex">
                <div class="input-group-prepend flex-grow-1">
                    <label class="input-group-text flex-grow-1" for="inputGroupSelect01">
                        Selected:
                        <em
                            class="font-weight-bold"
                        >{{ currentNode.data.name }} </em>
                    </label>
                </div>
                <div class="input-group-append">
                    <button class="btn btn-outline-danger" type="button" id="button-addon2">Delete</button>
                </div>
            </div>
        </div>
        <svg
            :viewBox="`${-width} ${-height} ${width} ${height}`"
            :width="`${width}`"
            :height="`${height}`"
            id="tree"
        />
    </div>
</template>

<script>
import * as d3 from 'd3'
const width = 932
const height = 932
let data

export default {
    name: "CourseGradingTree",
    data() {
        return {
            width, height,
            data,
            dataLoaded: false,
            currentNode: {
                id: null,
                data: { name: "" }
            },
            newNode: {
                id: 0,
                name: ''
            }
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
            // https://observablehq.com/@esperanc/d3-radial-tidy-tree
            if (!this.dataLoaded) return
            data = this.data
            let tree = data => d3.tree()
                .size([width * 3, width])
                .separation((a, b) => (a.parent == b.parent ? 1 : 3))(d3.hierarchy(data));

            const svg = d3.select("#tree")
                .style("width", "100%")
                .style("height", "auto")
                .style("padding", "10px")
                .style("box-sizing", "border-box")
                .style("font", "14px sans-serif");

            const g = svg.append("g");

            const linkgroup = g.append("g")
                .attr("fill", "none")
                .attr("stroke", "#6e6")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5);

            const nodegroup = g.append("g")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 4)


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
                    .append("path");


                let t = d3.transition()
                    .duration(animate ? 1000 : 0)
                    .ease(d3.easeQuadInOut)
                    .on("end", function () {
                        const box = g.node().getBBox();
                        svg.transition().duration(2000).attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
                    });

                //let alllinks = linkgroup.selectAll("path")
                linkgroup.selectAll("path")
                    .transition(t)
                    .attr("d", d3.linkHorizontal()
                        .x(d => d.y)
                        .y(d => d.x));


                let nodes_data = root.descendants().reverse();
                let nodes = nodegroup
                    .selectAll("g")
                    .data(nodes_data, function (d) {
                        if (d.parent)
                            return d.parent.data.name + d.data.name;
                        return d.data.name
                    });

                nodes.exit().remove();

                let newnodes = nodes
                    .enter()
                    .append("g")
                    .on("click", function (event, d) {
                        let altChildren = d.data.altChildren || [];
                        let children = d.data.children;
                        d.data.children = altChildren;
                        d.data.altChildren = children;
                        newdata();
                    })
                    .on("mouseover", function () {
                        //d3.select(this).style("fill", "green");
                        //d3.select(this).select("circle").style("fill", "green");
                        //d3.select(this).select("text").style("color", "blue");
                    })
                    .on("mouseout", function () {
                        /*                         d3.select(this).select("circle").style("fill", function (d) {
                                                    let altChildren = d.data.altChildren || [];
                                                    let children = d.data.children;
                                                    return d.children || (children && (children.length > 0 || altChildren.length > 0)) ? "red" : "blue"
                                                }); */
                    });

                let allnodes = animate ? nodegroup.selectAll("g").transition(t) : nodegroup.selectAll("g");
                allnodes.attr("transform", d => `translate(${d.y},${d.x})`);

                newnodes.append("circle")
                    .attr("r", 10);

                nodegroup.selectAll("g circle")
                    .attr("fill", function (d) {
                        let altChildren = d.data.altChildren || [];
                        let children = d.data.children;
                        return d.children || (children && (children.length > 0 || altChildren.length > 0)) ? "#444" : "#aaa"
                    })

                newnodes.append("text")
                    .attr("dy", "0.31em")
                    .text(d => d.data.name)
                    .clone(true).lower()
                    .attr("stroke", "white");

                nodegroup.selectAll("g text")
                    .attr("x", d => !d.children ? 15 : -15)
                    .attr("text-anchor", d => !d.children ? "start" : "end")
                //.attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null);

            }

            newdata(false);

            console.log(svg.node())
            //document.body.appendChild(svg.node());
            document.getElementById("divid").appendChild(svg.node())

            const box = g.node().getBBox();

            //box.width = box.height = Math.max(box.width, box.height)*1.2;
            //svg.remove()
            svg
                .attr("width", box.width)
                .attr("height", box.height)
                .attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);

            return svg.node();

        },
    },
}
</script>

<style >
</style>