<template>
  <div id="wrapper">
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
                    <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                    <p class="text-center small">Enter your email & password to login</p>
                  </div>

                  <form class="row g-3 needs-validation" novalidate ref="form" id="login_form"
                    v-on:submit.prevent="login">

                    <div class="col-12">
                      <label for="emailInput" class="form-label">Email</label>
                      <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="email" name="email" class="form-control" id="emailInput" placeholder=""
                          v-model="email" required>
                        <div class="invalid-feedback">Please enter your email.</div>
                      </div>
                    </div>

                    <div class="col-12">
                      <label for="passwordInput" class="form-label">Password</label>
                      <input type="password" name="password" class="form-control" id="passwordInput" placeholder=""
                        required>
                      <div class="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div class="col-12">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe">
                        <label class="form-check-label" for="rememberMe">Remember me</label>
                      </div>
                    </div>

                    <div class="col-12">
                      <button class="btn btn-primary w-100" type="submit" id="submitBtn">Login</button>
                    </div>
                    <div class="col-12">
                      <p class="small mb-0">Don't have account? <router-link to="/register">Create an
                          account</router-link></p>
                      <!-- <router-link to="/reset-password-page">
                        <button type="button" class="btn btn-secondary">Reset Password</button>
                      </router-link>-->
                      <p class="small mb-0"><router-link to="/forgot-password">
                          Forgot password?
                        </router-link> </p>
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
  //import CommonHeader from './CommonHeader.vue'
  import CommonFooter from './CommonFooter.vue'
  import axios from 'axios'
  import { EventBus } from '../events/eventBus';

  export default {
    name: "landing-page",
    components: {
      CommonFooter
    },
    data() {
      return {
        data: "",
        email: "",
      };
    },
    methods: {
      async login() {
        let form = new FormData(this.$refs.form);
        let formData = this.$FormToJson(form);

        let that = this;
        try {
          //const token = 'YOUR_BEARER_TOKEN';
          axios.post(
            this.$serverUrl + "/user/login",
            formData,
            {},
          ).then(function (data) {
            console.log('in axios then')
            //console.log(data)
            that.data = data.data;
            if (data.data.token && data.data.token !== "") {
              // if (data.data.type === 'admin') {
              //   that.$router.push({ name: "user-dashboard-page" });
              // } else {
              //   that.$router.push({ name: "user-dashboard-page" });
              // }              
              that.$router.push({ name: "user-dashboard-page" });
              that.$toaster.success("Login Successful");
              
              //set user state token
              that.$store.commit('set_userToken', { token: data.data.token });
              that.$store.commit('set_userType', { type: data.data.type });
              that.$store.commit('set_userFullname', { fullname: data.data.name });

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
      },
    },
    created: function () {
      localStorage.removeItem('user_token');
      global.vm.$local.token = '';
    }
  };
</script>

<style></style>
