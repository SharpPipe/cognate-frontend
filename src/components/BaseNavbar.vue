<template>
  <div class="nav-bar" :class="{ 'bg-danger': isDevEnv, 'bg-dark': !isDevEnv }">
    <nav class="navbar navbar-expand-lg navbar-dark primary-color">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand font-italic font-weight-light" href="/">
        <div v-if="isDevEnv">Cognate Dev Env</div>
        <div v-else>Cognate</div>
      </a>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-1">
          <li class="nav-item nav-link">
            <router-link :to="{ name: 'groups' }" exact>Groups</router-link>
          </li>
          <li class="nav-item nav-link">
            <router-link :to="{ name: 'feedback' }" exact>Feedback</router-link>
          </li>
        </ul>

        <button class="btn btn-outline-info mx-2" v-if="accessToken != null">
          <router-link :to="{ name: 'profile' }">{{ username }} ⚙</router-link>
        </button>

        <button class="btn btn-outline-danger" v-if="accessToken != null">
          <router-link :to="{ name: 'logout' }">Logout</router-link>
        </button>

        <button
          type="button"
          class="btn btn-primary"
          v-if="accessToken == null"
          data-toggle="modal"
          data-target="#authModal"
        >Authenticate</button>
        <AuthModal />
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AuthModal from "./AuthModal";

export default {
  name: 'Navbar',
  computed: mapState(['accessToken', 'username']),
  components: {
    AuthModal,
  },
  data() {
    return {
      isDevEnv: false
    }
  },
  created() {
    this.isDevEnv = process.env.VUE_APP_API_URL == "193.40.156.142"
  }
}
</script>
