<template>
    <div class="w-100">
        <div class="form-group">
            <div class="row no-gutters">
                <label
                    class="mb-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="actionable tickets"
                >Retro</label>
                <p class="ml-auto mr-0 text-muted">{{ teampoints[0].value }}/5</p>
            </div>
            <input
                type="range"
                min="0"
                max="5"
                v-model="teampoints[0].value"
                class="form-control-range mb-3"
            />

            <div class="row no-gutters">
                <label
                    class="mb-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="everyone present + prepared + asking questions"
                >Meeting the Mentor</label>
                <p class="ml-auto mr-0 text-muted">{{ teampoints[1].value }}/5</p>
            </div>
            <input
                type="range"
                min="0"
                max="5"
                v-model="teampoints[1].value"
                class="form-control-range mb-3"
            />
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: "RepoGradeTeam",
    props: ["teampoints", "radarData"],
    created() {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }
}
</script>