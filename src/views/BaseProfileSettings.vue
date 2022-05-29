<template>
  <div class="container">
    <h2 class="text-info">{{ username }}</h2>
    <div class="row mb-3">
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
    <!--       <div v-if="invitations"> -->
    <div>
      <h4>Group Invitations</h4>
      <ul class="list-group list-group-flush">
        <li
          class="
            list-group-item
            d-flex
            justify-content-between
            align-items-center
            py-1
          "
          v-for="group in invitations"
          :key="group"
        >
        <span>
          <b>{{ group.name }}</b>
          &nbsp;
          <small>{{ group.description }}</small>
        </span>

          <div>
            <button
              type="button"
              class="btn-sm btn-danger mr-3"
              @click="rejectInvitation(group.id)"
            >
              Reject
            </button>
            <button
              type="button"
              class="btn-sm btn-success"
              @click="acceptInvitation(group.id)"
            >
              Accept
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import { mapState } from "vuex";
import $ from "jquery";

export default {
  name: "BaseProfileSettings",
  computed: mapState(["username"]),
  data() {
    return {
      gitlab_token: "",
      userData: "",
      invitations: [1, 3, 4],
    };
  },
  created() {
    Api.get("/profile/")
      .then((response) => {
        this.userData = response.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

    this.getInvitations();

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
    });
  },
  methods: {
    submitToken() {
      Api.put("profile/", { gitlab_token: this.gitlab_token }).catch((err) => {
        console.log(err);
      });
    },
    copyId() {
      navigator.clipboard.writeText(this.userData.identifier);
      let btn = $("#copy-button");
      btn.attr("title", "Copied!");
      btn.attr("data-original-title", "Copied!");
      btn.tooltip("update");
    },
    getInvitations() {
      Api.get("/invitations/")
        .then((response) => {
          this.invitations = response.data.data.invitation;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    rejectInvitation(invitation) {
      Api.post("/groups/" + invitation + "/accept_invitation/", {
        accept: false,
      })
        .then(() => this.getInvitations())
        .catch((err) => {
          console.log(err);
        });
    },
    acceptInvitation(invitation) {
      Api.post("/groups/" + invitation + "/accept_invitation/", {
        accept: true,
      })
        .then(() => this.getInvitations())
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
