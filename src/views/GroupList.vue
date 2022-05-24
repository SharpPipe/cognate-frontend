<template>
  <div class="groups">
    <div class="container">
      <div class="row d-flex">
        <h3 class="flex-grow-1">Groups</h3>
        <router-link :to="{ name: 'groupadd' }">
          <button class="btn btn-primary">&plus;</button>
        </router-link>
      </div>

      <div v-if="APIData">
        <table class="table table">
          <tr v-for="group in APIData" :key="group.id">
            <td>
              <div class="row justify-content-between">
                <div class="col my-auto">
                  <div>
                    <h5 class="text-capitalize">
                      <router-link
                        :to="{ name: 'group-projects', params: { groupid: group.id } }"
                        class="text-white"
                      >{{ group.name }}</router-link>
                    </h5>
                    <p class="text-muted m-0">{{ group.description }}</p>
                  </div>
                </div>

                <div
                  class="col-3 my-auto d-flex"
                  v-if="group.rights.includes('O') || group.rights.includes('A')"
                >
                  <router-link
                    tag="button"
                    class="btn-sm btn-secondary float-right"
                    :to="{ name: 'assessment', params: { groupid: group.id, name: group.name } }"
                  >Assessment Tree 🌳</router-link>
                  <router-link
                    tag="button"
                    class="btn-sm btn-secondary float-right"
                    :to="{
                      name: 'group-admin-view',
                      params: { groupid: group.id }
                    }"
                  >Config 📐</router-link>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <center v-else>
        <LoadingAnimation />
      </center>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import LoadingAnimation from "../components/LoadingAnimation.vue";


export default {
  name: 'GroupList',
  components: {
    LoadingAnimation,
  },
  data() {
    return {
      APIData: null
    }
  },
  created() {
    Api.get('groups/')
      .then(response => {
        this.APIData = response.data
      })
      .catch(err => {
        console.log(err)
      })
  },
}
</script>
