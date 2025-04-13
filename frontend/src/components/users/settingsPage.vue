<template>
  <div id="wrapper">
    <div class="container-fluid">
      <CommonHeader :userId="userId"></CommonHeader>


      <div class="container-fluid" style="margin: 0px; padding: 0px">
        <div class="row">
          <CommonSidebar class="col-lg-2" :userId="userId"></CommonSidebar>
          <div class="col-lg-7 col-md-8">
            <div id="main-center">
              <section class="section dashboard">
                <div class="row">

                  <div class="col-md">
                    <div class="row">
                      <div class="pagetitle" style="position: relative">
                        <h1>Settings</h1>
                        <hr style="color: grey" />
                      </div>
                      <!-- End Page Title -->
                    </div>
                    <div class="row">
                      <!-- First Content Row Dashboard -->
                      <h1 style="color: green;">hello world</h1>
                      <!-- End First Content Row Dashboard -->

                    </div>
                    <div class="row">
                      <h2 style="color: orange;">Second Hello World</h2>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Right side columns -->
          <div class="col-lg-3 col-md-4 d-none d-md-block">
            <RightSideBar />
          </div>

          <!-- modals -->
          <!-- Basic Modal -->
          <div class="modal fade" id="basicModal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" style="color: var(--secondary-color-1)">Add Device</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="color: var(--secondary-color-1);">
                  <!-- Multi Columns Form -->
                  <form class="row g-3" id="addDevice_form" ref="addDevice_form" v-on:submit.prevent="addDevice">
                    <div class="col-md-12">
                      <label for="inputName5" class="form-label">Device Name</label>
                      <input type="text" class="form-control" id="inputName5" name="name">
                    </div>
                    <div class="col-md-6">
                      <label for="inputDeviceType" class="form-label">Device Type</label>
                      <select id="inputDeviceType" class="form-select" name="type">
                        <option selected>Choose...</option>
                        <option>Shelly Plug</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label for="inputCode" class="form-label">Code</label>
                      <input type="text" class="form-control" id="inputCode" name="code">
                    </div>
                    <div class="col-12">
                      <label for="inputAddress5" class="form-label">API key</label>
                      <input type="text" class="form-control" id="inputAddres5s" name="apiKey" placeholder="12345ABC">
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
                      <button type="reset" class="btn btn-secondary">Reset</button>
                    </div>
                  </form><!-- End Multi Columns Form -->
                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                  </div> -->
              </div>
            </div>
          </div><!-- End Basic Modal-->
        </div>
      </div>

      <div v-if="loading">
        <div class="loading-overlay"></div>
        <div class="processing">
          <i class='bx bx-loader-circle'></i>
        </div>
      </div>
      <!-- <CommonFooter></CommonFooter> -->
    </div>
  </div>
</template>

<script>
  import CommonHeader from '../CommonHeader.vue'
  import CommonSidebar from '../CommonSidebar.vue'
  import RightSideBar from './RightSideBar.vue'

  export default {
    name: 'dashboard-page',
    components: {
      CommonHeader: CommonHeader,
      CommonSidebar: CommonSidebar,
      RightSideBar: RightSideBar
    },
    props: ['userId'],
    data() {
      return {
        devices: [],
        loading: false,
      }
    },
    watch: {},
    computed: {},
    methods: {
      addDevice() {
        let formData = $('#addDevice_form').serialize()
        let that = this
        this.loading = true;

        this.$local
          .postRequest('/auth/devices/create-device', formData)
          .then(function (data) {
            console.log(data)
            that.$toaster.success('Device Added!')

            that.loading = false;
            return
          })
          .catch(function (msg) {
            //console.log(msg)
            that.$toaster.error(msg)
            that.loading = false;
            return
          })
      },
    },
    mounted() { },
    created() {
      let that = this
    },
  }
</script>

<style scoped>
  .box-shadow {
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
    padding: 20px;
    margin-bottom: 20px;
  }

  .box-shadow:hover {
    box-shadow: 0px 10px 20px 2px rgba(0, 0, 0, 0.25);

  }

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter,
  .slide-fade-leave-to

  /* .slide-fade-leave-active below version 2.1.8 */
    {
    transform: translateX(10px);
    opacity: 0;
  }
</style>