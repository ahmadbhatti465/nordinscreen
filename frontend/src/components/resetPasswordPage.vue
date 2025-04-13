<template>
  <div class="row page">
    <!-- <CommonHeader></CommonHeader> -->

    <div class="container">

      <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

              <div class="d-flex justify-content-center py-4">
                <a href="/" class="logo d-flex align-items-center w-auto">
                  <img style="max-height: 70px;" src="../assets/img/logo-medium.png" alt="">
                </a>
              </div><!-- End Logo -->

              <div class="card mb-3">

                <div class="card-body">

                  <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Email Verification</h5>
                    <p class="text-center small">Please check your <b>Inbox</b> or <b>Spam</b></p>
                  </div>

                  <form class="row g-3 needs-validation" novalidate ref="form" id="resetPassword_form"
                    v-on:submit.prevent="resetPassword">

                    <div class="col-12">
                      <label for="yourEmail" class="form-label">Email</label>
                      <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="email" name="email" class="form-control" id="yourEmail" :value="email"
                          readonly="readonly" aria-readonly="readonly">
                      </div>
                    </div>

                    <div class="col-12">
                      <label for="resetPasswordCode" class="form-label">Code</label>
                      <input type="text" name="resetPasswordCode" class="form-control" id="resetPasswordCode" :value="code" required>
                      <div class="invalid-feedback">Please enter code from email!</div>
                    </div>

                    <div class="col-12">
                      <label for="yourPassword" class="form-label">Password</label>
                      <input type="password" name="password" class="form-control" id="yourPassword" required>
                      <div class="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div class="col-12">
                      <label for="yourPasswordConfirm" class="form-label">Confirm Password</label>
                      <input type="password" name="passwordConfirmation" class="form-control" id="yourPasswordConfirm"
                        required>
                      <div class="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div class="col-12">
                      <button class="btn btn-primary w-100" type="submit">Verify</button>
                    </div>
                  </form>
                  <!-- <div class="col-12" style="margin-top: 20px;">
                    <p class="small mb-0">Didn't get the code? <a role="button" style="color: blue"
                        @click="resendCode">Resend Code</a></p>
                  </div> -->
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

    </div>

    <CommonFooter></CommonFooter>
  </div>
</template>

<script>
  import CommonHeader from './CommonHeader.vue'
  import CommonFooter from './CommonFooter.vue'

  import axios from 'axios'

  export default {
    name: 'reset-password-page',
    components: {
      CommonHeader,
      CommonFooter
    },
    props: ['email', 'code'],
    data() {
      return {
        codeResent: true,
        secondsLeft: 30
      }
    },
    methods: {
      resetPassword() {
        let form = new FormData(this.$refs.form);
        let formData = this.$FormToJson(form);

        //check if password and confirm password match
        if (formData.password != formData.passwordConfirmation) {
          this.$toaster.error("Passwords do not match.");
          return;
        }

        console.log(formData);
        let that = this;
        axios.post(
          this.$serverUrl + "/user/new-password",
          formData,
          {},
        ).then(function (data) {
          console.log(data);
          //that.users = data.users;
          that.$toaster.success("Password updated.");
          that.$router.push({ name: "landing-page" });

          return;
        })
          .catch(function (msg) {
            console.log(msg);
            that.$toaster.error(msg);
            return;
          });
      },
      resendCode() {
        let formData = $("#resetPassword_form").serialize();
        console.log(formData);
        let that = this;
        this.$local
          .postRequest("/user/forgot-password", formData, this)
          .then(function (data) {
            console.log(data);
            //that.users = data.users;
            that.$toaster.success("Email sent again.");
            that.codeResent = true

            return;
          })
          .catch(function (msg) {
            console.log(msg);
            that.$toaster.error(msg);
            return;
          });
      },

    },
    mounted() {
      console.log("mounted")
      console.log(this.email, this.code)
    }
  }
</script>