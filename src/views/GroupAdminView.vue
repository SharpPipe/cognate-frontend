<template>
  <div class="container" v-if="payload.name">
    <form>
      <h2 class="text-info">Modify {{ payload.name }}</h2>
      <div class="row">
        <div class="col">
          <div class="border rounded my-3 p-2">
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
        </div>
        <div class="col">
          <div class="border rounded my-3 p-2">
            <label>New project:</label>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Project name"
                v-model="newProjectName"
              />
              <div class="input-group-append">
                <button class="btn btn-primary" type="button" @click="addProject">Add new project</button>
              </div>
            </div>
          </div>

          <div class="border rounded my-3 p-2">
            <label>Add repo to project:</label>
            <div class="form-group">
              <select required class="custom-select form-control mb-2" v-model="selectedProject">
                <option value selected disabled hidden>Project</option>

                <option 
                  :value="project.id"
                  v-for="project in allProjects" :key="project.id"
                >{{ project.name}}
                </option>
              </select>
              <input 
                type="text" 
                class="form-control mb-2" 
                placeholder="Repo Name" 
                v-model="repo.name" 
              />
              <input
                type="text"
                class="form-control mb-2"
                placeholder="GitLab URL"
                v-model="repo.url"
              />
              <input
                type="text"
                class="form-control mb-2"
                placeholder="GitLab ID"
                v-model="repo.id"
              />
              <button class="btn btn-primary" type="button" @click="addRepo">Add repo to project</button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <ProjectRepoManager />
  </div>
</template>

<script>
import { Api } from "../axios-api";
import ProjectRepoManager from "../components/ProjectRepoManager.vue";

export default {
  name: "GroupModify",
  components: { ProjectRepoManager },
  data() {
    return {
      allProjects: null,
      payload: {
        name: "",
        description: "",
        gitlab_token: "",
      },
      newProjectName: "",
      selectedProject: "",
      repo: {
        name: "",
        url: "",
        id: "",
      },
      success: "",
      error: "",
    };
  },
  created() {
    Api.get("/groups/")
      .then(response => {
        let this_group = response.data.find(g => g.id == this.$route.params.id);
        this.payload.name = this_group.name;
        this.payload.description = this_group.description;
      })
      .catch(err => {
        this.error = err;
        console.log(err);
      });
    Api.get(
      "/groups/" + this.$route.params.id + "/project_repo_connections/"
    ).then((response) => {
      this.allProjects = response.data.projects
    });
  },
  methods: {
    modifyGroup() {
      Api.put("/groups/" + this.$route.params.id + "/", this.payload)
        .then(() => {
          this.success = "Group modified!";
          this.$router.push({ name: "groups" });
        })
        .catch(err => {
          this.error = err;
          console.log(err);
        });
    },
    addProject() {
      if (this.newProjectName) {
        Api.post("/groups/" + this.$route.params.id + "/project/", { name: this.newProjectName }) 
          .then(response => {
            this.allProjects.push(response.data)
            this.newProjectName = ""
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    addRepo() {
      if (this.selectedProject && this.repo.name && this.repo.url && this.repo.id) {
        Api.post("/projects/" + this.selectedProject + "/repo/", this.repo)
          .then(response => {
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
  },
}
</script>

<style scoped>
select, select option {
  color: #dee2e6;
}

select:invalid,
select option[value=""] {
  color: #6c757d;
}
</style>