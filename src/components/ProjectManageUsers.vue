<template>
  <div class="row">
    <div class="col border-right m-3 p-2">
      <h4>Members</h4>
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

          <div>
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
                  v-for="role in ['B', 'V', 'M', 'E', 'T', 'A', 'O']"
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
          </div>
        </li>
      </ul>
    </div>

    <div class="col-4 m-3 p-2">
      <h4>Teachers & Mentors</h4>
      <ul class="list-group list-group-flush">
        <li
          class="
            list-group-item
            d-flex
            justify-content-between
            align-items-center
            py-1
          "
          v-for="user in groupUsers"
          :key="user.account.id"
        >
          <div v-if="user.roles.includes('A') || user.roles.includes('O')">
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

          <div>
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
                  v-for="role in ['B', 'V', 'M', 'E', 'T', 'A', 'O']"
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
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Api } from "../axios-api";
import $ from "jquery";

export default {
  name: "ProjectManageUsers",
  data() {
    return {
      users: [],
      groupUsers: [],
      roleNames: {
        B: "Blank",
        V: "Visitor",
        M: "Member",
        E: "Mentor",
        T: "Teacher",
        A: "Admin",
        O: "Owner",
      },
    };
  },
  created() {
    this.getProjectUsers();
    this.getGroupUsers();

    // Prevent my multiselect dropdown from closing when clicking on a label
    $(document).on("click", ".dropdown-menu", function (e) {
      e.stopPropagation();
    });
  },
  methods: {
    getProjectUsers() {
      Api.get("/projects/" + this.$route.params.repoid + "/users/")
        .then((response) => {
          this.users = response.data.data.by_user;
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
    getGroupUsers() {
      Api.get("/groups/" + this.$route.params.groupid + "/users/")
        .then((response) => {
          this.groupUsers = response.data.data.by_user;
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
    updateRole(role, user) {
      let member = this.users.find(u => u.account.username === user.account.username)
      let memberRoles = []
      if (member) memberRoles = member.roles
      console.log(user)
      console.log(member)

      if (user.roles.includes(role) || memberRoles.includes(role)) {
        Api.delete("/projects/" + this.$route.params.repoid + "/users/", {
          data: {
            id: user.account.id,
            rights: role,
          },
        })
          .then((response) => {
            this.success = response.data.message;
            this.getProjectUsers();
          })
          .catch((err) => {
            this.error = err;
            console.log(err);
          });
      } else {
        Api.post("/projects/" + this.$route.params.repoid + "/users/", {
          id: user.account.id,
          rights: role,
        })
          .then((response) => {
            this.success = response.data.message;
            this.getProjectUsers();
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