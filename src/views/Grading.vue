<template>
  <div class="milestone">
    <div class="container">
      <div class="row">
        <CourseGradingTree />
      </div>
    </div>
  </div>
</template>

<script>
import CourseGradingTree from "../components/visualizations/CourseGradingTreeLinear.vue"

export default {
  name: 'Grading',
  components: {
    CourseGradingTree,
  },
  data() {
    return {
    }
  },
}
</script>
