<template>
    <div class="group-milestone-summary">
        <div class="container">
            <h4>Milestone {{ $route.params.msid }}</h4>

            <h4>Teams</h4>

            <div>
                <table class="table table-sm">
                    <thead class="thead">
                        <th scope="col">Team</th>
                        <td scope="col">Developer</td>
                        <td scope="col"
                        v-for="(g,i) in gradeCategories" :key="i">{{g}}</td>
                        <th>Total</th>
                    </thead>
                    <tbody>
                        <template v-for="repo in APIData">
                            <tr v-for="(dev, i) in repo.users_data" :key="dev.id">
                                <th
                                    scope="row"
                                    v-if="i === 0"
                                    :rowspan="repo.users_data.length"
                                >{{ repo.project_name }}</th>
                                <td>
                                    <svg class="m-0 p-0" height="12" width="12">
                                        <circle cx="6" cy="6" r="6" :fill="`#${dev.colour}`" />
                                    </svg>
                                    {{ dev.username }}
                                </td>
                                <td
                                    scope="row"
                                    v-for="point in dev.data" :key="point.id"
                                >{{ +point.given_points }}/{{ +point.total }}</td>
                                <th
                                    scope="row"
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

export default {
    name: 'Home',
    data() {
        return {
            APIData: null,
            gradeCategories: null,
        }
    },
    created() {
        const url = 'groups/' + this.$route.params.groupid + "/milestone/" + this.$route.params.msid + "/"
        Api.get(url)
            .then(response => {
                this.APIData = response.data.data
                this.gradeCategories = this.APIData[0].users_data[0].data.map(g => g.name)
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