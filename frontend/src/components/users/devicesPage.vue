<template>
  <div id="wrapper">
    <CommonSidebar :userId="userId"></CommonSidebar>

    <div class="main p-0">
      <CommonHeader :userId="userId" title="Devices" subtitle="" :loading="loading"></CommonHeader>
    </div>

    <main class="main">

      <div class="">
        <div class="row">
          <!-- <div class="col-1"></div> -->

          <div class="col-lg-8 col-md-10" style="padding: 0px;">

            <div>
              <section class="section dashboard">
                <div class="content-row row">
                  <!-- Left side columns -->
                  <div class="col-lg-12">
                    <div class="row">
                      <div class="pagetitle" style="position: relative">
                        <h1>&nbsp;</h1>


                        <div class="action" style="display: flex;">
                          <a style="text-decoration: none; cursor: pointer; margin-right: 20px;" data-bs-toggle="modal"
                            data-bs-target="#addGroupModal">
                            <div style="display: flex; align-items: center;">
                              <span class="action-icon" style="">
                                <i class="bx bxs-plus-circle"></i>
                              </span>
                              <h5 style="margin-left: 5px;">Add Group</h5>
                            </div>
                          </a>
                          <a style="text-decoration: none; cursor: pointer;" data-bs-toggle="modal"
                            data-bs-target="#basicModal">
                            <div style="display: flex; align-items: center;">
                              <span class="action-icon" style="">
                                <i class="bx bxs-plus-circle"></i>
                              </span>
                              <h5 style="margin-left: 5px;">Add Device</h5>
                            </div>
                          </a>
                        </div>

                        <hr style="color: grey" />
                      </div>
                      <!-- End Page Title -->
                    </div>
                    <div class="row">
                      <div class="container">
                        <div class="row">
                          <div class="col">
                            <div class="d-flex justify-content-between" style="color: red;">
                              <div>
                                <!-- Turn off all -->
                                <button v-on:click="turnOnAll()" class="btn btn-primary" style="margin-bottom: 10px;"
                                  data-toggle="tooltip" data-placement="top" title="Turn ON all devices">
                                  <i class="bi bi-power"></i>
                                </button>&nbsp;
                                <button v-on:click="turnOffAll()" class="btn btn-danger"
                                  style="margin-bottom: 10px; color: white;" data-toggle="tooltip" data-placement="top"
                                  title="Turn OFF all devices">
                                  <i class="bi bi-power"></i>
                                </button>


                              </div>
                              <div>
                                <!-- Switch Grid View and Table view -->

                                <button class="btn btn-primary"
                                  v-on:click="viewType = viewType == 'table' ? 'grid' : 'table'"
                                  style="margin-bottom: 10px;" data-toggle="tooltip" data-placement="top"
                                  title="Switch View">
                                  <span v-if="viewType == 'table'">
                                    <i class="bi bi-grid"></i>
                                  </span>
                                  <span v-else>
                                    <i class="bi bi-list"></i>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Display all Groups -->
                        <ListGroups @set-loading="setLoading" @set-groups="setGroups" @groups-selected="groupsSelected"
                          :devices="devices"></ListGroups>


                      </div>
                      <div v-if="devices.length == 0" class="nodata">
                        <img src="../../assets/images/nodata.png" id="nodata_image" alt='' /><br />
                        <span>No Data Now</span>
                      </div>
                      <div class="row">
                        <div v-if="devices.length > 0">
                          <div v-if="viewType == 'table'" class="table-responsive">
                            <table class="table table-bordered">
                              <thead>
                                <tr class="text-center text-nowrap fw-bold">
                                  <td></td>
                                  <td>Name</td>
                                  <td>State</td>
                                  <td>Power</td>
                                  <td>Voltage</td>
                                  <td>Saving 24h</td>
                                  <td>Type</td>
                                  <td>Code</td>
                                  <td>Op</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(device, index) in devices" :key="device._id"
                                  v-if="selectedGroups.length == 0 || (selectedGroups.length > 0 && selectedGroups.includes(device.groupId))">
                                  <td class="fw-bold">{{ index + 1 }}</td>
                                  <td>
                                    <!-- <router-link :to="'/user/view-device/' + device._id" class="viewBotLink"> -->{{
                                      device.name
                                    }}<!-- </router-link> -->
                                  </td>
                                  <!-- <td>{{ device.isOnline ? 'Online' : 'Offline' }}</td> -->
                                  <td>{{ device.isTurnedOn ? 'Turned On' : 'Turned off' }}</td>
                                  <td>{{ device.currentPowerUsage }}W</td>
                                  <td>{{ device.currentVoltage }}V</td>
                                  <td>{{ findDevicePowerSaving(device._id) }} kwh</td>
                                  <td>
                                    {{ device.type }}
                                  </td>
                                  <td>
                                    {{ device.code }}
                                  </td>
                                  <td>
                                    <!-- toggle status -->
                                    <span>
                                      <a href="javascript:;" v-on:click="editDevice = device" data-bs-toggle="modal"
                                        data-bs-target="#editModal">Edit</a>
                                      &nbsp;|&nbsp;
                                    </span>

                                    <a href="javascript:;" v-on:click="toggleDeviceStatus(device._id, index)"
                                      class="viewBotLink">{{
                                        device.isTurnedOn ? 'Turn Off' : 'Turn On' }}</a>

                                    <span>&nbsp;|&nbsp;
                                      <a href="javascript:;" v-on:click="deleteDevice(device._id, index)"
                                        class="deleteBotLink">Delete</a></span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div v-else>
                            <!--  -->
                            <!-- GridView for Bots -->
                            <!--  -->
                            <div class="container">
                              <div class="row">


                                <div class="col-xl-4 mb-4 mb-lg-4" v-for="(device, index) in devices"
                                  :key="device._id + '_' + device.powerConsumption + '_' + (device.isOnline ? '1' : '0')"
                                  v-if="selectedGroups.length == 0 || (selectedGroups.length > 0 && selectedGroups.includes(device.groupId))">

                                  <div class="card" style="border: 1px solid #dee2e6; position: relative">
                                    <div :id="'device_loading_' + index" style="display: none;">
                                      <div class="spin"
                                        style="display: flex; justify-content: center; align-items: center; position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.5); color: white; font-size: xx-large;">
                                        <i class='bx bx-loader-circle'></i>
                                      </div>
                                    </div>
                                    <div class="card-body">
                                      <div style="position: relative">
                                        <span style="position: absolute; left: 0px; margin-top: 5px; font-size: 22px;">
                                          <a href="javascript:;" v-on:click="editDevice = device" data-bs-toggle="modal"
                                            data-bs-target="#editModal"><i class="bx bx-edit"></i></a>
                                        </span>
                                        <span style="position: absolute; right: 0px; margin-top: 5px; font-size: 22px;">
                                          <a href="javascript:;" v-on:click="deleteDevice(device._id, index)"><i
                                              class="bi bi-trash"></i></a>
                                        </span>
                                      </div>
                                      <div class="d-flex flex-column text-center align-items-center">

                                        <div class="flex-grow-1 pt-4">
                                          <span class="d-block text-muted" style="font-size: x-small;">
                                            {{ ((+new Date() - +new Date(device.createdAt)) / 1000 / 60 / 60 /
                                              24).toFixed(0) }}
                                            days old
                                          </span>
                                          <!-- <h5>{{ device.name }}</h5> -->
                                          <div class="mb-4">
                                            <span v-if="device.isOnline == false"
                                              class="badge rounded-pill bg-secondary">
                                              Offline
                                            </span>
                                            <span v-else class="badge rounded-pill bg-primary"
                                              style="background-color: var(--secondary-color-2);">
                                              Online
                                            </span>

                                            <span v-if="device.groupId" class="badge rounded-pill bg-primary">
                                              {{ groupName(device.groupId) }}
                                            </span>
                                          </div>

                                        </div>
                                      </div>

                                      <div class="bot-img">
                                        <!-- <img class="img" src="../../assets/img/shelly_plugs.png" alt=""> -->
                                        <div>
                                          <span
                                            style="display: inline-block; background: #fff; height: 75px; width: 75px; border-radius: 50%; padding: 20px; box-shadow: #dee2e6 2px 2px 10px;">
                                            <i style="font-size:xx-large" class='bx bx-plug'></i>
                                          </span>
                                        </div>
                                        <h5 style="margin-top: 5px; ">
                                          {{ device.name }}</h5>
                                      </div>
                                      <div style="text-align: center;">
                                        <button class="power-btn-main"
                                          v-on:click="toggleDeviceStatus(device._id, index)">
                                          <span class="power-btn-main-span">
                                            <span
                                              :class="'power-btn ' + (device.isTurnedOn ? 'power-on' : 'power-off')">
                                              <i class='bx bx-power-off'></i>
                                            </span>
                                          </span>
                                        </button>
                                      </div>
                                    </div>

                                    <!--Footer states-->
                                    <div class="card-footer py-0 border-top"
                                      style="color: black; background-color: rgba(0,0,0, 0.03); border-top: 1px solid lightgray !important;">
                                      <div class="row">

                                        <div class="col-4 text-center p-3">

                                          <h4 class="fs-5 mb-1">
                                            <span>{{ device.currentPowerUsage }}</span> W <i class='bx bx-info-circle'
                                              v-b-popover.hover.top="' Show the current power consumption!'"
                                              title=Powerconsumption></i>
                                          </h4>
                                          <span class="d-block" style="font-size: 12px;">Power</span>
                                        </div>

                                        <div class="col-4 text-center p-3 border-start">


                                          <h4 class="fs-5 mb-1">
                                            <span>{{ findDevicePowerSaving(device._id) }} KWh <i
                                                class='bx bx-info-circle'
                                                v-b-popover.hover.top="'  Estimated power saving when the device is off. Estimate is done by Q-Power by using the last 24 hours of turn on. This information is used for calculating total power savings. '"
                                                title=PowersavingEstimate></i></span>

                                          </h4>
                                          <span class="d-block" style="font-size: 12px;">saving</span>
                                        </div>

                                        <div class="col-4 p-3 text-center border-start">

                                          <h4 class="fs-5 mb-1">{{ device.currentVoltage }} V <i
                                              class='bx bx-info-circle'
                                              v-b-popover.hover.top="'Show the current voltage in the grid.'"
                                              title=Voltage></i></h4>
                                          <span class="d-block" style="font-size: 12px; ">Voltage</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>

                          <!-- Pagination -->
                          <div>
                            <pagination :pagination="pagination" :method="getDevices"></pagination>
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

          <!-- Right side columns -->
          <div class="col-lg-4 col-md-4 d-none d-md-block">
            <RightSideBar :totalPowerSaving="totalPowerSaving" />
          </div>

          <!-- modals -->

          <!-- Basic Modal -->
          <AddDeviceModal :loading="loading" :groups="groups" @added-device="addedDevice" @set-loading="setLoading">
          </AddDeviceModal>
          <!-- End Basic Modal-->
          <EditDeviceModal :loading="loading" :groups="groups" :device="editDevice" @updated-device="updatedDevice"
            @set-loading="setLoading"></EditDeviceModal>


        </div>
      </div>
      <!-- End #main -->

      <!--/.Navbar -->
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
import CommonFooter from '../CommonFooter.vue'
import CommonSidebar from '../CommonSidebar.vue'
import RightSideBar from './RightSideBar.vue'
import pagination from '../../tiny-components/pagination.vue'
import AddDeviceModal from '../../tiny-components/AddDeviceModal.vue'
import EditDeviceModal from '../../tiny-components/EditDeviceModal.vue'
import ListGroups from '../../tiny-components/ListGroups.vue'
import axios from 'axios'

export default {
  name: 'bots-page',
  components: {
    CommonHeader: CommonHeader,
    CommonFooter: CommonFooter,
    CommonSidebar: CommonSidebar,
    RightSideBar: RightSideBar,
    pagination: pagination,
    AddDeviceModal: AddDeviceModal,
    EditDeviceModal: EditDeviceModal,
    ListGroups: ListGroups
  },
  props: ['userId'],
  data() {
    return {
      viewType: 'grid',
      devices: [],
      selectedGroups: [],
      groups: [],
      pagination: {},
      powerSavingLast24Hours: [],
      totalPowerSaving: 0,
      editDevice: {},
      editGroup: {},
      loading: true,
      myInterval: 0,
      updateGroupsField: 0,
    }
  },
  watch: {
    selectedUserId() {
      this.getDevices()
    },
    selectedGroups() {
      let totalEnergySaved = 0;
      for (let i = 0; i < this.devices.length; i++) {
        let device = this.devices[i];
        if (this.selectedGroups.includes(device.groupId)) {
          totalEnergySaved += this.findDevicePowerSaving(device._id);
        }
      }
      this.totalPowerSaving = totalEnergySaved;
    }
  },
  computed: {
    selectedUserId() {//admin user
      return this.$store.getters.adminSelectedUserId
    }
  },
  methods: {
    setLoading(value) {
      this.loading = value
    },
    setGroups(groups) {
      //console.log("setGroupsi", groups)
      this.groups = groups
    },
    groupName(groupId) {
      //return this.groups.find((g) => g._id == groupId).name
      let group = this.groups.find((g) => g._id == groupId)
      if (group)
        return group.name
      return "Default"
    },
    groupsSelected(groupsIds) {
      //console.log("selectedGroup", groupsIds)
      //this.filteredDevices = this.devices.filter((d) => groupsIds.includes(d.groupId))
      this.selectedGroups = groupsIds
    },
    updatedDevice(data) {
      //console.log("updatedDevice", data)
      this.getDevices()
    },
    findDevicePowerSaving(deviceId) {
      for (let i = 0; i < this.powerSavingLast24Hours.length; i++) {
        if (this.powerSavingLast24Hours[i].deviceId == deviceId) {
          let data = this.powerSavingLast24Hours[i]
          let output = data.totalSaved * 1 / 1000
          return output > 0 ? output.toFixed(2) : 0;
        }
      }
      return 0;
    },
    getDevices(pageNumber = 1) {
      let that = this;
      axios.get("/devices?pageSize=100&pageNumber=" + pageNumber).then(function (data) {
        //console.log(data.data);
        that.devices = data.data.devices;
        that.pagination = data.data.pagination;
        that.powerSavingLast24Hours = data.data.powerSavingLast24Hours

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
    turnOffAll() {
      let that = this
      console.log("turnOffAll")
      this.$confirm(
        {
          message: 'Turn off all devices?',
          button: {
            no: 'No',
            yes: 'Yes'
          },
          callback: confirm => {
            if (confirm) {
              that.loading = true;
              try {
                axios
                  .post('/devices/control', { status: false })
                  .then(function (data) {
                    console.log(data)

                    that.$toaster.success('Device status updated.')
                    that.devices.forEach((device, index) => {
                      device.isTurnedOn = false
                    })


                    that.loading = false
                    return
                  })
                  .catch(function (msg) {
                    //console.log(msg)
                    that.$toaster.error(msg)
                    that.loading = false
                    //that.devices[index].isTurnedOn = !that.devices[index].isTurnedOn
                    return
                  })

              } catch (error) {
                this.error = 'An error occurred while fetching data.';
                console.error(error);
                that.loading = false;
              }
            }
          }
        });

    },
    turnOnAll() {
      let that = this

      console.log("turnOnAll")

      this.$confirm(
        {
          message: 'Turn on all devices?',
          button: {
            no: 'No',
            yes: 'Yes'
          },
          callback: confirm => {
            if (confirm) {
              that.loading = true;
              try {
                axios
                  .post('/devices/control', { status: true })
                  .then(function (data) {
                    console.log(data)

                    that.$toaster.success('Device status updated.')
                    that.devices.forEach((device, index) => {
                      device.isTurnedOn = true
                    })


                    that.loading = false
                    return
                  })
                  .catch(function (msg) {
                    //console.log(msg)
                    that.$toaster.error(msg)
                    that.loading = false
                    //that.devices[index].isTurnedOn = !that.devices[index].isTurnedOn
                    return
                  })

              } catch (error) {
                this.error = 'An error occurred while fetching data.';
                console.error(error);
                that.loading = false;
              }
            }
          }
        })

    },
    toggleDeviceStatus(deviceId, index) {
      let that = this

      //this.loading = true;
      let element = document.getElementById('device_loading_' + index)
      element.style.display = 'block'

      let status = !that.devices[index].isTurnedOn

      //console.log("toggleDeviceStatus", deviceId, index, that.devices[index].isTurnedOn)
      axios
        .post('/devices/control', { id: deviceId, status: !that.devices[index].isTurnedOn })
        .then(function (data) {
          console.log(data)

          that.$toaster.success('Device status updated.')

          that.devices[index].isTurnedOn = !that.devices[index].isTurnedOn

          let delay = 3;
          if (status) {
            let channelsDelays = that.devices[index].channelsDelays;
            if (that.devices[index].channels > 1 && channelsDelays && channelsDelays.length > 0) {
              for (let i = 0; i < channelsDelays.length; i++) {
                const channelDelay = channelsDelays[i];
                delay += channelDelay.delay
              }

            }
          }
          console.log("delay", delay)

          setTimeout(function () {
            element.style.display = 'none'
          }, 1000 * delay)

          //that.loading = false
          return
        })
        .catch(function (msg) {
          //console.log(msg)
          that.$toaster.error(msg)
          that.loading = false
          //that.devices[index].isTurnedOn = !that.devices[index].isTurnedOn
          return
        })

    },
    addedDevice(device) {
      this.devices.push(device);
      if (device.groupId) {
        //this.selectGroup(this.groups.find(x => x._id == device.groupId), this.groups.findIndex(x => x._id == device.groupId))
        //add device to its group
        this.groups.find(x => x._id == device.groupId).devices.push(device)
      }
    },
    deleteDevice(deviceId, index) {
      let that = this;
      this.$confirm(
        {
          message: 'Do you really want to delete?',
          button: {
            no: 'No',
            yes: 'Yes'
          },
          callback: confirm => {
            if (confirm) {
              try {
                axios.delete("/devices", { data: { "id": deviceId } })
                  .then(function (response) {
                    console.log(response); // Log the response to debug

                    if (response.status === 200) { // Check if the response is successful
                      let groupDevices = that.groups.find(x => x._id == that.devices[index].groupId).devices;
                      if (groupDevices.length > 0) {
                        that.groups.find(x => x._id == that.devices[index].groupId).devices = groupDevices.filter(x => x._id != that.devices[index]._id);
                      }
                      that.devices.splice(index, 1); // Remove the device from the list
                      that.$toaster.success('Device Deleted.'); // Change to success notification
                    } else {
                      that.$toaster.error('Something went wrong.'); // Handle unexpected status codes
                    }
                  })
                  .catch(function (error) {
                    console.log(error); // Log the error for debugging
                    that.$toaster.error('Something went wrong during deletion.'); // Improved error message
                  });
              } catch (error) {
                console.error(error); // Log any additional errors
                that.$toaster.error('An unexpected error occurred.');
              }

            }
          }
        }
      )
      return;
    },
    handleScroll() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !this.loading
      ) {
        // this.loading = true;
        // this.page++;
        // this.fetchData();
        console.log('scroll')
      }
    }
  }, //
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  mounted() {

    this.getDevices();
    this.myInterval = setInterval(this.getDevices, 8 * 1000);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    clearInterval(this.myInterval);
  }
}
</script>

<style scoped>
label {
  font-weight: 700;
}

.box-shadow {
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  padding: 20px;
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

.bg-gray {
  --bs-bg-opacity: 1;
  background-color: #FF7F50 !important;
}

.card {
  box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
}

.bot-img {
  text-align: center;
  margin-bottom: 20px;
}

.bot-img>img {
  width: 64px;
  height: 64px;
  opacity: 0.7;
  -webkit-filter: drop-shadow(0px 0px 2px #222);
  filter: drop-shadow(0px 0px 2px #222);
}

.progress-bar {
  border-radius: 100px;
}

.progress-label {
  position: absolute;
  width: 100%;
  top: -2px;
  color: white;
  text-shadow: 1px 1px 5px black;
}

.price-range-tooltip {
  position: absolute;
  width: 100%;
  text-align: center;
  background-color: #333;
  width: min-content;
  transition: all 0.3s ease-in-out;
  z-index: 1;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 5px;
  border-radius: 5px;
  opacity: 0;
  /* Ensure tooltips are above other elements */
}

.tooltip-top {
  top: -30px;
}

.tooltip-bottom {
  bottom: -35px;
  transform: translateX(-50%);
  opacity: 0
}

.tooltip-bottom.middle {
  bottom: -35px;
  transform: translateX(-50%);
}

.tooltip-bottom.end {
  right: 0px;
  transform: translateX(50%)
}

.tooltip-bottom::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-style: solid;
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent #333 transparent;
}

.tooltip-bottom.middle::before {
  border-color: transparent transparent #0d6efd transparent;
}

.range-progress-bar-container:hover .tooltip-bottom {
  opacity: 0.8
}

.tooltip-bottom:hover {
  z-index: 999;
}

.schedule-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

.device-info {
  flex: 1;
}

.days-of-week {
  display: flex;
}

.day {
  margin-right: 5px;
  font-weight: bold;
}

.schedule-details {
  display: flex;
  align-items: center;
}

.schedule-time {
  margin-right: 10px;
}
</style>