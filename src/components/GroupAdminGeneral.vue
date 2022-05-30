<template>
  <div class="border rounded my-3 p-2">
    <form class="form-group" v-on:submit.prevent="modifyGroup">
      <label>Group name</label>
      <input
        type="text"
        class="form-control mb-3"
        placeholder="Group name"
        v-model="payload.name"
      />
      <label>Group description</label>
      <input
        type="text"
        class="form-control mb-3"
        placeholder="Group description"
        v-model="payload.description"
      />
      <label
        >GitLab Token
        <label
          class="mb-1"
          data-toggle="tooltip"
          data-placement="top"
          data-html="true"
          title="Cognate only needs <b>read-api</b> rights"
        >
          <font-awesome-icon icon="fa-solid fa-circle-info" />
        </label>
      </label>
      <input
        type="text"
        class="form-control mb-3"
        placeholder="GitLab Token (optional)"
        v-model="payload.gitlab_token"
      />

      <div class="form-group">
        <button type="submit" class="btn btn-primary my-2">Update Group</button>
      </div>
    </form>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import $ from "jquery"

export default {
  name: "GroupAdminGeneral",
  data() {
    return {
      success: null,
      error: null,
      payload: {
        name: "",
        description: "",
        gitlab_token: "",
      },
    };
  },
  created() {
    Api.get("/groups/")
      .then((response) => {
        let this_group = response.data.find(
          (g) => g.id == this.$route.params.groupid
        );
        this.payload.name = this_group.name;
        this.payload.description = this_group.description;
      })
      .catch((err) => {
        this.error = err;
        console.log(err);
      });

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
    });
  },
  methods: {
    modifyGroup() {
      Api.put("/groups/" + this.$route.params.groupid + "/", this.payload)
        .then(() => {
          this.success = "Group modified!";
          this.$router.push({ name: "groups" });
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
  },
};
</script>
