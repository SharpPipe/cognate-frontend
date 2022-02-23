<template>
    <div class="milestone-card">
        <div class="milestone-card border rounded p-2 text-center">
            <label v-if="ms_data">{{ms_data.title}}</label>
            <label v-if="!ms_data">Milestone {{ nr }}</label>
            <br>
            <div v-if="ms_status =='graded'" class="badge badge-pill badge-success">Graded</div>
            <div v-if="ms_status =='ungraded'" class="badge badge-pill badge-warning">Not Graded</div>
            <div v-if="ms_status =='TBA'" class="badge badge-pill badge-dark milestone">TBA</div>
            <h3>{{points}}</h3>
        </div>
    </div>
</template>

<script>
export default {
    name: "RepoMilestoneCard",
    props: ["nr", "ms_status", "points", "ms_data"],
}
</script>

<style scoped>
.milestone-card:hover {
    outline: 1px solid #ddd;
    border-radius: 0.25rem;
    background: #7772;
}
</style>