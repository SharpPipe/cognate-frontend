<template>
  <div class="container">
    <form>
      <h2 class="text-info">{{ username }}</h2>
      <div class="row">
        <div class="col">
          <div class="">
            <label>Your Gitlab API Token</label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Access Token"
                v-model="gitlab_token"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-primary"
                  type="button"
                  @click="submitToken"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <small class="form-text text-muted float-right">
            <a
              href="https://gitlab.cs.ttu.ee/-/profile/personal_access_tokens"
              class="alert-link"
              target="_blank"
              rel="noopener noreferrer"
              >Generate a new Gitlab Token</a
            >
          </small>
        </div>

        <div class="col">
            <label>Your identifier code (send it to your project manager)</label>
          <form>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                disabled
                :value="userData.identifier"
                placeholder="identifier"
                id="copy-input"
              />
              <div class="input-group-append">
                <button
                  class="btn border"
                  type="button"
                  id="copy-button"
                  @click="copyId"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Copy to Clipboard"
                >
                  Copy
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import { mapState } from "vuex";
import $ from "jquery"

export default {
  name: "BaseProfileSettings",
  computed: mapState(["username"]),
  data() {
    return {
      gitlab_token: "",
      userData: "",
    };
  },
  created() {
    $('#copy-button').tooltip();
    Api.get("/profile/")
      .then((response) => {
        this.userData = response.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

  $(function () {
    $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
  });
},
  methods: {
    submitToken() {
      Api.put("profile/", { gitlab_token: this.gitlab_token }).catch((err) => {
        console.log(err);
      });
    },
    copyId() {
      navigator.clipboard.writeText(this.userData.identifier)
      let btn = $('#copy-button')
      btn.attr("title", "Copied!")
      btn.attr("data-original-title", "Copied!")
      btn.tooltip('update')
    }
  },
};
</script>
