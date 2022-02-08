<template>
    <div class="container">
        <form>
            <h2 class="text-info">{{ username }}</h2>
            <div class="row">
                <div class="col">
                    <form class="form-group" v-on:submit.prevent="submitToken">
                        <label for="exampleInputEmail1">Your Gitlab API Token</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    aria-describedby="tokenHelp"
                                    placeholder="Access Token"
                                    v-model="gitlab_token"
                                />

                        <small class="form-text text-muted float-right">
                                <a
                                    href="https://gitlab.cs.ttu.ee/-/profile/personal_access_tokens"
                                    class="alert-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >Generate a new Gitlab Token</a>
                                <!-- target and rel to open the link in new tab -->
                        </small>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary my-3">Submit</button>
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
