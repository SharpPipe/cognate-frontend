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
      APIData: {
        'project_name': 'Minecraft',
        'milestone_name': 'First Milestone',
        'developers': [
          { 'name': 'priit', 'status': 0, 'time_spent': 5 },
          { 'name': 'tiit', 'status': 0, 'time_spent': 24 },
          { 'name': 'viive', 'status': 1, 'time_spent': 9 }
        ],
        'milestone_stats': {
          'total_time_spent': 33,
          'total_lines_added': 133,
          'total_lines_removed': 43,
          'total_issues_closed': 5,
          'total_fun': 66,
        },
        'prev_milestone_stats': {
          'total_time_spent': 27,
          'total_lines_added': 653,
          'total_lines_removed': 3,
          'total_issues_closed': 8,
          'total_fun': 60,
        },
      }
    }
  },
}
</script>
