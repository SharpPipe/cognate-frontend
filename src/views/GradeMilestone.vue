<template>
    <div class="container">
        <h4>{{ APIData.project_name }}</h4>

        <div class="row m-1">
            <div class="col-4 p-0">
                <RepoRadar :radardata="radarData" :key="key" />
            </div>
            <div class="col-8 px-3">
                <GitTime />
            </div>
        </div>

        <div class="row m-1">
            <div class="col" v-for="dev in 3" :key="dev">
                <RepoGradeStudent
                    :points="payload.students[dev - 1].points"
                    :devName="payload.students[dev - 1].name"
                    :key="key"
                    v-on:pointsChanged="updateRadar"
                />
            </div>
        </div>
        <div class="row mx-3 p-1">
            <RepoGradeTeam :radarData="radarData" :teampoints="teampoints" />
        </div>
        <div class="row mx-3 p-1 d-flex float-right">
            <button class="btn btn-success">Sumbit</button>
        </div>
    </div>
</template>

<script>
import RepoRadar from "../components/visualizations/RepoRadar";
import GitTime from "../components/visualizations/GitTime";
import RepoGradeStudent from "../components/RepoGradeStudent.vue";
import RepoGradeTeam from "../components/RepoGradeTeam.vue";

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
            teampoints: [
                { axis: "Retro", value: 0 },
                { axis: "Meeting", value: 0 },
                { axis: "Git Management", value: 0 },
                { axis: "Planning", value: 0 },
                { axis: "Tasks", value: 0 },
            ],
            payload: {
                students: [
                    {
                        name: "virve",
                        points: [
                            { axis: "Contribution", value: 0 },
                            { axis: "Retro", value: 0 },
                            { axis: "Meeting", value: 0 },
                            { axis: "Git Management", value: 0 },
                            { axis: "Planning", value: 0 },
                            { axis: "Tasks", value: 0 },

                        ]
                    },
                    {
                        name: "peeter",
                        points: [
                            { axis: "Contribution", value: 0 },
                            { axis: "Retro", value: 0 },
                            { axis: "Meeting", value: 0 },
                            { axis: "Git Management", value: 0 },
                            { axis: "Planning", value: 0 },
                            { axis: "Tasks", value: 0 },

                        ]
                    },
                    {
                        name: "virsik",
                        points: [
                            { axis: "Contribution", value: 0 },
                            { axis: "Retro", value: 0 },
                            { axis: "Meeting", value: 0 },
                            { axis: "Git Management", value: 0 },
                            { axis: "Planning", value: 0 },
                            { axis: "Tasks", value: 0 },

                        ]
                    },
                ]
            },
            radarData: [
                { axis: "Retro", value: 0 },
                { axis: "Meeting", value: 0 },
                { axis: "Git Management", value: 0 },
                { axis: "Planning", value: 0 },
                { axis: "Tasks", value: 0 },
            ],
            APIData: {
                'project_name': 'Minecraft',
            },
            minCoursePoints: 0,
            maxCoursePoints: 55,
        }
    },
    methods: {
        onTeamPointsChange() {
            for (var i in this.payload.students) {
                this.payload.students[i].points[1].value = this.teampoints[0].value
                this.payload.students[i].points[2].value = this.teampoints[1].value
            }
            this.radarData[0] = this.teampoints[0]
            this.radarData[1] = this.teampoints[1]
            console.log(this.key)
            this.key++;
        },
        updateRadar() {
            var numStudents = this.payload.students.length // eslint-disable-line
            this.teampoints[2].value = 0
            this.teampoints[3].value = 0
            this.teampoints[4].value = 0
            for (var i in this.payload.students) {
                this.teampoints[2].value += this.payload.students[i].points[3].value / numStudents
                this.teampoints[3].value += this.payload.students[i].points[4].value / numStudents
                this.teampoints[4].value += this.payload.students[i].points[5].value / numStudents
            }
            this.radarData[2].value = this.teampoints[2].value
            this.radarData[3].value = this.teampoints[3].value
            this.radarData[4].value = this.teampoints[4].value
        }


    },
    created() {
        this.teampoints.forEach(d => this.$watch(() => d.value, this.onTeamPointsChange))
    },
    computed: {
        currentPoints() {
            let sum = 0
            for (var thing in this.radarData) {
                sum += +this.radarData[thing].value
            }
            return sum
        }
    },
    watch: {
        keyz(k) {
            console.log(this.teampoints[2].value)
            console.log(k)
        }
    }
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