<template>
  <div v-if="totalStats">
    <div class="m-2 p-2 text-right">
      Total Time Spent:
      <div class="display-3">{{ round(totalStats.time_spent) }}h</div>
      <h2>{{ eap(totalStats.time_spent) }}EAP</h2>
      Codelines:
      <h4>
        <font-awesome-icon icon="fa-solid fa-code" />
        <span class="text-success">
          +{{ comaFormat(totalStats.lines_added) }}</span
        >
        <span class="text-danger">
          -{{ comaFormat(totalStats.lines_removed) }}</span
        >
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectDevs",
  props: ["totalStats"],
  methods: {
    eap(spent) {
      return (spent / 26).toFixed(1);
    },
    round(spent) {
      return spent.toFixed(0);
    },
    comaFormat(num) {
      return num.toLocaleString("en-US");
    },
  },
};
</script>