<template>
  <div class="container">
    <h2 class="text-info">Modify {{ payload.name }}</h2>
    <div class="row">
      <div class="col">
        <div class="border rounded my-3 p-2">
          <form class="form-group" v-on:submit.prevent="modifyGroup">
            <label>Group name:</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Group name"
              v-model="payload.name"
            />
            <label>Group description:</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Group description"
              v-model="payload.description"
            />
            <label>GitLab Token:</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="GitLab Token (optional)"
              v-model="payload.gitlab_token"
            />

            <div class="form-group">
              <button type="submit" class="btn btn-primary my-2">
                Update Group
              </button>
            </div>
          </form>
        </div>

        <div class="border rounded my-3 p-2">
          <div class="row no-gutters d-flex">
            <label class="flex-grow-1">Invite a user to group:</label>
            <div>Pending invites: &nbsp; {{ pendingInvitations.length }}</div>
          </div>
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

      <div class="col">
        <div class="border rounded my-3 p-2">
          <label>New project:</label>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Project name"
              v-model="newProjectName"
            />
            <div class="input-group-append">
              <button class="btn btn-primary" type="button" @click="addProject">
                Add new project
              </button>
            </div>
          </div>
        </div>

        <div class="border rounded my-3 p-2">
          <label>Add repo to project:</label>
          <div class="form-group">
            <select
              required
              class="custom-select form-control mb-2"
              v-model="selectedProject"
            >
              <option value selected disabled hidden>Project</option>

              <option
                :value="project.id"
                v-for="project in allProjects"
                :key="project.id"
              >
                {{ project.name }}
              </option>
            </select>
            <input
              type="text"
              class="form-control mb-2"
              placeholder="Repo Name"
              v-model="repo.name"
            />
            <input
              type="text"
              class="form-control mb-2"
              placeholder="GitLab URL"
              v-model="repo.url"
            />
            <input
              type="text"
              class="form-control mb-2"
              placeholder="GitLab ID"
              v-model="repo.gitlab_id"
            />
            <button class="btn btn-primary" type="button" @click="addRepo">
              Add repo to project
            </button>
          </div>
        </div>

        <div class="border rounded my-3 p-2">
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
                {{ user.account.username }}
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
                  <li v-for="role in ['O', 'A', 'V', 'B']" :key="role" class="dropdown-item py-0 m-0">
                    <label class="checkbox">
                      <input
                        type="checkbox"
                        :checked="user.roles.includes(role)"
                        @change="updateRole(role, user)"
                      />
                      {{roleNames[role]}}
                    </label>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <GroupRepositoriesManager />
  </div>
</template>

<script>
import { Api } from "../axios-api";
import GroupRepositoriesManager from "../components/GroupRepositoriesManager.vue";
import $ from "jquery";

export default {
  name: "GroupModify",
  components: { GroupRepositoriesManager },
  data() {
    return {
      allProjects: null,
      payload: {
        name: "",
        description: "",
        gitlab_token: "",
      },
      newProjectName: "",
      selectedProject: "",
      repo: {
        name: "",
        url: "",
        gitlab_id: "",
      },
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
    Api.get("/groups/")
      .then((response) => {
        let this_group = response.data.find(
          (g) => g.id == this.$route.params.groupid
        );
        this.payload.name = this_group.name;
        this.payload.description = this_group.description;
      })
      .catch((err) => {
        this.error = err;
        console.log(err);
      });

    Api.get(
      "/groups/" + this.$route.params.groupid + "/project_repo_connections/"
    )
      .then((response) => {
        this.allProjects = response.data.projects;
      })
      .catch((err) => {
        this.error = err;
        console.log(err);
      });
    this.getPendingInvitations();
    this.getGroupUsers();

    // Prevent my multiselect dropdown from closing when clicking on a label
    $(document).on("click", ".dropdown-menu", function (e) {
      e.stopPropagation();
    });
  },
  methods: {
    modifyGroup() {
      Api.put("/groups/" + this.$route.params.groupid + "/", this.payload)
        .then(() => {
          this.success = "Group modified!";
          this.$router.push({ name: "groups" });
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });
    },
    addProject() {
      if (this.newProjectName) {
        Api.post("/groups/" + this.$route.params.groupid + "/project/", {
          name: this.newProjectName,
        })
          .then((response) => {
            this.allProjects.push(response.data);
            this.newProjectName = "";
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    addRepo() {
      if (
        this.selectedProject &&
        this.repo.name &&
        this.repo.url &&
        this.repo.gitlab_id
      ) {
        Api.post("/projects/" + this.selectedProject + "/repo/", this.repo)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
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
      console.log(role, user);
      if (user.roles.includes(role)) {

      Api.delete("/groups/" + this.$route.params.groupid + "/users/", {
        data: {
          id: user.account.id,
          role: role
        },
      })
        .then((response) => {
          this.success = response.data.message;
          this.getGroupUsers()
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        });

      } else {

      Api.post("/groups/" + this.$route.params.groupid + "/users/", {
          id: user.account.id,
          role: role
      })
        .then((response) => {
          this.success = response.data.message;
          this.getGroupUsers()
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
select,
select option {
  color: #dee2e6;
}

select:invalid,
select option[value=""] {
  color: #6c757d;
}
.dropdown-menu {
  min-width: 5rem;
}
</style>