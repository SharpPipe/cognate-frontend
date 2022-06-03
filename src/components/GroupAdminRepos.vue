<template>
  <div>
    <!-- Add new project -->
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
          <button class="btn btn-primary" type="button" @click="addProject">
            Add new project
          </button>
        </div>
      </div>
    </div>

    <!-- Add repo to project -->
    <div class="border rounded my-3 p-2">
      <label>Add repo to project:</label>
      <div class="form-group">
        <select
          required
          class="custom-select form-control mb-2"
          v-model="selectedProject"
        >
          <option value selected disabled hidden>Project</option>

          <option
            :value="project.id"
            v-for="project in allProjects"
            :key="project.id"
          >
            {{ project.name }}
          </option>
        </select>
        <input
          required
          type="text"
          class="form-control mb-2"
          placeholder="Repo Name"
          v-model="repo.name"
        />
        <input
          required
          type="text"
          class="form-control mb-2"
          placeholder="GitLab URL"
          v-model="repo.url"
        />
        <input
          required
          type="text"
          class="form-control mb-2"
          placeholder="GitLab ID"
          v-model="repo.gitlab_id"
        />
        <button class="btn btn-primary" type="button" @click="addRepo">
          Add repo to project
        </button>
      </div>
    </div>

    <!-- Repo management drag view -->
    <div v-if="project_connections">
      <div class="flexbox">
        <div
          class="border rounded p-0 my-2 h-100"
          v-for="project in project_connections.projects"
          :key="project.id"
        >
          <div class="w-25 px-2 my-2 float-left">
            <div>
              <div class="font-weight-bold">{{ project.name }}</div>
            </div>
          </div>

          <DragBoard
            class="py-1 w-75 float-left bg-dark h-100 flex-grow-1"
            :id="`board-${project.id}`"
            v-on:cardDropped="changeProject"
          >
            <DragCard
              v-for="repo in project.gl_repos"
              :key="repo.id"
              :id="`card-${repo.id}`"
              draggable="true"
              class="d-block bg-secondary px-2 py-1 my-3 ml-3 mr-0"
            >
              <a :href="repo.url" target="_blank">
                <font-awesome-icon icon="fa-brands fa-gitlab" />
              </a>
              {{ repo.name }}
            </DragCard>
            <div class="py-3" />
            <!-- Needed so the DragBoard doesn't shrink -->
          </DragBoard>
        </div>

        <!--  Unmatched  -->
        <div
          class="border rounded p-0 my-2"
          v-for="unmatched in project_connections.unmatched"
          :key="unmatched.id"
        >
          <div class="w-25 p-3 my-2 float-left">
            <div class="h3">Unmatched</div>
          </div>

          <DragBoard
            class="p-2 w-75 float-left bg-dark"
            id="board-unmatched"
            v-on:cardDropped="changeProject"
          >
            <DragCard
              :id="`card-${unmatched.id}-unmatched`"
              draggable="true"
              class="bg-secondary px-4 py-2 m-3"
            >
              <font-awesome-icon class="h3" icon="fa-brands fa-gitlab" />
              {{ unmatched.name }}
            </DragCard>
            <div class="py-3" />
            <!-- Needed so the DragBoard doesn't shrink -->
          </DragBoard>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { Api } from "../axios-api";
import DragBoard from "../components/DragBoard.vue";
import DragCard from "../components/DragCard.vue";

export default {
  name: "GroupAdminRepos",
  components: {
    DragBoard,
    DragCard,
  },
  data() {
    return {
      allProjects: null,
      project_connections: null,
      newProjectName: "",
      selectedProject: "",
      repo: {
        name: "",
        url: "",
        gitlab_id: "",
      },
    };
  },
  created() {
    this.getProjects();
  },
  methods: {
    getProjects() {
      Api.get(
        "/groups/" + this.$route.params.groupid + "/project_repo_connections/"
      ).then((response) => {
        this.allProjects = response.data.projects;
        this.project_connections = this.formatedConnections(response.data);
      });
    },
    addProject() {
      if (this.newProjectName) {
        Api.post("/groups/" + this.$route.params.groupid + "/project/", {
          name: this.newProjectName,
        })
          .then((response) => {
            this.allProjects.push(response.data);
            this.newProjectName = "";
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    addRepo() {
      if (
        this.selectedProject &&
        this.repo.name &&
        this.repo.url &&
        this.repo.gitlab_id
      ) {
        Api.post(
          "/projects/" + this.selectedProject + "/repo/",
          this.repo
        ).catch((error) => {
          console.log(error);
        });
      }
    },

    formatedConnections(raw) {
      raw.unmatched = [];
      for (let repo of raw.repos) {
        let project_id = raw.projects.findIndex((p) => p.id == repo.project);

        if (project_id == -1) {
          raw.unmatched.push(repo);
        } else {
          if (raw.projects[project_id].gl_repos == undefined)
            raw.projects[project_id].gl_repos = [];
          raw.projects[project_id].gl_repos.push(repo);
        }
      }
      return raw;
    },
    changeProject(card_id, board_id) {
      Api.put("/repos/" + card_id + "/project/", {
        id: board_id,
      }).catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped>
.flexbox {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  flex-direction: column;
}

.flexbox .board {
  display: flex;
  flex-direction: row;
  flex: 1 1;
}
.flexbox .board .card {
  cursor: pointer;
}
select,
select option {
  color: #dee2e6;
}

select:invalid,
select option[value=""] {
  color: #6c757d;
}
</style>
