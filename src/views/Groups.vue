<template>
  <div class="groups">
    <div class="container">
      <div class="row d-flex">
        <h3 class="flex-grow-1">Groups</h3>
        <router-link
          :to="{ name: 'groupadd'}"
        >
          <button class="btn btn-primary r-100">+</button>
        </router-link>
      </div>

      <div>
        <table class="table">
          <tr v-for="group in APIData" :key="group.id">
            <td>
              <div class="row justify-content-between">
                <div class="col-auto">
                  <img src="//placehold.it/120" class="img-fluid" alt />
                </div>

                <div class="col my-auto">
                  <div>
                    <h5 class="text-capitalize">
                      <router-link
                        :to="{ name: 'group-repos', params: { id: group.id, group_id: group.group_id, name: group.name } }"
                        class="text-white"
                      >{{ group.name }}</router-link>
                    </h5>
                    <p class="text-muted m-0">{{ group.description }}</p>
                    <p class="text-muted m-0">Children type: {{ group.children_type }}</p>
                  </div>
                </div>
                <router-link
                  :to="{ name: 'grading', params: { id: group.id, name: group.name } }"
                  class="text-white"
                >
                  <button class="btn btn-primary">GradingTree</button>
                </router-link>

                <GroupChartMini />
              </div>
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
import GroupChartMini from "../components/visualizations/GroupChartMini";

export default {
  name: 'Groups',
  data() {
    return {
    }
  },
  components: {
    GroupChartMini,
  },
  computed: mapState(['APIData']),
  created() {
    Api.get('groups/')
      .then(response => {
        this.$store.state.APIData = response.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
