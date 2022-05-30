<template>
  <div>
    <div :id="user + 'cp'" class="input-group" title="Using input value">
      <div class="input-group-prepend">
        <div class="input-group-text colorpicker-input-addon"><i></i></div>
      </div>

      <input type="text" class="form-control input-sm" :value="`#${color}`" />

      <div class="input-group-append">
        <button
          class="btn btn-primary"
          type="button"
          @click="this.$emit(saveColor, color)"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  props: ["color", "user"],
  methods: {},
  mounted() {
    this.$nextTick(() => {
      $(function () {
        $("#" + this.user + "cp").colorpicker();
      });
      console.log($("#" + this.user + "cp"));
    });
  },
};
</script>