<template>
<div>
  <img :src="loadingGif" alt="loading"/>
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
    };
  },
};
</script>