<template>
  <div id="wrapper">
    <CommonSidebar :userId="userId"></CommonSidebar>

    <div class="main p-0">
      <CommonHeader :userId="userId" title="Logs" subtitle="" :loading="loading"></CommonHeader>
    </div>

    <main class="main">

      <div class="">
        <div class="row">
          <!-- <div class="col-1"></div> -->

          <div class="col-lg-8 col-md-10" style="padding: 0px;">

            <div>
              <section class="section dashboard">
                <div class="row">
                  <!-- Left side columns -->
                  <div class="col-lg-12">
                    <div class="d-none row">
                      <div class="pagetitle" style="position: relative">
                        <h1>Logs</h1>
                        <hr style="color: grey" />
                      </div>
                      <!-- End Page Title -->
                    </div>
                    <div class="content-row row">
                      <!-- First Content Row Dashboard -->
                      <div>
                        <!-- Date Range Selection -->
                        <div style="color: var(--secondary-color-1);">

                          <div class="">
                            <div class="timeCon">

                              <!-- <input autocomplete="off" type="date" class="allInput " value="2025-05-04" > -->
                              <datepicker wrapper-class="date-wrapper" input-class="date-input" :value="new Date()"
                                :disabled-dates="disabledDates">
                              </datepicker>
                              <i class="prevLeft prvTime "><i class='bx bx-skip-previous'></i></i>
                              <i class="nextRight nextTime"><i class='bx bx-skip-next'></i></i>
                            </div>


                            <div class="btn-pan left btn_energy_compare_timeType"
                              :class="timeType == 1 ? 'selected' : ''" @click="timeType = 1">Day</div>
                            <div class="btn-pan btn_energy_compare_timeType" :class="timeType == 2 ? 'selected' : ''"
                              @click="timeType = 2">Month</div>
                            <div class="btn-pan right btn_energy_compare_timeType"
                              :class="timeType == 3 ? 'selected' : ''" @click="timeType = 3">Year</div>

                          </div>
                        </div>
                        <br />

                        <table id="TABLE_1">
                          <thead id="THEAD_2">
                            <tr id="TR_3">
                              <td>
                                Device Serial Number
                              </td>
                              <td>
                                Alias
                              </td>
                              <td>
                                Device Type
                              </td>
                              <td>
                                Time
                              </td>
                              <td>
                                Event Number
                              </td>
                              <td>
                                Fault Description
                              </td>
                              <td>
                                Solution
                              </td>
                            </tr>
                          </thead>
                          <tbody id="TBODY_12">
                            <tr id="TR_13">
                              <td colspan="8" id="TD_14">
                                <img src="../../assets/images/nodata.png" id="nodata_image" alt='' /><br id="BR_16" />No Data
                                Now
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br />
                        <!-- Pagination -->
                        <div>
                          <pagination :pagination="pagination" :method="getLogs" :pageCount="0"></pagination>
                        </div>
                      </div>
                      <!-- End First Content Row Dashboard -->

                    </div>
                    <div class="row">
                      <!-- <h2 style="color: orange;">Second Hello World</h2> -->
                    </div>
                  </div>
                  <!-- End Left side columns -->
                </div>
              </section>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 d-none d-md-block">
            <RightSideBar></RightSideBar>
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
                  <form class="row g-3" id="addDevice_form" v-on:submit.prevent="addDevice">
                    <div class="col-md-12">
                      <label for="inputName5" class="form-label">Device Name</label>
                      <input type="text" class="form-control" id="inputName5" name="name">
                    </div>
                    <div class="col-md-6">
                      <label for="inputDeviceType" class="form-label">Device Type</label>
                      <select id="inputDeviceType" class="form-select" name="deviceType">
                        <option selected>Choose...</option>
                        <option>Shelly Plug</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label for="inputCode" class="form-label">Code</label>
                      <input type="text" class="form-control" id="inputCode" name="deviceCode">
                    </div>
                    <!-- <div class="col-12">
                          <label for="inputAddress5" class="form-label">Location</label>
                          <input type="text" class="form-control" id="inputAddres5s" placeholder="1234 Main St">
                        </div> -->
                    <div class="text-center">
                      <button type="submit" class="btn btn-primary">Add</button>
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
      <!-- End #main -->
      <!-- <CommonFooter></CommonFooter> -->
    </main>
  </div>
</template>

<script>
  import CommonHeader from '../CommonHeader.vue'
  import CommonSidebar from '../CommonSidebar.vue'
  import RightSideBar from './RightSideBar.vue'
  import Datepicker from 'vuejs-datepicker';
  import pagination from '../../tiny-components/pagination.vue';

  export default {
    name: 'dashboard-page',
    components: {
      CommonHeader: CommonHeader,
      CommonSidebar: CommonSidebar,
      RightSideBar: RightSideBar,
      Datepicker,
      pagination
    },
    props: ['userId'],
    data() {
      return {
        time1: null,
        timeType: 1,
        disabledDates: {
          from: new Date()
        },
        devices: [],
        loading: true,
        logs: [], // Array to store logs
        startDate: null,
        endDate: null,
        pagination: {
          currentPage: 1,
        },
        currentPage: 1,
        pageSize: 10 // Number of logs per page
      }
    },
    watch: {},
    computed: {
      totalPages() {
        return Math.ceil(this.logs.length / this.pageSize);
      },
      // Paginated logs based on current page
      paginatedLogs() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.logs.slice(startIndex, endIndex);
      }
    },
    methods: {
      getLogs() {
      }
    }, //
    mounted() {
      //$( ".datepicker" ).datepicker();
      console.log($)
    },
    created() {
      let that = this
    },
  }
</script>

<style scoped>

  #TABLE_1 {
    height: 217px;
    border: 1px solid rgb(222, 222, 222);
  }

  #THEAD_2 {
    height: 48px;
  }

  #TR_3 {
    color: rgb(68, 68, 68);
    height: 46px;
    width: 100%;
    background: rgb(242, 242, 242) none repeat scroll 0% 0% / auto padding-box border-box;
    border: 1px solid rgb(222, 222, 222);
    font: 700 13px Geomanist, arial;
  }

  /*#TR_3*/




  /*#TR_3:before*/

  td {
    color: rgb(68, 68, 68);
    height: 47px;
    width: 272.375px;
    border-left: 1px solid rgb(224, 224, 224);
    padding: 0px 10px;
  }

  tbody {
    color: rgb(68, 68, 68);
    border: 0px none rgb(222, 222, 222);
    font: 12px Geomanist, arial;
  }

  #TR_13 {
    color: rgb(68, 68, 68);
    height: 168px;
    width: 1550px;
    border: 0px none rgb(222, 222, 222);
    font: 12px Geomanist, arial;
  }

  #TD_14 {
    color: rgb(187, 187, 187);
    height: 167px;
    margin-block-start: 20px;
    text-align: center;
    width: 1529px;
    border-right: 0px none rgb(187, 187, 187);
    border-bottom: 0px none rgb(187, 187, 187);
    border-left: 1px solid rgb(224, 224, 224);
    font: 700 25px Geomanist 65px Geomanist, arial;
    margin: 20px 0px 0px;
    padding: 0px 10px;
  }

</style>