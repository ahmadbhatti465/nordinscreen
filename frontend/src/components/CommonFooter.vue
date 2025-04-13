<template>
  <div>
    <!-- Footer: working but display none; -->
    <footer style="display: none;" class="page-footer font-small blue-grey lighten-5">



      <!-- Footer Links -->
      <div class="container text-center text-md-left mt-5">

        <!-- Grid row -->
        <div class="row mt-3 dark-grey-text">

          <!-- Grid column -->
          <div class="col-md-3 col-lg-4 col-xl-3 mb-4">

            <!-- Content -->
            <h6 class="text-uppercase font-weight-bold">Devoted Healthcare</h6>
            <hr class="teal accent-3 mb-4 mt-0 d-inline-block mx-auto" style="width: 60px;">
            <p> Devoted is a NDIS register provider of dissability support and respite care</p>

          </div>
          <!-- Grid column -->

          <!-- Grid column -->
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">

            <!-- Links -->
            <h6 class="text-uppercase font-weight-bold">Services</h6>
            <hr class="teal accent-3 mb-4 mt-0 d-inline-block mx-auto" style="width: 60px;">
            <p>
              <a class="dark-grey-text" href="#!">Disability Support</a>
            </p>
            <p>
              <a class="dark-grey-text" href="#!">Respite Care</a>
            </p>

          </div>
          <!-- Grid column -->

          <!-- Grid column -->
          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">

            <!-- Links -->
            <h6 class="text-uppercase font-weight-bold">Useful links</h6>
            <hr class="teal accent-3 mb-4 mt-0 d-inline-block mx-auto" style="width: 60px;">
            <p>
              <a class="dark-grey-text" href="#!">Staff</a>
            </p>
            <p>
              <a class="dark-grey-text" href="#!">Contact Us</a>
            </p>
            <p>
              <a class="dark-grey-text" href="#!">About Us</a>
            </p>

          </div>
          <!-- Grid column -->

          <!-- Grid column -->
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">

            <!-- Links -->
            <h6 class="text-uppercase font-weight-bold">Contact Details</h6>
            <hr class="teal accent-3 mb-4 mt-0 d-inline-block mx-auto" style="width: 80px;">
            <p>
              <i class="fas fa-home mr-3"></i> Byford, WA, 6122
            </p>
            <p>
              <i class="fas fa-envelope mr-3"></i> admin@devotedhealthcare.com.au
            </p>
            <p>
              <i class="fas fa-phone mr-3"></i> +(61) 0449 028 905
            </p>

          </div>
          <!-- Grid column -->

        </div>
        <!-- Grid row -->

      </div>
      <!-- Footer Links -->

      <!-- Copyright -->
      <div class="footer-copyright text-center text-black-50 py-3">© 2020 Copyright:
        <a class="dark-grey-text" href="https://devotedhealthcare.com.au/"> Devoted Healthcare</a>
        <p>All Rights Reserved</p>
      </div>
      <!-- Copyright -->

    </footer>
    <!-- Footer -->
  </div>
</template>

<script>
export default {
  name: "CommonFooter",
  data() {
    return {
      hideBackBtn: false,
      currentPage: "",
      previousPath: "/",
      syncOption: "new",
      synchedProducts: 0,
    };
  },
  methods: {
    goPrevious() {
      if (this.previousPath) {
        this.$router.push(this.previousPath);
      } else {
        this.$router.push("/");
      }
    },
  },
  created() { },
  mounted() {
    let currentRoute = this.$router.currentRoute;
    // console.log('Current Route: ')
    // console.log(currentRoute)
    this.currentPage = currentRoute.name;
    let str = currentRoute.path;
    let prev = str.substring(0, str.lastIndexOf("/"));
    this.previousPath = prev;
    this.hideBackBtn = false;
    // console.log('User Data Exists:')
    // console.log(this.previousPath)
    if (this.$local.userData) {
      // console.log(this.$local.userData);
      if (this.$local.userData.accountType === "admin" && prev === "/cashier") {
        this.previousPath = "/admin/dashboard-page";
      } else if (
        this.$local.userData.accountType === "cashier" &&
        prev === "/cashier"
      ) {
        this.hideBackBtn = true;
      }
    } else {
      this.$router.push("/");
    }

    //console.log(this.previousPath);
  },
};
</script>

<style scoped>
.back-btn {
  color: white;
  transition: transform 0.2s;
  transform: scale(1);
}

.back-btn:hover {
  transition: transform 0.2s;
  transform: scale(1.2);
}</style>
