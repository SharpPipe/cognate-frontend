<template>
    <div class="border rounded my-2">
        <div class="row m-1">
            <svg class="m-1" height="40" width="40">
                <circle cx="20" cy="20" r="20" :fill="`${c(name, false)}`" />
            </svg>
            {{ name }}
            <br />
            Spent: {{ spent }}h
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
    name: "RepoDeveloper",
    props: ["name", "spentTime"],
    computed: {
        spent() {
            if (isNaN(this.spentTime)) return this.spentTime
            return this.spentTime.toFixed(2)
        }
    },
    methods: {
        c(devName, highlight) {
            let scaled = 0
            scaled = (360 / 26) * (devName.charCodeAt(0) - 97)
            scaled += (360 / 26 ** 2) * (devName.charCodeAt(1) - 97)
            if (highlight) {
                return d3.hsl(scaled, 1, 0.7, 0.8)
            } else {
                return d3.hsl(scaled, 0.7, 0.6, 0.8)
            }
        }

    }
}
</script>