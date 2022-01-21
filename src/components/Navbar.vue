<template>
  <div class="nav-bar">
    <nav class="navbar navbar-expand-lg navbar-dark primary-color">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
              aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand font-italic font-weight-light" href="/">Cognate</a>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item nav-link">
            <router-link :to="{ name:'groups' }" exact>Groups</router-link>
          </li>

          <li class="nav-item nav-link">
            <router-link :to="{ name:'browse' }" exact>Browse</router-link>
          </li>
          <li class="nav-item disabled nav-link">
            <router-link :to="{ name:'pricing' }" exact>Pricing</router-link>
          </li>
          <li class="nav-item nav-link">
            <router-link :to="{ name:'signin' }" exact>signin</router-link>
          </li>
          <li class="nav-item nav-link">
            <router-link :to="{ name:'signup' }" exact>signup</router-link>
          </li>
        </ul>
        <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#authModal">Auth</button>
      </div>
      <div class="modal fade" id="authModal" tabindex="-1" role="dialog" aria-labelledby="authModalLabel"
           aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header" id="tab-content">
              <ul class="nav nav-tabs-justified">
                <li class="active nav-item">
                  <a class="nav-link active" href="#login" data-toggle="tab">Login</a></li>
                <li class="nav-item">
                  <a class="nav-link" href="#signup" data-toggle="tab">Signin</a></li>
              </ul>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>

            </div>
            <div class="modal-body">
              <div class="tab-content">
                <div class="tab-pane active" id="login">
                  <Signin/>
                </div>
                <div class="tab-pane" id="signup">
                  <Signup/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Signin from "./Signin";
import Signup from "./Signup";

export default {
  name: 'Navbar',
  components: {
    Signin,
    Signup,
  }
}
</script>

<style scoped>

</style>