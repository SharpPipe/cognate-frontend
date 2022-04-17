<template>
  <div class="container" v-if="payload.name">
    <form>
      <h2 class="text-info">Modify {{payload.name}}</h2>
      <div class="row">
        <div class="col">
          <form class="form-group" v-on:submit.prevent="modifyGroup">
            <label>Group name:</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Group name"
              v-model="payload.name"
            />
            <label>Group description:</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Group description"
              v-model="payload.description"
            />
            <label>GitLab Token:</label>
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
        <div class="col">
          <div class="alert alert-success" role="alert" v-if="success">{{ success }}</div>
          <div class="alert alert-danger" role="alert" v-if="error">{{ error }}</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { Api } from "../axios-api";

export default {
  name: 'GroupModify',
  data() {
    return {
      payload: {
        name: "",
        description: "",
        gitlab_token: "",
      },
      success: "",
      error: "",
    }
  },
  created() {
    Api.get('/groups/')
      .then(response => {
        let this_group = response.data.find(g => g.id == this.$route.params.id)
        this.payload.name = this_group.name
        this.payload.description = this_group.description
      })
      .catch(err => {
        this.error = err
        console.log(err)
      })
  },
  methods: {
    modifyGroup() {
      Api.put('/groups/' + this.$route.params.id + '/', this.payload)
        .then(() => {
          this.success = "Group modified!"
          this.$router.push({ name: 'groups' })
        })
        .catch(err => {
          this.error = err
          console.log(err)
        })
    },
  },
}
</script>
