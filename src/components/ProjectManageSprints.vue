
<template>
  <div v-if="milestone_connections" class="container">
    <div>
      <div class="flexbox">
        <div
          class="border rounded p-0 my-2"
          v-for="ms in milestone_connections.assessment_milestones"
          :key="ms.id"
        >
          <div class="w-25 p-2 my-2 float-left">
            <div>
              <div class="h3">Milestone {{ ms.milestone_order_id }}</div>
              <div class="mr-1 badge badge-pill badge-secondary">{{ ms.start.substring(0, 10) }}</div>
              <div class="badge badge-pill badge-secondary">{{ ms.end.substring(0, 10) }}</div>
            </div>
          </div>

          <DragBoard
            class="p-2 w-75 float-left bg-dark flex-grow-1"
            :id="`board-${ms.id}`"
            v-on:cardDropped="changeMilestone"
          >
            <DragCard
              :id="`card-${gitlab_ms.id}`"
              draggable="true"
              v-for="gitlab_ms in ms.gl_milestones"
              :key="gitlab_ms.id"
              class="justify-content-center d-flex bg-secondary p-2 m-3"
            >
            <span>

              <a :href="gitlab_ms.gitlab_link" target="_blank">
                <font-awesome-icon class="h5" icon="fa-brands fa-gitlab" />
              </a> &nbsp;
              {{ gitlab_ms.title }}
            </span>
            </DragCard>
            <div class="py-5" /> <!-- Needed so the DragBoard doesn't shrink -->
          </DragBoard>
        </div>

        <!--  Unmatched  -->
        <div class="border rounded p-0 my-2">
          <div class="w-25 p-2 my-2 float-left">
            <div class="h3">Unmatched</div>
          </div>

          <DragBoard
            class="p-2 w-75 float-left bg-dark col-lg-auto flex-grow-1"
            id="board-unmatched"
            v-on:cardDropped="changeMilestone"
          >
            <DragCard
              v-for="unmatched in milestone_connections.unmatched"
              :key="unmatched.id"
              :id="`card-${unmatched.id}-unmatched`"
              draggable="true"
              class="justify-content-center d-flex bg-secondary p-2 m-3 col-lg-auto"
            >
            <span>
              <a :href="unmatched.gitlab_link" target="_blank">
              <font-awesome-icon class="h5" icon="fa-brands fa-gitlab" />
              </a> &nbsp;
              {{ unmatched.title }}
            </span>
            </DragCard>
            <div class="py-5" /> <!-- Needed so the DragBoard doesn't shrink -->
          </DragBoard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import DragBoard from "./DragBoard.vue";
import DragCard from "./DragCard.vue";

export default {
  name: "ProjectManageSprints",
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
        let assessmentMSid = raw.assessment_milestones.findIndex(
          (o) => o.id == gl_milestone.assessment_milestone
        );

        if (assessmentMSid == -1) {
          raw.unmatched.push(gl_milestone);
        } else {
          if (raw.assessment_milestones[assessmentMSid].gl_milestones == undefined) {
            raw.assessment_milestones[assessmentMSid].gl_milestones = [];
          }
          raw.assessment_milestones[assessmentMSid].gl_milestones.push(gl_milestone);
        }
      }
      return raw;
    },
    changeMilestone(card_id, board_id) {
      Api.put("/milestones/" + card_id + "/assessment_milestone/", {
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
  flex-wrap: wrap;
}
.flexbox .board .card {
  cursor: pointer;
}
</style>