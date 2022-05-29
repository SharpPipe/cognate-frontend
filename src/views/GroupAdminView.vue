<template>
  <div class="container">

    <ul class="nav nav-tabs nav-fill">
      <li class="nav-item">
        <a class="nav-link active" href="#general" data-toggle="tab"
          >General Settings</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#users" data-toggle="tab">Users</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#repos" data-toggle="tab">Repositories</a>
      </li>
    </ul>

    <div class="tab-content">
      <div class="tab-pane active" id="general">
        <GroupAdminGeneral />
      </div>
      <div class="tab-pane" id="users">
        <GroupAdminUsers />
      </div>
      <div class="tab-pane" id="repos">
        <GroupAdminRepos />
      </div>
    </div>
  </div>
</template>

<script>
import GroupAdminRepos from "../components/GroupAdminRepos.vue";
import GroupAdminUsers from "../components/GroupAdminUsers.vue";
import GroupAdminGeneral from "../components/GroupAdminGeneral.vue";

export default {
  name: "GroupAdminView",
  components: { GroupAdminRepos, GroupAdminUsers, GroupAdminGeneral },
};
</script>
