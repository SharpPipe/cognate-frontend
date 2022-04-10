<template>
    <div>
        <RepoDeveloper :name="devName" :spentTime="spentTime" 
                        @mouseover.native="$emit('devHover', devName)"
        />
        <div v-if="points" class="form-group">
            <div class="row no-gutters">
                <label
                    class="mb-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="merge request + code review + branches + commits linked to tasks"
                >{{ points[3].name }}</label>
                <p class="ml-auto mr-0 text-muted">{{ points[3].given_points }}/5</p>
            </div>
            <input
                type="range"
                min="0"
                max="5"
                v-model="points[3].given_points"
                class="form-control-range mb-3"
                @change="$emit('pointsChanged')"
            />

            <div class="row no-gutters">
                <label
                    class="mb-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="tasks chosen, assigned, prioritized + estimate given + goal set"
                >{{ points[4].name }}</label>
                <p class="ml-auto mr-0 text-muted">{{ points[4].given_points }}/5</p>
            </div>
            <input
                type="range"
                min="0"
                max="5"
                v-model="points[4].given_points"
                class="form-control-range mb-3"
                @change="$emit('pointsChanged')"
            />

            <div class="row no-gutters">
                <label
                    class="mb-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="tasks juicy, clear, meaningful + has acceptance criteria"
                >{{ points[5].name }}</label>
                <p class="ml-auto mr-0 text-muted">{{ points[5].given_points }}/5</p>
            </div>
            <input
                type="range"
                min="0"
                max="5"
                v-model="points[5].given_points"
                class="form-control-range mb-3"
                @change="$emit('pointsChanged')"
            />

            <div class="row no-gutters">
                <label
                    class="mb-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="the hours + helped the project forward"
                >{{ points[0].name }}</label>
                <p class="ml-auto mr-0 text-muted">{{ points[0].given_points }}/30</p>
            </div>
            <input
                type="range"
                min="0"
                max="30"
                v-model="points[0].given_points"
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
    props: ["points", "devName", "spentTime", "teampoints", "devAmount"],
    components: { ProgressBar, RepoDeveloper },
    computed: {
        currentPoints() {
            let sum = 0
            for (var point in this.points) {
                sum += +this.points[point].given_points
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


<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  background-color: #dddddd;
  height: 10px;
  border-radius: 5px;
  box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.7);
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  background: #66ee66;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  height: 15px;
  width: 15px;
  background: #66ee66;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
</style>