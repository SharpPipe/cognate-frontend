<template>
  <div class="modal fade" id="authModal" data-backdrop='' tabindex="-1" role="dialog" aria-labelledby="authModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header" id="tab-content">
          <ul class="nav nav-tabs-justified">
            <li class="active nav-item">
              <a class="nav-link active" href="#login" data-toggle="tab">Log in</a></li>
            <li class="nav-item">
              <a class="nav-link" href="#signup" data-toggle="tab">Register</a></li>
          </ul>
          <button id="authClose" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>

        </div>
        <div class="modal-body">
          <div class="tab-content">
            <div class="tab-pane active" id="login">
              <Login/>
            </div>
            <div class="tab-pane" id="signup">
              <Register/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login    from "./AuthLogin";
import Register from "./AuthRegister";

export default {
  components: {
    Login,
    Register,
  }
}
</script>
