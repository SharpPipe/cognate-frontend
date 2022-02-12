<template>
  <div class="milestone">
    <div class="container">
      <CourseGradingTree />
    </div>
  </div>
</template>

<script>
import CourseGradingTree from "../components/visualizations/CourseGradingTreeLinear.vue";

export default {
  name: "Grading",
  components: {
    CourseGradingTree,
  },
  data() {
    return {};
  },
};
</script>
