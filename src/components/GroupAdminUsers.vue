<template>
  <div class="row">
    <div class="col border-right m-3 p-2">
      <ul class="list-group list-group-flush">
        <li
          class="
            list-group-item
            d-flex
            justify-content-between
            align-items-center
            py-1
          "
          v-for="user in users"
          :key="user.account.id"
        >
          <div>
            <b>
              {{ user.account.username }}
            </b>
            <br />
            <div
              class="badge border badge-pill"
              v-for="role in user.roles"
              :key="role"
            >
              {{ roleNames[role] }}
            </div>
          </div>

          <div class="dropdown">
            <button
              class="btn-sm btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
            >
              Roles
            </button>
            <ul class="dropdown-menu">
              <li
                v-for="role in ['O', 'A', 'V', 'B']"
                :key="role"
                class="dropdown-item py-0 m-0"
              >
                <label class="checkbox">
                  <input
                    type="checkbox"
                    :checked="user.roles.includes(role)"
                    @change="updateRole(role, user)"
                  />
                  {{ roleNames[role] }}
                </label>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div class="col m-3 p-2">
      <div class="row no-gutters d-flex"></div>
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="User identifier"
          v-model="inviteUserId"
        />
        <div class="input-group-append">
          <button class="btn btn-primary" type="button" @click="inviteUser">
            Invite user
          </button>
        </div>
      </div>
      <div>
        <ul class="list-group list-group-flush">
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
              py-1
            "
            v-for="invitation in pendingInvitations"
            :key="invitation"
          >
            {{ invitation }}
            <button
              type="button"
              class="btn-sm btn-danger"
              @click="deleteInvitation(invitation)"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { Api } from "../axios-api";

export default {
  name: "GroupAdminUsers",
  data() {
    return {
      success: "",
      error: "",

      pendingInvitations: [],
      inviteUserId: null,
      users: [],
      roleNames: {
        O: "Owner",
        A: "Admin",
        V: "Visitor",
        B: "Blank",
      },
    };
  },
  created() {
    this.getPendingInvitations();
    this.getGroupUsers();

    // Prevent my multiselect dropdown from closing when clicking on a label
    $(document).on("click", ".dropdown-menu", function (e) {
      e.stopPropagation();
    });
  },
  methods: {
    getPendingInvitations() {
      Api.get("/groups/" + this.$route.params.groupid + "/invitations/")
        .then((response) => {
          this.pendingInvitations = response.data.data.identifiers;
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
    inviteUser() {
      Api.post("/groups/" + this.$route.params.groupid + "/invitations/", {
        identifier: this.inviteUserId,
      })
        .then((response) => {
          this.success = response.data.message;
          this.getPendingInvitations();
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
    deleteInvitation(id) {
      Api.delete("/groups/" + this.$route.params.groupid + "/invitations/", {
        data: {
          identifier: id,
        },
      })
        .then((response) => {
          this.success = response.data.message;
          this.getPendingInvitations();
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
    getGroupUsers() {
      Api.get("/groups/" + this.$route.params.groupid + "/users/")
        .then((response) => {
          this.users = response.data.data.by_user;
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
    updateRole(role, user) {
      if (user.roles.includes(role)) {
        Api.delete("/groups/" + this.$route.params.groupid + "/users/", {
          data: {
            id: user.account.id,
            role: role,
          },
        })
          .then((response) => {
            this.success = response.data.message;
            this.getGroupUsers();
          })
          .catch((err) => {
            this.error = err;
            console.log(err);
          });
      } else {
        Api.post("/groups/" + this.$route.params.groupid + "/users/", {
          id: user.account.id,
          role: role,
        })
          .then((response) => {
            this.success = response.data.message;
            this.getGroupUsers();
          })
          .catch((err) => {
            this.error = err;
            console.log(err);
          });
      }
    },
  },
};
</script>
<style scoped>
.dropdown-menu {
  min-width: 5rem;
}
</style>
