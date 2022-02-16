<template>
    <div class="progress">
        <div
            class="bg-success progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            :aria-valuenow="currentPoints"
            :aria-valuemin="minCoursePoints"
            :aria-valuemax="maxCoursePoints"
            :style="`width: ${styleWidth}%`"
        >{{ currentPoints }}/{{ maxCoursePoints }}</div>
    </div>
</template>

<script>

export default {
    props: ["currentPoints", "minCoursePoints", "maxCoursePoints"],
    computed: {
        styleWidth() {
            return 100 * this.currentPoints / this.maxCoursePoints
        }
    }
}
</script>

<style scoped>
.progress {
    background-color: #dddddd;
    box-shadow: inset 1px 1px 5px rgba(0,0,0,0.7);
}
.progress-bar-striped {
    box-shadow: inset 1px 1px 5px rgba(0,0,0,0.7);
}

</style>