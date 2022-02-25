<template>
    <div class="group-milestone-summary">
        <div class="container">
            <h4>Milestone 1</h4>

            <h4>Teams</h4>

            <div>
                <table class="table">
                    <thead class="thead">
                        <th scope="col">Team</th>
                        <td scoee="col">Developer</td>
                        <td>Effort</td>
                        <td>Retro</td>
                        <td>Meeting</td>
                        <td>Branches</td>
                        <td>Planning</td>
                        <td>Issues</td>
                        <th>Total</th>
                    </thead>
                    <tbody>
                        <template v-for="repo in APIData">
                            <tr v-for="(dev, i) in repo.project_data" :key="dev.id">
                                <!--             <td class="p-1">
              <img src="//place-hold.it/40" class="img-fluid" alt />
                                </td>-->

                                <th
                                    scope="row"
                                    v-if="i === 0"
                                    :rowspan="repo.project_data.length"
                                >{{ repo.project_name }}</th>
                                <td>{{ dev.username }}</td>
                                <td
                                    scope="row"
                                    v-if="dev.data[0].given_points"
                                >{{ +dev.data[0].given_points }}/{{ +dev.data[0].total }}</td>
                                <td
                                    scope="row"
                                    v-if="dev.data[1].given_points"
                                >{{ +dev.data[1].given_points }}/{{ +dev.data[1].total }}</td>
                                <td
                                    scope="row"
                                    v-if="dev.data[2].given_points"
                                >{{ +dev.data[2].given_points }}/{{ +dev.data[2].total }}</td>
                                <td
                                    scope="row"
                                    v-if="dev.data[3].given_points"
                                >{{ +dev.data[3].given_points }}/{{ +dev.data[3].total }}</td>
                                <td
                                    scope="row"
                                    v-if="dev.data[4].given_points"
                                >{{ +dev.data[4].given_points }}/{{ +dev.data[4].total }}</td>
                                <td
                                    scope="row"
                                    v-if="dev.data[5].given_points"
                                >{{ +dev.data[5].given_points }}/{{ +dev.data[5].total }}</td>
                                <th
                                    scope="row"
                                    v-if="dev.data[5].given_points"
                                >{{ sumpoints(dev.data) }}</th>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { Api } from "../axios-api";
import { mapState } from 'vuex'

export default {
    name: 'Home',
    computed: mapState(['APIData']),
    created() {
        const url = 'groups/' + this.$route.params.id + "/milestone/" + this.$route.params.msid + "/"
        Api.get(url)
            .then(response => {
                this.$store.state.APIData = response.data.data
            })
            .catch(err => {
                console.log(err)
            })

    },
    methods: {
        sumpoints(data) {
            return data.map(x => +x.given_points).reduce((acc, item) => acc + item, 0);
        }
    }
}
</script>