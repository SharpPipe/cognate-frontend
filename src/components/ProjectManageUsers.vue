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
            <div class="badge border">
              <svg
                class="m-0 p-0"
                height="24"
                width="24"
                v-if="memberColors[user.account.username]"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="12"
                  :fill="`#${memberColors[user.account.username]}`"
                />
              </svg>
              <span class="h5">
                {{ user.account.username }}
              </span>
            </div>

            <br />
            <div
              class="badge border badge-pill"
              v-for="role in userRoles[user.account.username]"
              :key="role"
            >
              {{ roleNames[role] }}
            </div>
          </div>
<div class="row no-gutters">

          <div class="mr-3" v-if="memberColors[user.account.username]">
            <label>Change users color</label>
            <div class="input-group">
              <input
                type="text"
                class="form-control input-sm"
                v-model="memberColors[user.account.username]"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-outline-primary"
                  type="button"
                  @click="saveColor(user)"
                >
                  Submit
                </button>
              </div>
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
                      :checked="userRoles[user.account.username].includes(role)"
                      @change="updateRole(role, user)"
                    />
                    {{ roleNames[role] }}
                  </label>
                </li>
              </ul>
            </div>
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
          v-for="user in groupUsers.filter(
            (u) => u.roles.includes('A') || u.roles.includes('O')
          )"
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
  </div>
</template>

<script>
import { Api } from "../axios-api";
import { map } from "lodash";
//import ColorPicker from "./ColorPicker.vue";

import $ from "jquery";

export default {
  name: "ProjectManageUsers",
  //components: {ColorPicker},
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
      memberColors: {},
      userRoles: {},
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
          this.memberColors = [];
          for (let user of this.users) {
            let color = user.roles.find((r) => r.role == "M");
            if (color) this.memberColors[user.account.username] = color.colour;
            this.userRoles[user.account.username] = map(
              user.roles,
              (r) => r.role
            );
          }
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
      let member = this.users.find(
        (u) => u.account.username === user.account.username
      );
      let memberRoles = [];
      if (member) memberRoles = member.roles;
      console.log(user);
      console.log(member);

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
    saveColor(user) {
      Api.post(
        "/projects/" + this.$route.params.repoid + "/change_dev_colour/",
        {
          username: user.account.username,
          colour: this.memberColors[user.account.username],
        }
      )
        .then((response) => {
          this.success = response.data.message;
          this.getProjectUsers();
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.dropdown-menu {
  min-width: 5rem;
}
</style>