<template>
  <div :id="id" class="board" @dragover.prevent @drop.prevent="drop">
    <slot />
  </div>
</template>

<script>

export default {
  props: ["id"],
  methods: {
    drop(e) {
      const card_id_raw = e.dataTransfer.getData("card_id");
      const card = document.getElementById(card_id_raw);
      card.style.display = "block";
      e.target.appendChild(card);

      let card_id = card.id.split("-")[1];
      let board_id = e.target.id.split("-")[1];
      if (board_id == "unmatched") board_id = null;

      this.$emit("cardDropped", card_id, board_id)
    },
  },
};
</script>