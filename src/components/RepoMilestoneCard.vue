<template>
    <div class="milestone-card">
        <div class="milestone-card border rounded p-2 text-center">
            <div
                v-if="msData.graded"
                class="badge badge-pill badge-success"
            >Milestone {{ msData.milestone_id }}</div>
            <div
                v-if="!msData.graded"
                class="badge badge-pill badge-warning"
            >Milestone {{ msData.milestone_id }}</div>
            <table class="table table-borderless">
                <tr v-for="user in msData.user_points" :key="user.name">
                    <td class="p-0">
                        <svg class="m-1" height="16" width="16">
                            <circle cx="8" cy="8" r="8" :fill="`#${user.colour}`" />
                        </svg>
                    </td>
                    <td class="p-0">{{ (+user.points).toFixed(0) }}p</td>
                    <td class="p-0">
                        <font-awesome-icon icon="fa-regular fa-clock" />
                        {{ user.time_spent.toFixed(1) }}h
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "RepoMilestoneCard",
    props: ["msData"],
}
</script>

<style scoped>
.milestone-card:hover {
    outline: 1px solid #ddd;
    border-radius: 0.25rem;
    background: #7772;
}
</style>