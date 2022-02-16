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
            <td>
              <img src="//placehold.it/80" class="img-fluid" alt />
            </td>

            <td>
              <router-link
                :to="{ name: 'repo', params: { groupid: $route.params.id, repoid: repo.id } }"
                class="text-white"
              >{{ repo.name }}</router-link>

              <br />
              <a :href="`${repo.url}`" class="badge badge-dark">
                GitLab ID:
                <small class>{{ repo.id }}</small>
              </a>
            </td>

            <td>
              <div class="col my-auto">
                <div class="text-secondary">
                  Best Management
                  <br />0.00 | 1.2 | 23
                </div>
              </div>
            </td>

            <td>
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
  data() {
    return {
    }
  },
  components: {
    RepoChartMini,
  },
  computed: mapState(['APIData']),
  created() {
    const url = 'groups/' + this.$route.params.id + '/projects/'
    Api.get(url, { headers: { Authorization: `Bearer ${this.$store.state.accessToken}` } })
      .then(response => {
        this.$store.state.APIData = response.data.data
      })
      .catch(err => {
        console.log(err)
      })

  }
}
</script>
