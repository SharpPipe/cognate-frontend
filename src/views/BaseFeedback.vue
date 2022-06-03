<template>
  <div class="container">
    <form class="form-group" v-on:submit.prevent="postFeedback">
      <h2 class="text-info">Give us feedback?</h2>
      <div class="form-group">
        <textarea
          required
          class="form-control"
          rows="5"
          v-model="payload.feedback"
          placeholder="What are we doing right? 
What are we doing wrong?
How would you improve your experience?"
        ></textarea>
      </div>
      <div class="ml-auto mr-0">
        <button type="submit" class="btn btn-success">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import { Api } from "../axios-api";

export default {
  name: "BaseFeedback",
  data() {
    return {
      payload: {
        type: "AP",
        feedback: "",
      },
    };
  },
  methods: {
    postFeedback() {
      if (this.payload.feedback) {
        Api.post("/feedback/", this.payload)
          .then(() => {
            this.$router.push({ name: "groups" });
          })
          .catch((err) => {
            this.error = err;
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped>
select,
select option {
  color: #dee2e6;
}

select:invalid,
select option[value=""] {
  color: #6c757d;
}
</style>