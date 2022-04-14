<template>
    <div class="container">
        <h1>Manage Repo Milestone</h1>
    </div>
</template>

<script>
import { Api } from "../axios-api";

export default {
    name: 'Groupadd',
    data() {
        return {
            payload: {
                type: "AP",
                feedback: "",
            },
        }
    },
    methods: {
        postFeedback() {
            if (this.payload.feedback) {
                Api.post('/feedback/', this.payload)
                    .then(() => {
                        this.$router.push({ name: 'groups' })
                    })
                    .catch(err => {
                        this.error = err
                        console.log(err)
                    })
            }
        },
    },
}
</script>

<style scoped>
select,
select option {
    color: #dee2e6;
}

select:invalid,
select option[value=""] {
    color: #6c757d;
}
</style>