<template>
  <div id="wrapper">
    <CommonSidebar :userId="userId"></CommonSidebar>

    <div class="main p-0">
      <CommonHeader :userId="userId" title="Energy" subtitle="" :loading="loading"></CommonHeader>
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
                        <h1>Energy</h1>
                        <hr style="color: grey" />
                      </div>
                      <!-- End Page Title -->
                    </div>
                    <div class="content-row row">
                      <div style="color: var(--secondary-color-1);">

                        <div class="d-flex justify-content-between m-2">
                          <div>
                            <div class="timeCon">

                              <!-- <input autocomplete="off" type="date" class="allInput " value="2025-05-04" > -->
                              <datepicker wrapper-class="date-wrapper" input-class="date-input" v-model="selectedDate"
                                :disabled-dates="disabledDates">
                              </datepicker>
                              <i class="prevLeft prvTime " @click="prevDate()"><i class='bx bx-skip-previous'></i></i>
                              <i class="nextRight nextTime" @click="nextDate()"><i class='bx bx-skip-next'></i></i>
                            </div>


                            <div class="btn-pan left btn_energy_compare_timeType"
                              :class="timeType == 0 ? 'selected' : ''" @click="timeType = 0">Hour</div>
                            <div class="btn-pan btn_energy_compare_timeType" :class="timeType == 1 ? 'selected' : ''"
                              @click="timeType = 1">Day</div>
                            <div class="btn-pan btn_energy_compare_timeType" :class="timeType == 2 ? 'selected' : ''"
                              @click="timeType = 2">Month</div>
                            <div class="btn-pan right btn_energy_compare_timeType"
                              :class="timeType == 3 ? 'selected' : ''" @click="timeType = 3">Year</div>

                          </div>
                          <div>
                            <div class="btn-pan btn_energy_compare_timeType" :class="deviceType == 0 ? 'selected' : ''"
                              style="border-radius: 15px; margin-left: 10px;"
                              @click="deviceType = 0; getChartData(timeType, deviceType)">
                              All
                            </div>


                            <div style="display: inline-block; margin-left: 10px">
                              <Dropdown :inputStyle="'min-width: 150px; border-radius: 15px; height: 28px;'"
                                :options="options" v-on:selected="validateSelection" v-on:filter="getDropdownValues"
                                :disabled="false" :defaultShowItems="true" placeholder="Search a Device">
                              </Dropdown>
                            </div>
                            <div style="display: inline-block; margin-left: 10px">
                              <Dropdown :inputStyle="'min-width: 150px; border-radius: 15px; height: 28px;'"
                                :options="groupOptions" v-on:selected="validateGroupSelection"
                                v-on:filter="getDropdownValues" :disabled="false" :defaultShowItems="true"
                                placeholder="Search a Group">
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <br />

                      <div class="row">
                        <div class="col-12">
                          <div class="card">
                            <div class="filter">
                              <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                <li class="dropdown-header text-start">
                                  <h6>Filter</h6>
                                </li>

                                <li><a class="dropdown-item" href="#">Today</a></li>
                                <li><a class="dropdown-item" href="#">This Month</a></li>
                                <li><a class="dropdown-item" href="#">This Year</a></li>
                              </ul>
                            </div>

                            <div class="card-body">
                              <h5 class="card-title"><h5 style="display: inline-block;">Energy Consumption</h5> <span>/{{ timeTypes[timeType] }}</span></h5>

                              <!-- Line Chart -->
                              <!-- <div id="reportsChart"></div> -->
                              <apexchart ref="chart" type="line" :options="chartOptions" :series="chartSeries"
                                height="350">
                              </apexchart>
                              <!-- End Line Chart -->
                            </div>
                          </div>
                        </div>
                      </div>
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
        </div>
      </div>
    </main>
    <!-- End #main -->
    <div v-if="loading">
      <div class="loading-overlay"></div>
      <div class="processing">
        <i class='bx bx-loader-circle'></i>
      </div>
    </div>
    <!-- <CommonFooter></CommonFooter> -->
  </div>
</template>

<script>
import CommonHeader from '../CommonHeader.vue'
import CommonSidebar from '../CommonSidebar.vue'
import RightSideBar from './RightSideBar.vue'
import Datepicker from 'vuejs-datepicker';
import Dropdown from '../../tiny-components/Dropdown.vue';

import axios from 'axios'

export default {
  name: 'dashboard-page',
  components: {
    CommonHeader: CommonHeader,
    CommonSidebar: CommonSidebar,
    RightSideBar: RightSideBar,
    Datepicker,
    Dropdown
  },
  props: ['userId'],
  data() {
    return {
      devices: [],
      timeTypes: ['Hour', 'Day', 'Month', 'Year'],
      deviceTypes: ['All', 'Device', 'Group'],
      deviceType: 0,
      timeType: 0,
      options: [],//deviceOptions
      groupOptions: [],
      selectedDate: new Date(),
      selectedDeviceId: null,
      selectedDeviceName: null,
      selectedGroupId: null,
      selectedGroupName: null,
      disabledDates: {
        from: new Date()
      },
      chartOptions: {
        chart: {
          height: 350,
          type: "area",
          toolbar: {
            show: false,
          },
        },
        markers: {
          size: 4,
        },
        colors: ["#facb33", "#92bf00", "#000000"],
        fill: {
          type: "gradient"
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 2,
          dashArray: [2]
        },
        xaxis: {
          tickAmount: 10,
          categories: [],
          labels: {},
        },
        tooltip: {
          x: {
            format: "dd/MM/yy",
          },
          y: {
            formatter: function (val) {
              return val + "Wh";
            },
          }
        },
        legend: {
          showForSingleSeries: true,
        }
      },
      chartSeries: [
      ],
      loading: true,
    }
  },
  watch: {
    selectedDate: function (newVal) {
      this.getChartData(this.timeType, this.deviceType);
    },
    timeType: function (newVal) {
      this.getChartData(newVal, this.deviceType);

    },
    selectedUserId() {//used by admin
      this.getChartData(this.timeType, this.deviceType);
    }
  },
  computed: {
    selectedUserId() {
      return this.$store.getters.adminSelectedUserId
    },
  },
  methods: {
    nextDate() {
      this.selectedDate.setDate(this.selectedDate.getDate() + 1);
      this.selectedDate = new Date(this.selectedDate); // Necessary to trigger reactivity
    },
    prevDate() {
      this.selectedDate.setDate(this.selectedDate.getDate() - 1);
      this.selectedDate = new Date(this.selectedDate); // Necessary to trigger reactivity
    },
    updateChartData(data) {
      const newData = data;

      this.chartOptions = {
        xaxis: {
          categories: newData.allDevicesData.map((d) => {
            if (d._id < 24) {
              let utcHour = new Date();
              utcHour.setUTCHours(d._id, 0, 0, 0);
              let localHour = utcHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              console.log(localHour)
              //return (d._id < 10 ? '0' + d._id : d._id) + ":00";
              return localHour;
            } else {
              return d._id
            }
          })
        }
      }

      let chartSeriesData = [];

      // Iterate over the devicesData object
      for (const deviceName in newData.twoDevicesData) {
        if (newData.twoDevicesData.hasOwnProperty(deviceName)) {
          const deviceData = newData.twoDevicesData[deviceName];
          const seriesData = deviceData.map(data => data.totalPowerConsumption.toFixed(2));

          // Push a new series object for each device
          chartSeriesData.push({
            name: deviceName,
            data: seriesData
          });
        }
      }
      chartSeriesData.push({
        name: this.deviceType == 0 ? "All" : this.deviceType == 1 ? this.selectedDeviceName : this.selectedGroupName,
        data: newData.allDevicesData.map((d) => typeof d.totalPowerConsumption === 'undefined' ? 0 : d.totalPowerConsumption.toFixed(2)),
      })


      this.chartSeries = chartSeriesData

    },
    getGroups() {
      let that = this;
      axios.get("/devices/groups?fields=id,name,devices").then(function (data) {
        console.log(data.data);
        let groups = data.data.groups;
        groups.map((d) => {
          that.groupOptions.push({ name: d.name, id: d._id })
        })
        that.loading = false
      }).catch(function (error) {
        that.loading = false
        if (error.response) {
          //that.$toaster.error(that.$capitalizedString(error.response.data.data));            
          console.error(error.response.data.data);
        } else {
          console.error('Error:', error.message);
        }
      })
    },
    getDevices() {
      let that = this;
      axios.get("/devices?fields=id,name").then(function (data) {
        //console.log(data.data);
        let devices = data.data.devices;
        devices.map((d) => {
          that.options.push({ name: d.name, id: d._id })
        })
        that.loading = false
      }).catch(function (error) {
        that.loading = false
        if (error.response) {
          //that.$toaster.error(that.$capitalizedString(error.response.data.data));            
          console.error(error.response.data.data);
        } else {
          console.error('Error:', error.message);
        }
      })
    },
    async getChartData(timeType = 0, deviceType = 0) {
      let that = this;
      this.loading = true;

      if (deviceType == 0) {
        that.selectedDeviceId = null
        that.selectedGroupId = null
      }

      try {
        axios.get("/devices/chart-data?timeType=" + timeType + "&date=" + new Date(that.selectedDate).getTime() + (that.selectedDeviceId ? "&deviceId=" + that.selectedDeviceId : "") + (that.selectedGroupId ? "&groupId=" + that.selectedGroupId : "")).then(function (data) {
          //console.log(data)
          //console.log(data.data.allDevicesData.map((d) => (new Date(d._id.year, d._id.month - 1, d._id.day, d._id.hour, d._id.minute, 0)).toISOString()))
          //that.initReportChart(data.data);
          that.updateChartData(data.data)

          that.loading = false;
        }).catch(function (error) {
          if (error.response) {
            that.$toaster.error(that.$capitalizedString(error.response.data.data));
          } else {
            console.error('Error:', error.message);
          }
          that.loading = false;
        })

      } catch (error) {
        this.error = 'An error occurred while fetching data.';
        console.error(error);
      }
      return;
    },
    validateSelection(selection) {
      console.log(selection)
      if (selection.id == null) {
        this.selectedDeviceId = null
        this.selectedDeviceName = null
        this.deviceType = 0
        this.getChartData(this.timeType, this.deviceType)
        return
      }
      this.selectedDeviceId = selection.id;
      this.selectedDeviceName = selection.name;
      console.log(selection.name + " has been selected");
      this.deviceType = 1
      this.getChartData(this.timeType, this.deviceType)
    },
    validateGroupSelection(selection) {
      console.log(selection)
      if (selection.id == null) {
        this.selectedGroupId = null
        this.selectedGroupName = null
        this.deviceType = 0
        this.getChartData(this.timeType, this.deviceType)
        return
      }
      this.selectedGroupId = selection.id;
      this.selectedGroupName = selection.name;
      console.log(selection.name + " has been selected");
      this.deviceType = 2
      this.getChartData(this.timeType, this.deviceType)
    },
    getDropdownValues(keyword) {
      console.log("You could refresh options by querying the API with " + keyword);
    }
  }, //
  mounted() {

  },
  created() {
    this.getDevices();
    this.getGroups();
    this.getChartData()
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