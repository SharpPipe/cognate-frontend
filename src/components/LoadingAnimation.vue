<template>
<div>
  <img :src="isLightMode ? loadingGifLight : loadingGif" alt="loading"/>
  <center>
    <h5 class="text-monospace">LOADING</h5>
  </center>

</div>
</template>

<script>
export default {
  data() {
    return {
      loadingGif: require("./../../public/loading.gif"),
      loadingGifLight: require("./../../public/loadinglight.gif"),
      isLightMode: false
    };
  },
  mounted() {
    this.isLightMode = document.body.className === 'bootstrap'
  }
};
</script>