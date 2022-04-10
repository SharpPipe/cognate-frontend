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
                <p class="ml-auto mr-0 text-muted">{{ radarData[0].value }}/5</p>
            </div>
            <input
                type="range"
                min="0"
                max="5"
                v-model="radarData[0].value"
                class="form-control-range mb-3"
                @change="$emit('teamPointsChanged', radarData)"
            />

            <div class="row no-gutters">
                <label
                    class="mb-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="everyone present + prepared + asking questions"
                >Meeting the Mentor</label>
                <p class="ml-auto mr-0 text-muted">{{ radarData[1].value }}/5</p>
            </div>
            <input
                type="range"
                min="0"
                max="5"
                v-model="radarData[1].value"
                class="form-control-range mb-3"
                @change="$emit('teamPointsChanged', radarData)"
            />
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: "RepoGradeTeam",
    props: ["radarData"],
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