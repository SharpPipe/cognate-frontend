<template>
  <div class="milestone-card">
    <div class="milestone-card border rounded p-2 text-center">
      <div v-if="msData.assessed" class="badge badge-pill badge-success">
        Milestone {{ msData.milestone_id }}
      </div>
      <div v-if="!msData.assessed" class="badge badge-pill badge-warning">
        Milestone {{ msData.milestone_id }}
      </div>
      <table class="table table-borderless">
        <tr>
          <th class="p-0"></th>
          <th class="p-0">
            <label
              class="mb-1"
              data-toggle="tooltip"
              data-placement="top"
              title="Points given"
            >
              <font-awesome-icon icon="fa-regular fa-star-half-alt" />
            </label>
          </th>
          <th class="p-0">
            <label
              class="mb-1"
              data-toggle="tooltip"
              data-placement="top"
              title="Time spent"
            >
              <font-awesome-icon icon="fa-regular fa-clock" />
            </label>
          </th>
          <th class="p-0">
            <label
              class="mb-1"
              data-toggle="tooltip"
              data-placement="top"
              title="Issues"
            >
              <font-awesome-icon icon="fa-regular fa-clipboard" />
            </label>
          </th>
        </tr>
        <tr v-for="user in msData.user_points" :key="user.name">
          <td class="p-0">
            <svg class="m-1" height="16" width="16">
              <circle cx="8" cy="8" r="8" :fill="`#${user.colour}`" />
            </svg>
          </td>
          <td class="p-0">
            <label>{{ (+user.points).toFixed(0) }}p</label>
          </td>
          <td class="p-0">
            <label>{{ user.time_spent.toFixed(1) }}h</label>
          </td>
          <td class="p-0">
            <label
              class="mb-1"
              data-toggle="tooltip"
              data-placement="top"
              data-html="true"
              :title="formatIssuesTooltip(user.issues)"
              >{{ sumIssues(user.issues) }}</label
            >
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "ProjectMilestoneCard",
  props: ["msData"],
  methods: {
    sumIssues(issues) {
      let sum = 0;
      for (let o of Object.values(issues)) {
        sum += o;
      }
      return sum;
    },
    formatIssuesTooltip(issues) {
      let string = "";
      for (let o of Object.keys(issues)) {
        string += o + ": " + issues[o] + "<br/>";
      }
      return string;
    },
  },
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },
};
</script>

<style scoped>
.milestone-card:hover {
  outline: 1px solid #ddd;
  border-radius: 0.25rem;
  background: #7772;
}
label {
  margin-bottom: 0;
}
</style>
