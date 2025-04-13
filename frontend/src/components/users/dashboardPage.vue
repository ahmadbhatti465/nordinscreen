<template>
  <div id="wrapper">
    <CommonSidebar :userId="userId"></CommonSidebar>

    <div class="main p-0">
      <CommonHeader :userId="userId" title="Overview" subtitle="Welcome to Power Management" :loading="loading">
      </CommonHeader>
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
                  <div id="" class="col-lg-12">
                    <!-- remove the following -->
                    <div class="d-none row">
                      <div class="pagetitle" style="position: relative">
                        <h1>Overview</h1>
                        <a style="text-decoration: none; cursor: pointer;" data-bs-toggle="modal"
                          data-bs-target="#basicModal">
                          <div class="action">
                            <div style="display: flex; align-items: center;">
                              <span class="action-icon" style="">
                                <i class="bx bxs-plus-circle"></i>
                              </span>
                              <h5 style="margin-left: 5px;">Add Device</h5>
                            </div>
                          </div>

                        </a>
                        <hr style="color: grey" />
                      </div>
                      <!-- End Page Title -->
                    </div><!-- Ended -->
                    <div class="content-row row">
                      <div class="col-md-6" style="max-width: 100%">
                        <div class="card info-card">
                          <div class="d-none filter">

                            <a class="icon" href="#" data-bs-toggle="dropdown" style="cursor: auto;"><i
                                class="bi bi-three-dots"></i></a>
                            <!-- <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                <li class="dropdown-header text-start">
                                  <h6>Filter</h6>
                                </li>

                                <li><a class="dropdown-item" href="#">Today</a></li>
                                <li><a class="dropdown-item" href="#">This Month</a></li>
                                <li><a class="dropdown-item" href="#">This Year</a></li>
                              </ul> -->
                          </div>

                          <div class="card-body">
                            <h5 class="card-title">
                              <h5>Current Power Usage</h5> <span style="display: block">Now</span>
                            </h5>

                            <div class="d-flex align-items-center">
                              <div class="card-icon d-flex align-items-center justify-content-center">
                                <i class='bx bxs-zap'></i>
                              </div>
                              <div class="ps-3">
                                <h6>{{ stats.currentPowerUsage >= 0 ? stats.currentPowerUsage.toFixed(2) : 0 }}
                                  <span>W</span>
                                </h6>
                                <!-- <span class="text-success small pt-1 fw-bold">{{ stats.totalPowerConsumption > 0 ?
                                  (stats.totalPowerConsumption / 1000).toFixed(2) : 0 }}</span> <span
                                  class="text-muted small pt-2 ps-1">kWh Total</span> -->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6" style="max-width: 100%">
                        <div class="card info-card">
                          <div class="filter">
                            <a class="icon" href="#" data-bs-toggle="dropdown" style="cursor: pointer;"><i
                                class="bi bi-three-dots text-secondary"></i></a>
                            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                              <li class="dropdown-header text-start">
                                <h6>Filter</h6>
                              </li>

                              <li><a class="dropdown-item" @click="setFilter('powerConsumption', 'last24h', 'Last 24 H')">Last 24 H</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerConsumption', 'thisMonth', 'This Month')">This Month</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerConsumption', 'lastMonth', 'Last Month')" >Last Month</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerConsumption', 'last3Month', 'Last 3 M')" >Last 3 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerConsumption', 'last6Month', 'Last 6 M')" >Last 6 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerConsumption', 'last12Month', 'Last 12 M')" >Last 12 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerConsumption', 'thisYear', 'This Year')" >This Year</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerConsumption', 'lastYear', 'Last Year')" >Last Year</a></li>
                            </ul>
                          </div>

                          <div class="card-body">
                            <h5 class="card-title">
                              <h5>Total Power Consumption</h5> <span style="display: block">{{ filters['powerConsumption'] ? filters['powerConsumption'] : 'Last 24 H' }}</span>
                            </h5>

                            <div class="d-flex align-items-center">
                              <div class="card-icon d-flex align-items-center justify-content-center">
                                <i class="bx bxs-zap"></i>
                              </div>
                              <div class="ps-3">
                                <h6>{{ stats.totalPowerConsumption >= 0 ? stats.totalPowerConsumption.toFixed(2) : 0}} kWh</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6" style="max-width: 100%">
                        <div class="card info-card green">
                          <div class="filter">
                            <a class="icon" href="#" data-bs-toggle="dropdown" style="cursor: pointer;"><i
                                class="bi bi-three-dots text-secondary"></i></a>
                            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                              <li class="dropdown-header text-start">
                                <h6>Filter</h6>
                              </li>

                              <li><a class="dropdown-item" @click="setFilter('powerSaving', 'last24h', 'Last 24 H')">Last 24 H</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerSaving', 'thisMonth', 'This Month')">This Month</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerSaving', 'lastMonth', 'Last Month')" >Last Month</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerSaving', 'last3Month', 'Last 3 M')" >Last 3 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerSaving', 'last6Month', 'Last 6 M')" >Last 6 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerSaving', 'last12Month', 'Last 12 M')" >Last 12 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerSaving', 'thisYear', 'This Year')" >This Year</a></li>
                              <li><a class="dropdown-item" @click="setFilter('powerSaving', 'lastYear', 'Last Year')" >Last Year</a></li>
                            </ul>
                          </div>
                          <div class="card-body">
                            <h5 class="card-title">
                              <h5>Power Saving</h5> <span style="display: block">{{ filters['powerSaving'] ? filters['powerSaving'] : 'Last 24 H' }}</span>
                            </h5>

                            <div class="d-flex align-items-center">
                              <div class="card-icon d-flex align-items-center justify-content-center">
                                <i class="bx bx-shield-quarter"></i>
                              </div>
                              <div class="ps-3">
                                <h6>{{ stats.totalPowerSaving >= 0 ? stats.totalPowerSaving.toFixed(2) : 0 }} kWh</h6>
                                <!-- <span class="text-success small pt-1 fw-bold">{{ energySavedPercentage
                                  }}%</span><br /><span class="text-muted small pt-2 ps-1">increase</span> -->
                              </div>
                              <div>
                                <!-- <div id="lineChart" style="color: red; height: 70px; width: 200px" class="echart">
                                </div> -->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- <div class="col-md-6" style="max-width: 100%">&nbsp;</div> -->


                      <!-- CO2 Emission Card -->
                      <div class="col-md-6" style="max-width: 100%">
                        <div class="card info-card green">
                          <div class="filter">
                            <a class="icon" href="#" data-bs-toggle="dropdown" style="cursor: pointer;"><i
                                class="bi bi-three-dots text-secondary"></i></a>
                            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                              <li class="dropdown-header text-start">
                                <h6>Filter</h6>
                              </li>

                              <li><a class="dropdown-item" @click="setFilter('co2EmissionReduction', 'last24h', 'Last 24 H')">Last 24 H</a></li>
                              <li><a class="dropdown-item" @click="setFilter('co2EmissionReduction', 'thisMonth', 'This Month')">This Month</a></li>
                              <li><a class="dropdown-item" @click="setFilter('co2EmissionReduction', 'lastMonth', 'Last Month')" >Last Month</a></li>
                              <li><a class="dropdown-item" @click="setFilter('co2EmissionReduction', 'last3Month', 'Last 3 M')" >Last 3 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('co2EmissionReduction', 'last6Month', 'Last 6 M')" >Last 6 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('co2EmissionReduction', 'last12Month', 'Last 12 M')" >Last 12 M</a></li>
                              <li><a class="dropdown-item" @click="setFilter('co2EmissionReduction', 'thisYear', 'This Year')" >This Year</a></li>
                              <li><a class="dropdown-item" @click="setFilter('co2EmissionReduction', 'lastYear', 'Last Year')" >Last Year</a></li>
                            </ul>
                          </div>
                          <div class="card-body">


                            <h5 class="card-title">
                              <h5>CO<sub>2</sub> Emission Reduction</h5> <span style="display: block">{{ filters['co2EmissionReduction'] ? filters['co2EmissionReduction'] : 'Last 24 H' }}</span>
                            </h5>

                            <div class="d-flex align-items-center">
                              <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                <i class="bi bi-cloud-haze2-fill"></i>
                              </div>
                              <div class="ps-3">
                                <h6>{{ stats.co2emissionReduction >= 0 ? stats.co2emissionReduction.toFixed(2) : 0 }}<sub>KG</sub></h6>
                                <span class="text-muted small pt-2 ps-1">Healthy Environment</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- End CO2 Emission Card -->

                      <!-- Trees Saved Card -->
                      <div class="col-xxl-4 col-md-6 d-none">
                        <div class="card info-card">

                          <div class="card-body">
                            <h5 class="card-title">Trees Saved</h5>

                            <div class="d-flex align-items-center">
                              <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                <i class="bx bxs-tree"></i>
                              </div>
                              <div class="ps-3">
                                <h6>{{ energySavedStats.treesSaved > 0 ? energySavedStats.treesSaved.toFixed(2) : 0 }}
                                  <sub>Trees</sub>
                                </h6>
                                <span class="text-muted small pt-2 ps-1">Reduced Deforestation</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- End Trees Saved Card -->

                      <!-- Coal Saved Card -->
                      <div class="col-xxl-4 col-xl-12 d-none">
                        <div class="card info-card">

                          <div class="card-body">
                            <h5 class="card-title">Coal Saved</h5>

                            <div class="d-flex align-items-center">
                              <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                <i class="bi bi-minecart-loaded"></i>
                              </div>
                              <div class="ps-3">
                                <h6>{{ energySavedStats.coalSaved > 0 ? energySavedStats.coalSaved.toFixed(2) : 0
                                  }}<sub>KG</sub></h6>
                                <span class="text-muted small pt-2 ps-1">Standard Coal Saved</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- End Coal Saved Card -->
                      <!-- Reports -->
                      <div class="col-12">
                        <div class="card info-card">
                          <!-- <div class="filter">
                            <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                              <li class="dropdown-header text-start">
                                <h6>Filter</h6>
                              </li>

                              <li><a class="dropdown-item" href="#">Today</a></li>
                              <li><a class="dropdown-item" href="#">This Month</a></li>
                              <li><a class="dropdown-item" href="#">This Year</a></li>
                            </ul>
                          </div> -->

                          <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                              <h5 class="card-title">
                                <h5>Energy Consumption</h5>
                              </h5>
                              <div style="display: inline-block;">
                                <div class="btn-pan btn_energy_compare_timeType"
                                  :class="deviceType == 0 ? 'selected' : ''"
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
                            <!-- Line Chart -->
                            <div id="reportsChart"></div>
                            <!-- End Line Chart -->
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
            <RightSideBar />
          </div>

          <!-- Right side columns -->


          <!-- modals -->
          <!-- Basic Modal -->
          <AddDeviceModal :loading="loading" @set-loading="setLoading" ></AddDeviceModal>
          <!-- End Basic Modal-->
        </div>
      </div>

      <div v-if="loading">
        <div class="loading-overlay"></div>
        <div class="processing">
          <i class='bx bx-loader-circle'></i>
        </div>
      </div>
      <!-- <CommonFooter></CommonFooter> -->
    </main>
  </div>
</template>

<script>
  import CommonHeader from '../CommonHeader.vue'
  import CommonSidebar from '../CommonSidebar.vue'
  import RightSideBar from './RightSideBar.vue'
  import AddDeviceModal from '../../tiny-components/AddDeviceModal.vue'
  import Dropdown from '../../tiny-components/Dropdown.vue';
  import axios from 'axios'
  //socket io
  import io from 'socket.io-client'

  export default {
    name: 'user-dashboard-page',
    components: {
      CommonHeader: CommonHeader,
      CommonSidebar: CommonSidebar,
      RightSideBar: RightSideBar,
      AddDeviceModal: AddDeviceModal,
      Dropdown: Dropdown
    },
    props: ['userId'],
    data() {
      return {
        filters: {},
        energySavedStats: {},
        reportChart: null,
        options: [],//deviceOptions
        groupOptions: [],
        deviceTypes: ['All', 'Device', 'Group'],
        timeType: 0,
        deviceType: 0,
        selectedDeviceId: null,
        selectedDeviceName: null,
        selectedGroupId: null,
        selectedGroupName: null,
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
          colors: ["#facb33", "#facb33", "#000000"],
          fill: {
            type: "linear"
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "straight",
            width: 2,
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
        },
        chartSeries: [
        ],
        totalEnergySaved: 0,
        loading: true,
      }
    },
    watch: {
      selectedUserId() {
        this.loading = true;
        setTimeout(() => {
          this.getChartData()
          //this.getEnergySavedStats()
        }, 2000)

      }
    },
    computed: {
      stats() {
        return this.$store.state.Devices.totalStats
      },

      topDevicesStats() {
        return this.$store.state.Devices.topDevicesStats
      },
      energySavedPercentage() {
        let total_possible_consumption = this.stats.totalPowerConsumption + this.energySavedStats.totalEnergySaved
        let percent = (this.energySavedStats.totalEnergySaved / total_possible_consumption) * 100
        if (isNaN(percent)) {
          return 0
        } else {
          return percent.toFixed(2)
        }
        return
      },
      selectedUserId() {
        return this.$store.getters.adminSelectedUserId
      },
    },
    methods: {
      setLoading(value) {
        this.loading = value
      },
      setFilter(type, value, displayName) {
        console.log('setFilter', value)
        this.filters[type] = displayName
        this.$socket.emit('filter', { type: type, value: value });
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
      addDevice() {
        let formData = new FormData(this.$refs.addDevice_form);
        let that = this
        this.loading = true;
        let data = this.$FormToJson(formData);

        axios.post("/devices", data).then(function (data) {
          //console.log(data.data);
          //that.devices.push(data.data);
          that.$refs.addDevice_form.reset();
          setTimeout(function () {
            that.loading = false;
          }, 2000)
          that.$toaster.success('Device Added!')
        }).catch(function (error) {
          if (error.response) {
            that.$toaster.error(that.$capitalizedString(error.response.data.data));
          } else {
            that.$toaster.error(error);
          }
          that.loading = false;
        })
      },
      initReportChart(newData) {

        console.log("initReportChart", newData)

        let chartSeriesData = [];

        // Iterate over the devicesData object
        // for (const deviceName in newData.twoDevicesData) {
        //   if (newData.twoDevicesData.hasOwnProperty(deviceName)) {
        //     const deviceData = newData.twoDevicesData[deviceName];
        //     const seriesData = deviceData.map(data => data.totalPowerConsumption.toFixed(2));

        //     // Push a new series object for each device
        //     chartSeriesData.push({
        //       name: deviceName,
        //       data: seriesData
        //     });
        //   }
        // }

        chartSeriesData.push({
          name: this.deviceType == 0 ? "All" : this.deviceType == 1 ? this.selectedDeviceName : this.selectedGroupName,
          data: newData.allDevicesData.map((d) => typeof d.totalPowerConsumption === 'undefined' ? 0 : d.totalPowerConsumption.toFixed(2)),
        })

        const chartOptions = {
          series: chartSeriesData,
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
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.3,
              opacityTo: 0.4,
              stops: [0, 90, 100],
            },
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
            categories: newData.allDevicesData.map((d) => {
              if (d._id < 24) {
                //console.log("Hours: ", (d._id < 10 ? '0' + d._id : d._id) + ":00")
                let utcHour = new Date();
                utcHour.setUTCHours(d._id, 0, 0, 0);
                let localHour = utcHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                //console.log(localHour)
                //return (d._id < 10 ? '0' + d._id : d._id) + ":00";
                return localHour;
              } else {
                console.log("Days: ", d._id)
                return d._id;
              }
            }),
            labels: {},
          },
          tooltip: {
            x: {
              format: "dd/MM/yy HH:mm",
            },
          },
          legend: {
            showForSingleSeries: true,
          }
        };

        if (this.reportChart) {
          // Update existing chart
          this.reportChart.updateOptions(chartOptions);
        } else {
          // Create new chart
          this.reportChart = new ApexCharts(document.querySelector("#reportsChart"), chartOptions);
          this.reportChart.render();
        }

      },
      updateChartData(data) {
        console.log("updateChartData", data)
        const newData = data;

        this.chartOptions = {
          xaxis: {
            categories: newData.allDevicesData.map((d) => {
              if (d._id < 24) {
                let utcHour = new Date();
                utcHour.setUTCHours(d._id, 0, 0, 0);
                let localHour = utcHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                //console.log(localHour)
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
        console.log("DeviceTypeChart: ", this.deviceType == 0 ? "All" : this.deviceType == 1 ? this.selectedDeviceName : this.selectedGroupName,)
        chartSeriesData.push({
          name: this.deviceType == 0 ? "All" : this.deviceType == 1 ? this.selectedDeviceName : this.selectedGroupName,
          data: newData.allDevicesData.map((d) => typeof d.totalPowerConsumption === 'undefined' ? 0 : d.totalPowerConsumption.toFixed(2)),
        })


        this.chartSeries = chartSeriesData
        console.log(this.chartSeries)

      },
      async getChartData(timeType = 0, deviceType = 0) {
        let that = this;
        this.loading = true;

        if (deviceType == 0) {
          that.selectedDeviceId = null
          that.selectedGroupId = null
        }

        try {
          axios.get("/devices/chart-data?timeType=" + timeType + "&date=" + new Date().getTime() + (that.selectedDeviceId ? "&deviceId=" + that.selectedDeviceId : "") + (that.selectedGroupId ? "&groupId=" + that.selectedGroupId : "")).then(function (data) {
            //console.log(data)
            //console.log(data.data.allDevicesData.map((d) => (new Date(d._id.year, d._id.month - 1, d._id.day, d._id.hour, d._id.minute, 0)).toISOString()))
            that.initReportChart(data.data);
            that.loading = false;
          }).catch(function (error) {
            if (error.response) {
              console.log(error.response.data.data)
              //that.$toaster.error(that.$capitalizedString(error.response.data.data));
            } else {
              console.error('Error:', error.message);
            }
            that.loading = false;
          })

        } catch (error) {
          this.error = 'An error occurred while fetching data.';
          //console.error(error);
        }
        return;
      },
      getEnergySavedStats() {
        let that = this
        let total = 0;
        axios.get("/devices/energy/last-24-hours").then(function (data) {
          let energySavedDevices = data.data;
          console.log("Energy Saved Devices:", energySavedDevices)
          that.energySavedStats.co2EmissionReduction = energySavedDevices.co2EmissionReduction.reduce((sum, device) => sum + device.totalCo2EmissionReduction * 1, 0) //energySavedDevices.totalCo2EmissionReduction;
          let total = energySavedDevices.powerSavingLast24Hours.reduce((sum, device) => sum + device.totalSaved * 1, 0);
          that.totalEnergySaved = total / 1000;
        })
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
      let that = this
      let user = this.$store.state.User.user;
      this.getChartData()
      this.getDevices();
      this.getGroups();
      this.getEnergySavedStats()
      
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