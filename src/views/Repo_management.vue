<template>
  <div class="repos">
    <div class="container">
      <div class="row d-flex">
        <div class="flex-grow-1">
          <h3>{{ $route.params.name }}</h3>
        </div>
        <div class="text-muted">Group ID: {{ $route.params.group_id }}</div>
      </div>

      <div>
        <table class="table">
          <tr v-for="repo in APIData" :key="repo.id">
            <td class="p-1">
              <img src="//placehold.it/80" class="img-fluid" alt />
            </td>

            <td class="p-1">
              <router-link
                :to="{ name: 'repo', params: { groupid: $route.params.id, repoid: repo.id } }"
                class="text-white"
              >{{ repo.name }}</router-link>

              <br />
              <div class="badge badge-dark">
                Group ID:
                <small class>{{ repo.project_group }}</small>
              </div>
            </td>

            <td class="p-1">
              <div class="col my-auto">
                <div class="text-secondary">
                </div>
              </div>
            </td>

            <td class="p-1">
              <RepoChartMini class="float-right" />
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import { mapState } from 'vuex'
import RepoChartMini from "../components/visualizations/RepoChartMini";

export default {
  name: 'Home',
  components: {
    RepoChartMini,
  },
  computed: mapState(['APIData']),
  created() {
    const url = 'projects/' + this.$route.params.id + "/"
    Api.get(url)
      .then(response => {
        this.$store.state.APIData = response.data

      })
      .catch(err => {
        console.log(err)
      })

  }
}
</script>
