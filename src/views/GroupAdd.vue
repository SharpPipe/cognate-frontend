<template>
    <div class="container">
        <form>
            <h2 class="text-info">Create new Group</h2>
            <div class="row">
                <div class="col">
                    <form class="form-group" v-on:submit.prevent="createGroup">
                        <input
                            type="text"
                            class="form-control my-1"
                            placeholder="Group name"
                            v-model="payload.name"
                        />
                        <input
                            type="text"
                            class="form-control my-1"
                            placeholder="Group description"
                            v-model="payload.description"
                        />
                        <div class="row m-0">
                            <div class="col-8 p-0 pr-1">
                                <input
                                    type="text"
                                    class="form-control my-0"
                                    placeholder="Group ID"
                                    v-model="payload.group_id"
                                />
                            </div>
                            <div class="col p-0">
                                <select
                                    required
                                    class="form-control my-0"
                                    v-model="payload.children_type"
                                >
                                    <option
                                        value=""
                                        selected
                                        disabled
                                        hidden
                                    >Children</option>
                                    <option value="P">Projects</option>
                                    <option value="G">Groups</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <button type="submit" class="btn btn-primary my-2">Create new Group</button>
                        </div>
                    </form>
                </div>
                <div class="col">
                    <div class="alert alert-success" role="alert" v-if="success">{{ success }}</div>
                    <div class="alert alert-danger" role="alert" v-if="error">{{ error }}</div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { Api } from "../axios-api";

export default {
    name: 'Groupadd',
    data() {
        return {
            payload: {
                name: "",
                description: "",
                group_id: "",
                children_type: "",
            },
            success: "",
            error: "",
        }
    },
    methods: {
        createGroup() {
            // front#65 need to leave out group_id if it is blank, otherwise backend will be confused
            if (this.payload.group_id == "") delete this.payload.group_id

            Api.post('/groups/', this.payload)
                .then(() => {
                    this.success = 'New group created!'
                    this.$router.push({ name: 'groups' })
                })
                .catch(err => {
                    this.error = err
                    console.log(err)
                })
        },
    },
}
</script>

<style scoped>
select, select option {
  color: #dee2e6;
}

select:invalid,
select option[value=""] {
  color: #6c757d;
}
</style>