<template>
    <div>
        <RepoDeveloper :name="devName" />
        <div class="form-group">
            <label 
                class="mb-1"
                data-toggle="tooltip"
                data-placement="top"
                title="merge request + code review + branches + commits linked to tasks"
            >Git Management</label>
            <input
                type="range"
                min="0"
                max="5"
                v-model="points[3].value"
                class="form-control-range mb-3"
                @change="$emit('pointsChanged')"
            />

            <label 
                class="mb-1"
                data-toggle="tooltip"
                data-placement="top"
                title="tasks chosen, assigned, prioritized + estimate given + goal set"
            >Planning</label>
            <input
                type="range"
                min="0"
                max="5"
                v-model="points[4].value"
                class="form-control-range mb-3"
                @change="$emit('pointsChanged')"
            />

            <label 
                class="mb-1"
                data-toggle="tooltip"
                data-placement="top"
                title="tasks juicy, clear, meaningful + has acceptance criteria"
            >Tasks</label>
            <input
                type="range"
                min="0"
                max="5"
                v-model="points[5].value"
                class="form-control-range mb-3"
                @change="$emit('pointsChanged')"
            />
            <label 
                class="mb-1"
                data-toggle="tooltip"
                data-placement="top"
                title="the hours + helped the project forward"
            >Contribution</label>
            <input
                type="range"
                min="0"
                max="30"
                v-model="points[0].value"
                class="form-control-range mb-3"
            />
            <ProgressBar
                class="mb-2"
                :currentPoints="currentPoints"
                :minPoints="0"
                :maxPoints="55"
            />
        </div>
    </div>
</template>

<script>
import ProgressBar from "./ProgressBar.vue";

import $ from 'jquery';
import RepoDeveloper from "./RepoDeveloper.vue";
export default {
    name: "RepoGradeStudent",
    props: ["points", "devName"],
    components: { ProgressBar, RepoDeveloper },
    computed: {
        currentPoints() {
            let sum = 0
            for (var point in this.points) {
                sum += +this.points[point].value
            }
            return sum
        }
    },
    created() {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }
}
</script>