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
                  <a href="/" class="logo d-flex align-items-center w-auto">
                    <img style="max-height: 70px;" src="../assets/img/logo-medium.png" alt="">
                  </a>
                </a>
              </div><!-- End Logo -->

              <div class="card mb-3">

                <div class="card-body">

                  <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Create an Account</h5>
                    <p class="text-center small">Enter your personal details to create account</p>
                  </div>

                  <form class="row g-3 needs-validation" novalidate ref="form" id="register_form"
                    v-on:submit.prevent="register">
                    <div class="col-12">
                      <label for="yourName" class="form-label">Full Name</label>
                      <input type="text" name="name" class="form-control" id="yourName" required>
                      <div class="invalid-feedback">Please, enter your name!</div>
                    </div>

                    <div class="col-12">
                      <label for="yourEmail" class="form-label">Email</label>
                      <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="email" name="email" class="form-control" id="yourEmail" placeholder="" v-model="email" required>
                        <div class="invalid-feedback">Please enter a valid Email adddress!</div>
                      </div>
                    </div>

                    <!-- <div class="col-12">
                      <label for="yourUsername" class="form-label">Username</label>
                      <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" name="username" class="form-control" id="yourUsername" required>
                        <div class="invalid-feedback">Please choose a username.</div>
                      </div>
                    </div> -->

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
                      <div class="form-check">
                        <input class="form-check-input" name="terms" type="checkbox" id="acceptTerms" required>
                        <label class="form-check-label" for="acceptTerms">I agree and accept the <a>terms and
                            conditions</a></label>
                        <div class="invalid-feedback">You must agree before submitting.</div>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary w-100" type="submit">Create Account</button>
                    </div>
                    <div class="col-12">
                      <p class="small mb-0">Already have an account? <router-link to="/">Log in</router-link></p>
                    </div>
                  </form>

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
import { EventBus } from '../events/eventBus';

export default {
  name: 'register-page',
  components: {
    CommonHeader,
    CommonFooter
  },
  data() {
    return {
      email: ''
    }
  },
  methods: {
    register() {
      let form = new FormData(this.$refs.form);
      let formData = this.$FormToJson(form);

      let that = this;
      try {
        //const token = 'YOUR_BEARER_TOKEN';
        axios.post(
          this.$serverUrl + "/user/signup",
          formData,
          {},
        ).then(function (data) {
          console.log('in axios then')
          console.log(data)
          data = data.data.data//fix in backend later
          if (data.token && data.token !== "") {
            that.$router.push({ name: "user-dashboard-page" });
            that.$toaster.success("Login Successful");
            //set user state token            
            that.$store.commit('set_userToken', { token: data.token });
            EventBus.$emit('initSocket');
          }
        }).catch(function (error) {
          console.log('in axios catch')
          console.log(error)
          if (error.response) {
            // Handle 400 Bad Request error
            that.$toaster.error(that.$capitalizedString(error.response.data.data));
          } else {
            // Handle other errors
            console.error('Error:', error.message);
          }
          //that.$toaster.error(error);
        })

      } catch (error) {
        this.error = 'An error occurred while fetching data.';
        console.error(error);
      }
      return;

      /* let formData = $("#register_form").serialize();
      console.log(formData);
      let that = this;
      this.$local
        .postRequest("/user/signup", formData, this)
        .then(function (data) {
          console.log(data);
          //that.users = data.users;
          that.$router.push({ name: "user-dashboard-page" });
          //that.$router.push({ name: "verify-email-page", params: { email: that.email } });
          
        })
        .catch(function (msg) {
          console.log(msg);
          if (msg && msg.toString().includes('Could not find your account'))
            that.$toaster.error("Email/password is wrong.");
          else if (msg && msg.toString().includes('Verify your email first')) {
            that.$toaster.error("Verify Email first.");
            that.$router.push({ name: "verify-email-page", params: { email: that.email } });
          }
          else if (msg && msg.toString().includes('Accounted Created!')) {
            that.$toaster.error("Account Created!");
            that.$router.push({ name: "user-dashboard-page" });
          }
          else
            that.$toaster.error(msg);
          return;
          return;
        }); */
    },
  }
}
</script>