<template>
    <div class="container">
        <form>
            <h2 class="text-info">{{ username }}</h2>
            <div class="row">
                <div class="col">
                    <form class="form-group" v-on:submit.prevent="submitToken">
                        <label for="exampleInputEmail1">Your Gitlab API Token</label>
                        <div class="row d-flex mx-0">
                            <div class="flex-grow-1">
                                <input
                                    type="text"
                                    class="form-control"
                                    aria-describedby="tokenHelp"
                                    placeholder="Access Token"
                                    v-model="gitlab_token"
                                />
                            </div>
                            <div class>
                                <a
                                    href="https://gitlab.cs.ttu.ee/-/profile/personal_access_tokens"
                                    class="btn btn-outline-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >Generate</a>
                                <!-- target: open in new tab -->
                            </div>
                        </div>

                        <small class="form-text text-muted">Do not share it!</small>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
                <div class="col">
                    <div
                        class="alert alert-success"
                        role="alert"
                        v-if="success"
                    >{{success}}</div>
                    <div
                        class="alert alert-danger"
                        role="alert"
                        v-if="error"
                    >{{error}}</div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { Api } from "../axios-api";
import { mapState } from 'vuex'

export default {
    name: 'Profile',
    computed: mapState(['username']),
    data() {
        return {
            gitlab_token: "",
            success: "",
            error: "",
        }
    },
    methods: {
        submitToken() {
            Api.put('profile/', { 
                    gitlab_token: this.gitlab_token 
                })
                .then(response => {
                    this.success = "Great success!"
                    console.log(response.data)
                })
                .catch(err => {
                    this.error = err
                    console.log(err)
                })
        },
    },
}
</script>
