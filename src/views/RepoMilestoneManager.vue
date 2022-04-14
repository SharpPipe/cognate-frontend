<template>
  <div v-if="milestone_connections" class="container">
    <h1>Manage Repo Milestone</h1>
    <div>
      <div class="flexbox">
        <div
          class="border rounded p-0 my-2"
          v-for="ms in milestone_connections.grade_milestones"
          :key="ms.id"
        >
          <div class="w-25 p-3 my-2 float-left">
            <div>
              <div class="h3">Milestone {{ ms.milestone_order_id }}</div>
              <div class="mr-1 badge badge-pill badge-secondary">
                {{ ms.start.substring(0, 10) }}
              </div>
              <div class="badge badge-pill badge-secondary">
                {{ ms.end.substring(0, 10) }}
              </div>
            </div>
          </div>

          <DragBoard class="p-2 w-75 float-left bg-dark" :id="`board-${ms.id}`">
            <DragCard
              :id="`card-${gitlab_ms.id}`"
              draggable="true"
              v-for="gitlab_ms in ms.gl_milestones"
              :key="gitlab_ms.id"
              class="justify-content-center bg-secondary px-4 py-2 m-3"
            >
              <font-awesome-icon class="h3" icon="fa-brands fa-gitlab" />
              {{ gitlab_ms.title }}
            </DragCard>
          </DragBoard>
        </div>

        <!--  Unmatched  -->
        <div
          class="border rounded p-0 my-2"
          v-for="unmatched in milestone_connections.unmatched"
          :key="unmatched.id"
        >
          <div class="w-25 p-3 my-2 float-left">
            <div class="h3">Unmatched</div>
          </div>

          <DragBoard class="p-2 w-75 float-left bg-dark" id="board-unmatched">
            <DragCard
              :id="`card-${unmatched.id}-unmatched`"
              draggable="true"
              class="justify-content-center bg-secondary px-4 py-2 m-3"
            >
              <font-awesome-icon class="h3" icon="fa-brands fa-gitlab" />
              {{ unmatched.title }}
            </DragCard>
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
  name: "Groupadd",
  components: {
    DragBoard,
    DragCard,
  },
  data() {
    return {
      milestone_connections: null,
    };
  },
  created() {
    Api.get(
      "/projects/" + this.$route.params.repoid + "/milestone_connections/"
    ).then((response) => {
      this.milestone_connections = this.formatedConnections(response.data);
    });
  },
  methods: {
    formatedConnections(raw) {
      raw.unmatched = [];
      for (let gl_milestone of raw.milestones) {
        let gradeMSid = raw.grade_milestones.findIndex(
          (o) => o.id == gl_milestone.grade_milestone
        );

        if (gradeMSid == -1) {
          raw.unmatched.push(gl_milestone);
        } else {
          if (raw.grade_milestones[gradeMSid].gl_milestones == undefined) {
            raw.grade_milestones[gradeMSid].gl_milestones = [];
          }
          raw.grade_milestones[gradeMSid].gl_milestones.push(gl_milestone);
        }
      }
      return raw;
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
}
.flexbox .board .card {
  cursor: pointer;
}
</style>