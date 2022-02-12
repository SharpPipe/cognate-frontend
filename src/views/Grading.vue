<template>
  <div class="milestone">
    <div class="container">
      <h2>Grading for the Course {{$route.params.name}}</h2>
      <CourseGradingTree v-if="APIData" :gradedata="APIData"/>
    </div>
  </div>
</template>

<script>
import CourseGradingTree from "../components/visualizations/CourseGradingTreeLinear.vue";
import { Api } from "../axios-api";
import { mapState } from 'vuex'

export default {
  name: "Grading",
  components: {
    CourseGradingTree,
  },
  computed: mapState(['APIData']),
  data() {
    return {};
  },
  created() {
    Api.get("groups/" + this.$route.params.id + "/grading/")
      .then((response) => {
        this.$store.state.APIData = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
