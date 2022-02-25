<template>
  <div class="repos">
    <div class="container">
      <div class="row d-flex">
        <div class="flex-grow-1">
          <h2>{{ $route.params.name }}</h2>
        </div>
        <div class="text-muted">Group ID: {{ $route.params.group_id }}</div>
      </div>

      <h4>Milestones</h4>


      <table class="table">
        <tr>
          <router-link
            :to="{
              name: 'group-milestone-summary',
              params: {
                id: $route.params.id,
                msid: 1
              }
            }"
          >
            <td class="m-0 p-0">
              <p>Milestone 1</p>
              <p>---\----\---</p>
            </td>
          </router-link>

          <td class="m-0 p-0 h-100" v-for="n in 6" :key="n">
              <p>Milestone {{n+1}}</p>
              <p>---\----\---</p>
          </td>
        </tr>
      </table>

      <h4>Teams</h4>

      <div>
        <table class="table">
          <tr v-for="repo in APIData" :key="repo.id">
            <td class="p-1">
              <img src="//place-hold.it/40" class="img-fluid" alt />
            </td>

            <td class="p-1">
              <router-link
                :to="{ name: 'repo', params: { groupid: $route.params.id, repoid: repo.id } }"
                class="text-white"
              >{{ repo.name }}</router-link>

              <br />
<!--               <div class="badge badge-dark">
                Group ID:
                <small class>{{ repo.project_group }}</small>
              </div> -->
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
