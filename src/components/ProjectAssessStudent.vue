<template>
  <div>
    <div v-if="points" class="form-group">
      <div v-for="point in points" :key="point.id">
        <div class="row no-gutters">
          <label
            class="mb-1"
            data-toggle="tooltip"
            data-placement="top"
            :title="point.description"
            >{{ point.name }}</label
          >
          <p class="ml-auto mr-0 text-warning" v-if="point.automatic_points">
            {{ point.given_points }}/{{ +point.total }}
          </p>
          <p class="ml-auto mr-0 text-muted" v-else>
            {{ point.given_points }}/{{ +point.total }}
          </p>
        </div>
        <input
          type="range"
          min="0"
          :max="point.total"
          v-model="point.given_points"
          :disabled="deactivated"
          class="form-control-range mb-3"
          @change="$emit('pointsChanged')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "ProjectAssessStudent",
  props: ["points", "deactivated", "deactivatedUsers"],
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },
  watch: {
    deactivatedUsers() {
      this.$forceUpdate();
    },
  },
  mounted() {
    for (let p of this.points)
      if (p.given_points == 0 && +p.automatic_points == 0)
        p.given_points = Math.min(+p.automatic_points, +p.total);
  },
};
</script>


<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  background-color: #dddddd;
  height: 10px;
  border-radius: 5px;
  box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.7);
}

input[type="range"]:disabled {
  -webkit-appearance: none;
  background-color: #666;
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
.automatic > input[type="range"] {
  -webkit-appearance: none;
  background-color: #2b3cf4;
}
</style>