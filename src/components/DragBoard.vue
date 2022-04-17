<template>
  <div :id="id" class="board" @dragover.prevent @drop.prevent="drop">
    <slot />
  </div>
</template>

<script>
import { Api } from "../axios-api";

export default {
  props: ["id"],
  methods: {
    drop: (e) => {
      const card_id = e.dataTransfer.getData("card_id");
      const card = document.getElementById(card_id);
      card.style.display = "flex";
      e.target.appendChild(card);

      let gitlab_milestone_id = card.id.split("-")[1];
      let cognate_milestone = e.target.id.split("-")[1];
      if (cognate_milestone == "unmatched") cognate_milestone = null;

      Api.put("/milestones/" + gitlab_milestone_id + "/grade_milestone/", {
        id: cognate_milestone,
      }).catch((error) => console.log(error));
    },
  },
};
</script>