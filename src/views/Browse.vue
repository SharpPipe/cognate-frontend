<template>
  <div class="browse">
    <Navbar/>


    <div class="container-fluid px-5">
      <h3>Browse projects</h3>
      <div class="row d-flex">

        <div v-for="project in APIData" :key="project.id">

          <div class="col">
            <div class="card my-3">
              <div class="card-thumbnail">
                <img src="//placehold.it/300x150" class="img-fluid" alt="thumbnail">
              </div>
              <div class="card-body">
                <h3 class="card-title"><a href="#" class="text-secondary">{{ project.project_name }}</a></h3>
                <p class="card-text">{{ project.description }}</p>
              </div>
              <div class="card-footer">
                <p class="text-muted"><small class="text-muted">Last updated 3 mins ago</small></p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { Api } from '../axios-api'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Browse',
  data() {
    return {
      APIData: [{'id': 0, 'project_name': 'Minecraft', 'description': 'Blocks!'},
        {'id': 1, 'project_name': 'Braid', 'description': 'No time'},
        {'id': 2, 'project_name': 'The Witness', 'description': 'No self'},
        {'id': 3, 'project_name': 'Call of duty', 'description': 'Shoot people'},
        {'id': 4, 'project_name': 'Call of duty', 'description': 'Shoot people'},
        {'id': 5, 'project_name': 'Call of duty', 'description': 'Shoot people'},
        {'id': 6, 'project_name': 'Call of duty', 'description': 'Shoot people'},
      ]
    }
  },
  components: {
    Navbar,
  },
  created() {
    Api.get('/projects',)
        .then(response => {
          console.log('Post API has recieved data')
          this.APIData = response.data
        })
        .catch(err => {
          console.log(err)
        })
  }
}

</script>

<style scoped>

</style>
