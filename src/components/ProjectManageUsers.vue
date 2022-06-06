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
            <div class="badge">
              <svg
                class="mb-1 p-0"
                height="18"
                width="18"
                v-if="memberColors[user.account.id]"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="9"
                  :fill="memberColors[user.account.id]"
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
            <div class="mr-3" v-if="memberColors[user.account.id]">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  :id="`cp${user.account.id}`"
                  style="width: 100px"
                  v-model="memberColors[user.account.id]"
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
                  class="btn btn-secondary dropdown-toggle"
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
                        :checked="
                          userRoles[user.account.username].includes(role)
                        "
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
      memberColors: {},
      userRoles: {},
    };
  },
  created() {
    this.getProjectUsers();
    this.getGroupUsers();

    // Prevent multiselect dropdown from closing when clicking on a label
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
            if (color) this.memberColors[user.account.id] = "#" + color.colour;
            this.userRoles[user.account.username] = map(
              user.roles,
              (r) => r.role
            );
          }
          this.users.forEach((u) => this.initColorPicker(u.account.id));
          this.users.sort((u) => u.account.username);
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
      let teacherHasRole = false;
      if (member) teacherHasRole = member.roles.find((r) => r.role === role);
      let userHasRole = user.roles.find((r) => r.role === role);

      if (userHasRole || teacherHasRole) {
        Api.delete("/projects/" + this.$route.params.repoid + "/users/", {
          data: {
            id: user.account.id,
            role: role,
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
          role: role,
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
      let color = this.memberColors[user.account.id].substring(1);
      Api.post(
        "/projects/" + this.$route.params.repoid + "/change_dev_colour/",
        {
          username: user.account.username,
          colour: color,
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
    initColorPicker(id) {
      let self = this;
      $(function () {
        $("#cp" + id)
          .colorpicker()
          .on("change", (e) => {
            self.memberColors[id] = e.value;
          });
      });
    },
    setColorToColorPicker(hex) {
      $(".cp").colorpicker("setValue", hex);
    },
  },
};
</script>

<style scoped>
.input-small {
  width: 80px;
}
.dropdown-menu {
  min-width: 5rem;
}
</style>