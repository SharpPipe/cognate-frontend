<template>
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
          class="py-1 w-75 float-left bg-dark h-100 "
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
            <a :href="repo.url">
              <font-awesome-icon icon="fa-brands fa-gitlab" />
            </a>
            {{ repo.name }}
          </DragCard>
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
        </DragBoard>
      </div>
    </div>
  </div>
</template>


<script>
import { Api } from "../axios-api";
import DragBoard from "../components/DragBoard.vue";
import DragCard from "../components/DragCard.vue";

export default {
  name: "ProjectRepoManager",
  components: {
    DragBoard,
    DragCard,
  },
  data() {
    return {
      project_connections: null
    }
  },
  created() {
    Api.get(
      "/groups/" + this.$route.params.id + "/project_repo_connections/"
    ).then((response) => {
      this.project_connections = this.formatedConnections(response.data);
    });
  },
  methods: {
    formatedConnections(raw) {
      raw.unmatched = [];
      for (let repo of raw.repos) {
        let project_id = raw.projects.findIndex(p => p.id == repo.project);

        if (project_id == -1) {
          raw.unmatched.push(repo);
        } else {
          if (raw.projects[project_id].gl_repos == undefined) raw.projects[project_id].gl_repos = [];
          raw.projects[project_id].gl_repos.push(repo)
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
}
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
</style>