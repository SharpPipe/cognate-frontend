<template>
  <div class="container">
    <h2 class="text-info">{{ username }}</h2>
    <div class="row mb-3">
      <div class="col">
        <div class="">
          <label
            >Your Gitlab API Token
            <label
              class="mb-1"
              data-toggle="tooltip"
              data-placement="top"
              data-html="true"
              title="Cognate only needs <b>read-api</b> rights"
            >
              <font-awesome-icon icon="fa-solid fa-circle-info" />
            </label>
          </label>
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
        <div class="mt-3">
          <label
            >Save your password
            <label
              class="mb-1"
              data-toggle="tooltip"
              data-placement="top"
              title="When your account is connected with a GitLab token, your password is used to decrypt it. Thus when refresshing GitLab data, you have to send your password to the database. If this chekbox is ticked then the password is stored in your browsers local storage otherwise you have to insert your password upon every refresh of a group. Storing your password in local storage involves some risk."
            >
              <font-awesome-icon icon="fa-solid fa-circle-info" />
            </label>
          </label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <input
                  type="checkbox"
                  v-model="userData.store_password"
                  aria-label="Checkbox for following text input"
                />
              </div>
            </div>
            <input
              type="password"
              class="form-control"
              :disabled="!userData.store_password"
              v-model="enteredPassword"
              aria-label="Text input with checkbox"
            />
            <div class="input-group-append">
              <button
                class="btn btn-warning"
                type="button"
                @click="checkPassword"
              >
                Submit
              </button>
            </div>
          </div>
          <div>
            {{ passwordSendMsg }}
          </div>
        </div>
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
    <div>
      <h4 v-if="invitations">Group Invitations</h4>
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
      invitations: [],
      passwordSendMsg: null,
      enteredPassword: "",
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
    submitSavePassword() {
      Api.put("profile/", {
        store_password: this.userData.store_password,
      })
        .then(() => {
          this.passwordSendMsg = "Success";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkPassword() {
      if (this.userData.store_password) {
        this.$store
          .dispatch("loginUser", {
            username: this.username,
            password: this.enteredPassword,
          })
          .then(() => {
            this.submitSavePassword();
            this.$store.commit("updatePassword", this.enteredPassword);
          })
          .catch((error) => {
            console.log(error);
            this.passwordSendMsg = "Wrong credentials";
          });
      } else {
        this.submitSavePassword();
        this.$store.commit("updatePassword", null);
      }
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
          this.invitations = response.data.data.invitations;
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
