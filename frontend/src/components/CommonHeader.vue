<template>
  <!-- ======= Header ======= -->
  <!-- ======= Header ======= -->
  <header id="header" class="header d-flex align-items-center pt-2">

    <div class="pagetitle d-flex align-items-center justify-content-between mt-2">
      <div class="">
        <!-- <img src="../assets/img/logo.png" alt=""> -->
        <h1 class="">{{ title }}</h1>
        <span class="text-sm">
          <p>{{ subtitle }}</p>
        </span>
      </div>

      <!-- <i class="bi bi-list toggle-sidebar-btn" @click="changeSidebarClass"></i> -->
    </div><!-- End Logo -->

    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">

        <li class="nav-item d-block d-lg-none">
          <a class="nav-link nav-icon search-bar-toggle " href="#">
            <i class="bi bi-search"></i>
          </a>
        </li><!-- End Search Icon-->

        <li class="d-none nav-item dropdown">

          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-bell"></i>
            <!-- <span class="badge bg-primary badge-number">4</span> -->
          </a><!-- End Notification Icon -->

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li class="dropdown-header">
              You have 0 new notifications
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

          </ul><!-- End Notification Dropdown Items -->

        </li><!-- End Notification Nav -->

        <li class="d-none nav-item dropdown">

          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-chat-left-text"></i>
            <!-- <span class="badge bg-success badge-number">3</span> -->
          </a><!-- End Messages Icon -->

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
            <li class="dropdown-header">
              You have 0 new messages
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="dropdown-footer">
              <a href="#">Show all messages</a>
            </li>

          </ul><!-- End Messages Dropdown Items -->

        </li><!-- End Messages Nav -->

        <li>
        <li class="nav-item dropdown pe-3">

          <div class="dropdown">
            <button class="btn btn-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class='bx bx-plus'></i>
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" style="text-decoration: none; cursor: pointer;" data-bs-toggle="modal"
                  data-bs-target="#basicModal">
                  <div>
                    Add Device
                  </div>

                </a>
              </li>
              <li><router-link to="/user/schedule" class="dropdown-item"
                  style="text-decoration: none; cursor: pointer;">Add
                  timer</router-link></li>
            </ul>
          </div>
        </li>
        </li>

        <li class="nav-item dropdown pe-3">

          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <!-- <img src="../assets/img/profile-img.jpg" alt="Profile" class="rounded-circle"> -->
            <i class="bi bi-person-circle" style="font-size: 30px; color: lightgray;"></i>
            <span class="d-none d-md-block dropdown-toggle ps-2" style="color: black;">{{ fullname }}</span>
          </a><!-- End Profile Iamge Icon -->

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <!-- <li class="dropdown-header">
              <h6>{{ fullname }}</h6>
              <span>Top User</span>
            </li> -->
            <!-- <li>
                <hr class="dropdown-divider">
              </li>
  
              <li>
                <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
                  <i class="bi bi-person"></i>
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
  
              <li>
                <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
                  <i class="bi bi-gear"></i>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
  
              <li>
                <a class="dropdown-item d-flex align-items-center" href="pages-faq.html">
                  <i class="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li> -->
            <!-- <li>
              <hr class="dropdown-divider">
            </li> -->

            <li>
              <a class="dropdown-item d-flex align-items-center" href="/" @click="logout">
                <i class="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </a>
            </li>

          </ul><!-- End Profile Dropdown Items -->
        </li><!-- End Profile Nav -->

      </ul>
    </nav><!-- End Icons Navigation -->

    <AddDeviceModal :loading="loading" @set-loading="setLoading" :groups="groups"></AddDeviceModal>

  </header><!-- End Header -->
</template>

<script>
  import { EventBus } from '../events/eventBus.js';
  import AddDeviceModal from '../tiny-components/AddDeviceModal.vue'
  import axios from 'axios'

  export default {
    name: "CommonHeader",
    components: {
      AddDeviceModal
    },
    props: ['userId', 'name', 'title', 'subtitle', 'loading'],
    data() {
      return {
        groups: [],
        accountType: 'user',
        hideBackBtn: false,
        currentPage: "",
        previousPath: "/",
        syncOption: "new",
        synchedProducts: 0,
        fullname: "No Name",
      };
    },
    watch: {
      selectedUserId() {
        this.loading = true;
        this.getGroups()
        //this.getEnergySavedStats()

      }
    },
    computed: {
      selectedUserId() {
        return this.$store.getters.adminSelectedUserId
      },
    },
    methods: {
      setLoading(loading) {
        this.loading = loading
      },
      getGroups() {
        let that = this;
        this.setLoading(true);

        that.groups = [];
        axios.get("/devices/groups").then(function (data) {
          //console.log(data.data);
          that.groups = data.data.groups;
          //console.log("groups", that.groups)
          //console.log("setGroups", that.groups)
          that.$emit('set-groups', that.groups);
          that.setLoading(false);

        }).catch(function (error) {
          that.setLoading(false);

          if (error.response) {
            //that.$toaster.error(that.$capitalizedString(error.response.data.data));
            console.error(error.response.data.data);
          } else {
            console.error('Error:', error.message);
          }
        })
      },
      changeSidebarClass() {
        //this.$refs.sidebar.classList.toggle('toggle-sidebar');
        //document.getElementById('sidebar').classList.toggle('sidebar')
        document.getElementsByTagName('body')[0].classList.toggle('toggle-sidebar')
      },
      goPrevious() {
        if (this.previousPath) {
          this.$router.push(this.previousPath);
        } else {
          this.$router.push("/");
        }
      },
      logout() {
        this.$store.commit('clear_userToken', {});
        this.$store.commit('clear_devicesData', {});
        this.$store.commit('clear_userData', {});
        EventBus.$emit('clearSocket');
        window.location.href = '/';
      }
    },
    created() { },
    mounted() {
      this.getGroups();


      let currentRoute = this.$router.currentRoute;
      // console.log('Current Route: ')
      // console.log(currentRoute)
      this.currentPage = currentRoute.name;
      let str = currentRoute.path;
      let prev = str.substring(0, str.lastIndexOf("/"));
      this.previousPath = prev;
      this.hideBackBtn = false;
      console.log('User Data Exists:', this.$store.state.User.user)
      // console.log(this.previousPath)
      if (this.$store.state.User.user) {
        //console.log("userData:", this.$store.state.User.user);
        this.fullname = this.$store.state.User.user.fullname;
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
      this.accountType = global.vm.$local.userData.accountType;
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
  }
</style>
