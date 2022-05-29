<template>
  <div class="container">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active" href="#users" data-toggle="tab">Users</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#sprints" data-toggle="tab">Sprints</a>
      </li>
    </ul>

    <div class="tab-content">
      <div class="tab-pane active" id="users">
        <ProjectManageUsers />
      </div>
      <div class="tab-pane" id="sprints">
        <ProjectManageSprints />
      </div>
    </div>
  </div>
</template>

<script>
import ProjectManageSprints from "../components/ProjectManageSprints.vue"
import ProjectManageUsers from "../components/ProjectManageUsers.vue"

export default {
  name: "ProjectManagementView",
  components: {
    ProjectManageSprints,
    ProjectManageUsers,
  },
};
</script>
