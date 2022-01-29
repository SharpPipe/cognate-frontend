<template>
  <div class="repos">
    <div class="container">
      <h3>Project Management</h3>

      <div v-for="group in APIData" :key="group.id">
        <div class="col py-2">
          <div v-for="repo in group.repos" :key="repo.id">

            <div class="card w-100">
              <div class="row justify-content-between">
                <div class="col-auto">
                  <img src="//placehold.it/100" class="card-img" alt="">
                </div>

                <div class="col-4 my-auto px-0">
                  <div class="card-block">
                    <h5 class="card-title">
                      <!-- TODO add real routing -->
                      <a class="text-primary" href="/repo">{{ repo.repo_title }} </a>
                    </h5>
                    <div class="row px-2">
                      <div v-for="dev in repo.developers" v-bind:key="dev[0]">
                        <button      v-if="dev[1] === 0" type="button" class="btn btn-outline-success btn-sm mx-1">{{dev[0]}}</button>
                        <button v-else-if="dev[1] === 1" type="button" class="btn btn-outline-warning btn-sm mx-1">{{dev[0]}}</button>
                        <button v-else-if="dev[1] === 2" type="button" class="btn btn-outline-danger btn-sm mx-1">{{dev[0]}}</button>
                        <button v-else-if="dev[1] === 3" type="button" class="btn btn-outline-secondary btn-sm mx-1">{{dev[0]}}</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col my-auto">
                  <div class="text-secondary">
                    {{repo.status}} | 0.00 | 1.2 | 23

                  </div>

                </div>

                <div class="col my-auto d-flex justify-content-end">
                  <img class="px-2 img-fluid"
                       src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Sparkline_sp500.svg/188px-Sparkline_sp500.svg.png"
                       alt="sparkline"/>
                </div>
              </div>
            </div>

          </div>

          <div class="card w-100">
            <div class="row">
              <div class="col-auto py-2 px-3">
                <button type="button" class="btn btn-outline-info btn-sm mx-1">Õppejõud: {{ group.teacher }}</button>
                <button type="button" class="btn btn-outline-info btn-sm mx-1">Mentor: {{ group.mentor }}</button>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      APIData: [
        {
          'id': 0,
          'teacher': 'Gert',
          'mentor': 'Mart',
          'repos': [
            {
              'id': 0,
              'status': 'No problems',
              'repo_title': 'iti0000-Minecraft',
              'developers': [['priit', 0], ['tiit', 0], ['viive', 1]],
            },
            {
              'id': 1,
              'status': 'No problems',
              'repo_title': 'iti0000-Braid',
              'developers': [['ülle', 0], ['liisa', 2], ['ann', 0]],
            },
            {
              'id': 2,
              'status': 'No problems',
              'repo_title': 'iti0000-The_Witness',
              'developers': [['toivo', 1], ['jaanus', 1], ['meelis', 3]],
            }
          ]
        },
        {
          'id': 1,
          'teacher': 'Ago',
          'mentor': 'Kristjan',
          'repos': [
            {
              'id': 3,
              'status': 'No problems',
              'repo_title': 'iti0000-Spiral_Knights',
              'developers': [['priit', 1], ['tiit', 0], ['viive', 0]],
            },
            {
              'id': 4,
              'status': 'No problems',
              'repo_title': 'iti0000-ShenzenIO',
              'developers': [['ülle', 1], ['liisa', 2], ['ann', 1]],
            },
            {
              'id': 5,
              'status': 'No problems',
              'repo_title': 'iti0000-Opus_Magnum',
              'developers': [['toivo', 3], ['jaanus', 3], ['meelis', 3]],
            }
          ]
        },
      ]
    }
  },
}
</script>
