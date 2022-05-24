<template>
  <div>
    <svg v-if="colours" :viewBox="`0 0 ${width} ${height}`" id="gittime" />
    <div v-if="repos.length > 1" class="custom-checkbox p-0 d-flex-lnline">
      <div v-for="repo in repos" :key="repo" class="float-right px-1">
        <input
          type="checkbox"
          :value="repo"
          v-model="checkedRepos"
          checked="true"
        />
        <label class="px-1 py-0 my-0">{{ repo }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import _ from "lodash";
import $ from "jquery";

const width = 800;
const height = 400;
let data;

export default {
  name: "GitTime",
  props: ["gitdata", "colours"],
  data() {
    return {
      width,
      height,
      lineGraphData: [],
      data: [],
      repos: [],
      checkedRepos: [],
    };
  },
  mounted() {
    this.data = this.gitdata.map((c) =>
      Object.assign(c, { time: d3.isoParse(c.time) })
    );
    this.data = this.timezoneOffset(this.data);
    this.data = this.underflow(this.data);
    this.data = this.underflow(this.data);

    this.differentiateByRepo(this.data);
    this.lineGraphData = this.aggregateTime(this.data);

    this.renderGraph(this.colours, this);
  },
  computed: {
    checkedLength() {
      return this.checkedRepos.length;
    },
  },
  watch: {
    checkedLength() {
      d3.select("#gittime").selectAll("*").remove();
      this.renderGraph(this.colours, this);
    },
  },
  methods: {
    aggregateTime(data) {
      let devLine = _.groupBy(data, (d) => d.user);
      for (let dev of Object.keys(devLine)) {
        let linegraph = [];
        let lines = _.groupBy(devLine[dev], (d) =>
          new Date(d.time).setHours(0, 0, 0, 0)
        );

        _.forEach(lines, (value, key) => {
          lines[key] = value.reduce((total, item) => item.amount + total, 0);
          linegraph.push({ date: new Date(+key), amount: lines[key] });
        });
        let minday = _.minBy(linegraph, (d) => d.date.valueOf()).date.valueOf();
        let maxday = _.maxBy(linegraph, (d) => d.date.valueOf()).date.valueOf();
        let alldays = linegraph.map((d) => d.date.valueOf());
        let aggregator = 0;
        let aggregateLineGraph = [];
        for (let s = minday; s <= maxday; s += 86400000) {
          // ms in day
          if (alldays.includes(s))
            aggregator += linegraph.find((d) => d.date.valueOf() == s).amount;
          else if (alldays.includes(s - 3600000))
            // daylight savings
            aggregator += linegraph.find(
              (d) => d.date.valueOf() == s - 3600000
            ).amount;
          aggregateLineGraph.push({
            date: new Date(s - 3600000),
            amount: aggregator,
          });
        }
        devLine[dev] = aggregateLineGraph.sort((a, b) => a.date - b.date);
      }
      return _.toPairsIn(devLine);
    },
    timezoneOffset(data) {
      _.forEach(data, (d) => {
        d.time = new Date(
          d.time.valueOf() + d.time.getTimezoneOffset() * 60 * 1000
        );
      });
      return data;
    },
    underflow(data) {
      let newLines = [];
      _.forEach(data, (d) => {
        let start = new Date(d.time.valueOf() - d.amount * 1000 * 60);
        if (d.time.getDate() !== start.getDate()) {
          let nextDayMinutes = d.time.getHours() * 60 + d.time.getMinutes(); // + d.time.getSeconds() / 60 + d.time.getMilliseconds() / (60 * 1000)
          let prevDayMinutes = d.amount - nextDayMinutes;
          newLines.push({
            amount: prevDayMinutes,
            user: d.user,
            title: d.title,
            gitlab_link: d.gitlab_link,
            repo_id: d.repo_id,
            time: new Date(new Date(d.time.toDateString()).valueOf() - 1),
          });

          d.amount = nextDayMinutes;
        }
      });
      data.push.apply(data, newLines);
      return data;
    },
    differentiateByRepo(data) {
      let diffed = _.groupBy(data, (d) => d.repo_id);
      this.repos = Object.keys(diffed);
      this.checkedRepos = this.repos;
    },
    renderGraph(colours, self) {
      // Git Log code inspired by and definitely not directly stolen from
      // https://observablehq.com/@webapelsin/git-log
      if (!this.data.length) return;
      data = this.data;
      let svg = d3.select("#gittime");
      let margins = { top: 20, right: 50, bottom: 30, left: 30 };

      // Axis
      let domainExtent = d3.extent(
        data,
        (d) => new Date(d.time.toDateString().valueOf())
      );
      domainExtent[0] = new Date(
        domainExtent[0].getTime() - 24 * 60 * 60 * 1000
      );
      domainExtent[1] = new Date(
        domainExtent[1].getTime() + 24 * 60 * 60 * 1000
      );

      let x = d3
        .scaleTime()
        .domain(domainExtent)
        .range([margins.left, width - margins.right]);

      let y = d3
        .scaleLinear()
        .domain([0, 24])
        .range([height - margins.bottom, margins.top]);

      let agg_maxtime = 14040; // 9 EAP
      let y_agg = d3
        .scaleLinear()
        .domain([0, agg_maxtime])
        .range([height - margins.bottom, margins.top]);

      let c = (devName, hover) => {
        if (hover) {
          return "#" + colours[devName] + "ff";
        } else {
          return "#" + colours[devName] + "aa";
        }
      };

      let xAxis = (g) =>
        g
          .attr("transform", `translate(0,${height - margins.bottom})`)
          .call(
            d3.axisBottom(x).tickSize(-height + margins.top + margins.bottom)
          )
          .call((g) => g.select(".domain").attr("stroke", "#d8dbdb"))
          .call((g) =>
            g
              .selectAll("line")
              .attr("stroke", "#d8dbdb")
              .attr("stroke-opacity", "0.3")
          );

      let yAxis = (g) =>
        g
          .attr("transform", `translate(${margins.left},0)`)
          .call(
            d3
              .axisRight(y)
              .tickSize(width - margins.left - margins.right)
              .tickFormat((v) => v + ":00")
          )
          .call((g) => g.select(".domain").attr("stroke", "#d8dbdb"))
          .call((g) =>
            g
              .selectAll("line")
              .attr("stroke", "#d8dbdb")
              .attr("stroke-opacity", "0.3")
          );

      let yAggAxis = (g) =>
        g
          .attr("transform", `translate(${margins.left},0)`)
          .attr("stroke", "#66ee66aa")
          .call(
            d3
              .axisLeft(y_agg)
              .tickSize(0)
              .tickFormat((v) => (v / 60).toFixed(0) + "h")
          );

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);
      svg.append("g").call(yAggAxis);

      // Pie
      let groups = _.groupBy(data, (d) => d.user);
      _.forEach(groups, (value, key) => {
        groups[key] = value.reduce((total, item) => item.amount + total, 0);
      });
      let effort = [];
      for (let k in groups) effort.push(groups[k]);

      let pie = d3
        .pie()
        .sort(null)
        .padAngle((Math.PI / 180) * 5)(effort);

      let radius = height / 3;
      let pieNode = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .attr("opacity", 0.3);

      let arcs = pieNode
        .selectAll(".arc")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "arc");

      arcs
        .append("path")
        .attr("d", (d) =>
          d3
            .arc()
            .outerRadius(radius)
            .innerRadius(radius * 0.66)(d)
        )
        .attr("fill", (d) =>
          c(
            Object.keys(groups).find((key) => groups[key] === d.data),
            false
          )
        );

      // Aggregate line graph
      let lineFunc = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y_agg(d.amount))
        .curve(d3.curveMonotoneX);

      svg
        .append("g")
        .selectAll(".aggLine")
        .data(self.lineGraphData)
        .enter()
        .append("path")
        .attr("d", (d) => lineFunc(d[1]))
        .attr("class", ".aggLine")
        .attr("stroke", (d) => c(d[0], false))
        .attr("fill", "none")
        .attr("opacity", 0.7)
        .attr("stroke-width", 4);

      // Lines
      let dayWidth = x(new Date("2000-01-01")) - x(new Date("2000-01-02"));

      // Tooltip
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });

      svg
        .append("g")
        .attr("stroke", "#000")
        .selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .style("opacity", (d) =>
          self.checkedRepos.includes(d.repo_id + "") ? 1 : 0
        )
        .attr("x1", (d) =>
          x(new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate()))
        )
        .attr("y1", (d) => y(d.time.getHours() + d.time.getMinutes() / 60))
        .attr("x2", (d) =>
          x(new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate()))
        )
        .attr("y2", (d) =>
          y(d.time.getHours() + d.time.getMinutes() / 60 - d.amount / 60)
        )
        .attr("stroke", (d) => c(d.user, false))
        .attr("stroke-width", -dayWidth)
        .attr("ref", "line")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .attr("data-html", true)
        .attr(
          "title",
          (d) =>
            "<b>" +
            d.title +
            "</b></br>" +
            d.user +
            "</br>" +
            d.time.toDateString()
        )
        .on("dblclick", (e, d) => {
          if (d.gitlab_link !== null) {
            console.log(d.gitlab_link);
            window.open(d.gitlab_link, "_blank");
          }
        });

      return svg.node();
    },
  },
};
</script>

<style>
line {
  cursor: pointer;
}
</style>
