<template>
    <main class="form-signin">
        <div class="card">
               <div class="card-body">
                    <form>
                        <h2 class="h3 mb-3 fw-normal text-center">Please sign up</h2>

                        <div class="form-group">
                            <label>First Name</label>
                            <input type="text" class="form-control form-control-lg" placeholder="First name"/>
                        </div>

                        <div class="form-group">
                            <label>Last Name</label>
                            <input type="text" class="form-control form-control-lg" placeholder="Last name"/>
                        </div>

                        <div class="form-group">
                            <label>Email address</label>
                            <input type="email" class="form-control form-control-lg" placeholder="Email address" />
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" class="form-control form-control-lg" placeholder="Password"/>
                        </div>

                        <router-link class="w-100 btn btn-lg btn-primary" type="submit" to="/signin">Sign up</router-link>
                    </form>
                </div>
        </div>
    </main>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {

        }
    }
</script>

<style lang="css">
</style>