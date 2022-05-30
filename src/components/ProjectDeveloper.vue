<template>
  <div class="border rounded">
    <div class="row m-1">
      <svg class="m-2 my-auto" height="40" width="40">
        <circle v-if="isActive" cx="20" cy="20" r="20" :fill="`#${devData.colour}`" />
        <circle v-else cx="20" cy="20" r="20" fill="#aaaaaa" />
      </svg>
      <div class="flex-grow-1">
        <span class="font-weight-bold">{{ devData.username }}</span>
        <br />

        <div class="row m-0 justify-content-between">
          <span>
            <font-awesome-icon icon="fa-regular fa-clock" />
            <span class="w-25">
              {{ this.spent(devData.time_spent || devData.spent_time) }}h</span
            >
          </span>
          <span
            v-if="devData.lines_added || devData.lines_removed"
            class="float-right"
          >
            <font-awesome-icon icon="fa-solid fa-code" />
            <span class="text-success">
              +{{ comaFormat(devData.lines_added) }}</span
            >
            <span class="text-danger">
              -{{ comaFormat(devData.lines_removed) }}</span
            >
          </span>
          <div v-if="disableable">
            <input type="checkbox" id="check" name="vehicle1" v-model="isActive" @change="$emit('toggle', [devData.username, isActive])"/>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectDeveloper",
  props: ["devData", "disableable"],
  data() {
    return {
      isActive: true
    }
  },
  methods: {
    spent(time) {
      if (isNaN(time)) return time;
      return time.toFixed(2);
    },
    comaFormat(num) {
      return num.toLocaleString("en-US");
    },
  },
};
</script>