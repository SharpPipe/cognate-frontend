<template>
  <div class="milestone">
    <Navbar/>

    <div class="container">
      <div class="row">
        <div class="col-8">
          <h1>Devs</h1>
          <div class="row">
            <table class="table table-bordered">
              <tbody>
              <tr v-for="dev in APIData.developers" :key="dev">
                <td>{{ dev.name }}</td>
                <td>{{ dev.status }}</td>
              </tr>

              </tbody>

            </table>
          </div>

          <h1>Issues</h1>
          <div class="row">
            <table class="table table-bordered table-sm">
              <tbody>
              <tr v-for="issue in APIData.issues" :key="issue">
                <td class="col-1">#{{ issue.number }}</td>
                <td>{{ issue.title }}</td>
                <td>{{ issue.completed_by }}</td>
                <td>{{ issue.estimate }}</td>
                <td>{{ issue.spent }}</td>
              </tr>

              </tbody>

            </table>

          </div>

        </div>

        <div class="col-4 ">
          <h1>Grade</h1>
          <img src="//placehold.it/400/333333" class="img-fluid" alt="">
          <table class="table table-bordered table-sm">
            <tbody>
            <tr v-for="dev in APIData.developers" :key="dev">
              <td>{{dev.name}}</td>
              <td>4</td>
              <td>32</td>
              <td>3</td>
              <td>3</td>
            </tr>

            </tbody>
            <tfoot class="table-dark">
              <td>3</td>
              <td>4</td>
              <td>32</td>
              <td>3</td>
              <td>3</td>
            </tfoot>

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
        'milestone_name': 'First Milestone',
        'issues': [
          {
            'title': 'fix this',
            'number': 1,
            'completed_by': 'priit',
            'estimate': 4.5,
            'spent': 2,
          },
          {
            'title': 'add that',
            'number': 2,
            'completed_by': '',
            'estimate': 3,
            'spent': 0,
          },
        ],
        'time_spent': {
          'total': 34,
          'per_person': {
            'priit': 14,
            'tiit': 12,
            'viive': 8,
          },
        },
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
