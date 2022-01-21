<template>
  <div class="repo">
    <Navbar/>

    <div class="container">
      <h3>Repo</h3>
      <div class="row">
        <div class="col-8 p-0">
          <h4>{{ APIData.project_name }}</h4>
          <img src="//placehold.it/800x400" class="img-fluid" alt="">


        </div>
        <div class="col-4 p-0">

          <h4>Work load balance</h4>
          <img src="//placehold.it/400/333333" class="img-fluid" alt="">

        </div>
      </div>

      <div class="row">

        <div class="col-12 p-0">
          <table class="table table-bordered">
            <tbody>
            <tr v-for="dev in APIData.developers" :key="dev">
              <td class="col-1" v-for="n in 8" :key="n">
                <div v-if="APIData.milestones[n-1] !== undefined">
                  {{ APIData.milestones[n - 1].time_spent.per_person[dev.name] }}h
                </div>
                <div v-else>
                  TBA
                </div>

              </td>

              <td class="col-4">{{ dev.name }}</td>
            </tr>
            <tr>
              <th class="col-1" v-for="n in 8" :key="n">
                <div v-if="APIData.milestones[n-1] !== undefined">
                  {{ APIData.milestones[n - 1].time_spent.total }}
                </div>
                <div v-else>
                  TBA
                </div>

              </th>

              <td class="col-4">total</td>
            </tr>


            </tbody>
            <thead>

            </thead>

          </table>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Repo',
  data() {
    return {
      APIData: {
        'project_name': 'Minecraft',
        'developers': [
          {'name': 'priit', 'status': 0},
          {'name': 'tiit', 'status': 0},
          {'name': 'viive', 'status': 1}
        ],
        'milestones': [
          {
            'name': 'First Milestone', 'issues': 12, 'issues_completed': 3,
            'time_spent': {
              'total': 34,
              'per_person': {
                'priit': 14,
                'tiit': 12,
                'viive': 8,
              },
            },
          },
          {
            'name': 'Second Milestone', 'issues': 18, 'issues_completed': 0,
            'time_spent': {
              'total': 0,
              'per_person': {
                'priit': 0,
                'tiit': 0,
                'viive': 0,
              },
            }
          },
        ]
      }
    }
  },
  components: {
    Navbar,
  },
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
