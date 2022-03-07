<template>
    <div class="container">
        <h3 v-if="APIData">{{APIData.project_name}}</h3>
        <div class="row m-1">
            <div class="col-4 p-0">
                <RepoRadar :radardata="radarData" :key="key" />
            </div>
            <div class="col-8 px-3">
                <GitTime :timeRange="range"/>
            </div>
        </div>

        <div class="row m-1">
            <div class="col" :v-if="APIData" v-for="dev in APIData.project_data" :key="dev.id">
                <RepoGradeStudent
                    :points="dev.data"
                    :devName="dev.username"
                    :spentTime="dev.spent_time"
                    v-on:pointsChanged="updateRadar"
                /> 
<!--                 <textarea class="form-control" aria-label="With textarea" placeholder="Comment (WIP does not work yet)"></textarea> -->
            </div>
        </div>
        <div class="row mx-3 p-1">
            <RepoGradeTeam :radarData="radarData" :teampoints="teampoints" />
        </div>
        <div class="row mx-3 p-1 ml-1">
            <div v-if="msg" class="alert alert-success" role="alert">{{msg}}</div>

            <div class="ml-auto mr-0">
                <button class="btn btn-success" @click="submitGrades">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
import RepoGradeStudent from "../components/RepoGradeStudent.vue";
import RepoGradeTeam from "../components/RepoGradeTeam.vue";
import { Api } from "../axios-api"
import { mapState } from 'vuex'

export default {
    name: 'Repo',
    components: {
        GitTime,
        RepoRadar,
        RepoGradeStudent,
        RepoGradeTeam,
    },
    data() {
        return {
            key: 0,  // to force update
            msg: null,
            teampoints: [
                { axis: "Retro", value: 0 },
                { axis: "Meeting", value: 0 },
                { axis: "Branch management", value: 0 },
                { axis: "Planning", value: 0 },
                { axis: "Issues", value: 0 },
            ],
            radarData: [
                { axis: "Retro", value: 0 },
                { axis: "Meeting", value: 0 },
                { axis: "Branch management", value: 0 },
                { axis: "Planning", value: 0 },
                { axis: "Issues", value: 0 },
            ],
            students: [],
            minCoursePoints: 0,
            maxCoursePoints: 55,
            range: [new Date(2022, 0, 24, 0,0,0), new Date(2022, 5, 16,0,0,0)]
        }
    },
    methods: {
        submitGrades() {
            let pl = this.makePayload()
            Api.post('/bulk_grade/', pl)
                .then(() => {
                    this.msg = "Points saved!"
                    console.log("Grades posted")
                })
                .catch(err => {
                    console.log(err)
                })
        },
        onTeamPointsChange() {
            for (var i in this.APIData.project_data) {
                this.APIData.project_data[i].data[1].given_points = this.teampoints[0].value
                this.APIData.project_data[i].data[2].given_points = this.teampoints[1].value
            }
            this.radarData[0] = this.teampoints[0]
            this.radarData[1] = this.teampoints[1]
            this.key++;
        },
        updateRadar() {
            var numStudents = this.APIData.project_data.length
            this.teampoints[2].value = 0
            this.teampoints[3].value = 0
            this.teampoints[4].value = 0
            for (var i in this.APIData.project_data) {
                this.teampoints[2].value += this.APIData.project_data[i].data[3].given_points / numStudents
                this.teampoints[3].value += this.APIData.project_data[i].data[4].given_points / numStudents
                this.teampoints[4].value += this.APIData.project_data[i].data[5].given_points / numStudents
            }
            this.radarData[2].value = this.teampoints[2].value
            this.radarData[3].value = this.teampoints[3].value
            this.radarData[4].value = this.teampoints[4].value
            this.key++;
        },
        makePayload() {
            let payload = []
            for (let i in this.APIData.project_data) {
                let studentpoints = []
                for (let p in this.APIData.project_data[i].data) {
                    studentpoints[p] = {
                        "user_group_id": this.APIData.project_data[i].id,
                        "grade_id": this.APIData.project_data[i].data[p].id,
                        "points": +this.APIData.project_data[i].data[p].given_points
                    }
                }
                payload.push.apply(payload, studentpoints)

            }
            console.log(payload)
            return payload
        }
    },
    created() {
        this.teampoints.forEach(d => this.$watch(() => d.value, this.onTeamPointsChange))
        this.$store.APIData = null
        this.range = [this.$route.params.start, this.$route.params.end]

        Api.get('/projects/' + this.$route.params.repoid + "/milestone/1/")
            .then(response => {
                this.$store.state.APIData = response.data.data
                console.log(response.data)
                this.$store.state.APIData.project_data.forEach(d => d.data.forEach(d => { return d.given_points = +d.given_points }))
                this.teampoints[0].value = this.APIData.project_data[0].data[1].given_points
                this.teampoints[1].value = this.APIData.project_data[0].data[2].given_points
                this.updateRadar()
            })
            .catch(err => {
                console.log(err)
            })
    },
    computed: {
        ...mapState(['APIData']),
        currentPoints() {
            let sum = 0
            for (var thing in this.radarData) {
                sum += +this.radarData[thing].value
            }
            return sum
        }
    },
}
</script>

<style >
input[type="range"] {
    -webkit-appearance: none;
    background-color: #dddddd;
    height: 10px;
    border-radius: 5px;
    box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.7);
}

input[type="range"]:focus {
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    background: #66ee66;
    box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
    border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
    height: 15px;
    width: 15px;
    background: #66ee66;
    box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
    border-radius: 50%;
}
</style>