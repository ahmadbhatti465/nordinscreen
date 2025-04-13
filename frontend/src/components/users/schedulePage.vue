<template>
  <div id="wrapper">
    <CommonSidebar :userId="userId"></CommonSidebar>

    <div class="main p-0">
      <CommonHeader :userId="userId" title="Schedule" subtitle="" :loading="loading"></CommonHeader>
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
                        <h1>Schedule</h1>
                        <hr style="color: grey" />
                      </div>
                      <!-- End Page Title -->
                    </div>
                    <div class="content-row row">
                      <!-- First Content Row Dashboard -->
                      <div class="container">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="card mt-3 mb-0">
                              <div class="card-header">
                                <h5>Select Device</h5>
                              </div>
                              <div class="card-body mt-3">
                                <Dropdown class="" style="width: 100%;" :options="options"
                                  v-on:selected="validateSelection" v-on:filter="getDropdownValues" :disabled="false"
                                  :defaultShowItems="true" placeholder="Search a Device">
                                </Dropdown>
                                <!-- <select class="form-select" v-model="selectedDevice">
                                  <option v-for="device in devices" :value="device">{{ device.name }}</option>
                                </select> -->
                              </div>
                            </div>
                            <div class="card mt-3 mb-0">
                              <div class="card-header">
                                <h5>Select Group</h5>
                              </div>
                              <div class="card-body mt-3">
                                <Dropdown class="" style="width: 100%;" :options="groupsOptions"
                                  v-on:selected="validateSelectionGroup" v-on:filter="getDropdownValues"
                                  :disabled="false" :defaultShowItems="true" placeholder="Search a Group">
                                </Dropdown>
                                <!-- <select class="form-select" v-model="selectedDevice">
                                  <option v-for="device in devices" :value="device">{{ device.name }}</option>
                                </select> -->
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="card mt-3 mb-3">
                              <div class="card-header" v-if="schedule.scheduleType == 'device'">
                                <h5>
                                  Device: {{ selectedDevice.name ? selectedDevice.name : 'None' }}
                                </h5>
                              </div>
                              <div class="card-header" v-if="schedule.scheduleType == 'group'">
                                <h5>
                                  Group: {{ selectedGroup.name ? selectedGroup.name : 'None' }}
                                </h5>
                              </div>
                              <div class="card-body">
                                <div class="mb-2 mt-2">
                                  <label for="name" class="form-label">Schedule Name</label>
                                  <input type="text" class="form-control" :id="'name' + selectedDevice.id"
                                    v-model="schedule.name">
                                </div>
                                <div class="mb-2">
                                  <label for="startTime" class="form-label">Start Time</label>
                                  <input type="time" class="form-control" :id="'startTime' + selectedDevice.id"
                                    v-model="schedule.startTime">
                                </div>
                                <div class="mb-2">
                                  <label for="endTime" class="form-label">End Time</label>
                                  <input type="time" class="form-control" :id="'endTime' + selectedDevice.id"
                                    v-model="schedule.endTime">
                                </div>
                                <div class="mb-2">
                                  <label for="dayOfWeek" class="form-label">Day of Week</label>
                                  <div class="days-of-week">
                                    <span class="day-circle" v-for="(day, index) in daysOfWeek" :key="index"
                                      @click="addDayOfWeek(index)"
                                      :class="schedule.daysOfWeek.includes(index) ? 'bg-primary' : ''">{{ day
                                      }}</span>
                                  </div>
                                </div>
                                <button class="btn btn-primary" @click="saveSchedule()"
                                  :disabled="selectedDevice.id == null && selectedGroup.id == null">Save</button>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                      <!-- End First Content Row Dashboard -->

                      <div class="row">
                        <!-- Display all schedules with improved design -->
                        <div class="container mt-5">
                          <div class="row">
                            <div class="col-12">
                              <div class="card shadow">
                                <div class="card-header bg-primary">
                                  <h5 class="card-title text-white">
                                    <h5>Device Schedules</h5>
                                  </h5>
                                </div>
                                <div class="schedule-container">
                                  <div v-if="schedules.length == 0" class="nodata">
                                    <img src="../../assets/images/nodata.png" id="nodata_image" alt='' /><br />
                                    <span>No Data Now</span>
                                  </div>
                                  <div v-for="(mySchedule, index) in schedules" :key="mySchedule.id"
                                    class="schedule-item">
                                    <div class="device-info">
                                      <h4>{{ mySchedule.name }} <span v-if="mySchedule.scheduleType == 'group'"
                                          class="fs-5"> &nbsp;&nbsp;&nbsp;&nbsp;<i data-v-1228ae71=""
                                            class="bx bx-plug"></i> {{ findGroupDevices(mySchedule.groupId) }}</span>
                                      </h4>

                                      <div class="days-of-week" v-if="mySchedule.daysOfWeek">
                                        <span class="day-circle" v-for="(day, index) in daysOfWeek" :key="index"
                                          :class="mySchedule.daysOfWeek.includes(day) ? 'bg-primary' : ''">{{ day
                                          }}</span>
                                      </div>
                                    </div>
                                    <div class="schedule-details">
                                      <div class="schedule-time">
                                        <span class="label">Start:</span>
                                        <span class="value">{{ mySchedule.startTime || 'Not set' }}</span>
                                      </div>
                                      <div class="schedule-time">
                                        <span class="label">End:</span>
                                        <span class="value">{{ mySchedule.endTime || 'Not set' }}</span>
                                      </div>
                                      <div class="actions">
                                        <button class="btn btn-primary" data-bs-toggle="modal"
                                          data-bs-target="#editScheduleModal" @click="updateSchedule(mySchedule)">Edit</button>
                                        <button class="btn btn-danger"
                                          @click="deleteSchedule(mySchedule._id, index)">Delete</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <!-- @click="editSchedule(mySchedule, index)" -->

                              </div>
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

          <!-- modals -->
          <!-- Basic Modal -->
          <div class="modal fade" id="editScheduleModal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" style="color: var(--secondary-color-1)">Edit Schedule</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="color: var(--secondary-color-1);" v-for="edit in editSchedules"
                  :key="edit._id">
                  <!-- Multi Columns Form -->
                  <form class="row g-3" id="addDevice_form" v-on:submit.prevent="editSchedule(edit)">
                    <div class="col-md-12">
                      <div class="">
                        <!-- <div class="">
                          Device: {{ edit.name ? edit.name : 'None' }}
                        </div> -->
                        <div class="">
                          <div class="mb-2 mt-2">
                            <label for="name" class="form-label">Schedule Name</label>
                            <input type="text" class="form-control" :id="'name' + edit.id"
                              v-model="editMySchedule.name">
                          </div>
                          <div class="mb-2">
                            <label for="startTime" class="form-label">Start Time</label>
                            <input type="time" class="form-control" :id="'startTime' + edit.id"
                              v-model="editMySchedule.startTime">
                          </div>
                          <div class="mb-2">
                            <label for="endTime" class="form-label">End Time</label>
                            <input type="time" class="form-control" :id="'endTime' + edit.id"
                              v-model="editMySchedule.endTime">
                          </div>
                          <div class="mb-2">
                            <label for="dayOfWeek" class="form-label">Day of Week</label>
                            <div class="days-of-week">
                              <span class="day-circle" v-for="(day, index) in daysOfWeek"
                                :key="index + '_' + editChange" @click="editDayOfWeek(index)"
                                :class="editMySchedule.daysOfWeek.includes(index) ? 'bg-primary' : ''">
                                {{ day }}
                              </span>
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Edit</button>
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
import Dropdown from '../../tiny-components/Dropdown.vue';
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'dashboard-page',
  components: {
    CommonHeader,
    CommonSidebar,
    RightSideBar,
    Dropdown
  },
  props: ['userId'],
  data() {
    return {
      schedules: [],
      groups: [],
      editSchedules: [],
      editChange: 0,
      options: [
      ],
      groupsOptions: [
      ],
      selectedDevice: { name: null, id: null },
      selectedGroup: { name: null, id: null },
      scheduleType: "device",
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      schedule: {
        scheduleType: "device",
        startTime: "10:00",
        endTime: "18:00",
        daysOfWeek: [0]
      },
      editMySchedule: {
        name: "",
        startTime: "",
        endTime: "",
        daysOfWeek: [],
        deviceId: "",
        groupId:""
      },
      loading: true,
    }
  },
  watch: {
    selectedUserId() {
      this.getSchedules()
    }
  },
  computed: {
    selectedUserId() {
      return this.$store.getters.adminSelectedUserId
    },
  },
  methods: {
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
    getGroups() {
      let that = this;
      axios.get("/devices/groups?fields=id,name,devices").then(function (data) {
        console.log(data.data);
        let groups = data.data.groups;
        that.groups = groups;
        groups.map((d) => {
          that.groupsOptions.push({ name: d.name, id: d._id })
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
    findGroupDevices(groupId) {
      const group = this.groups.find(g => g._id === groupId);
      return group ? group.devices.length : 0;
    },
    addDayOfWeek(day) {
      //console.log("ADD DAY:", day)
      if (!this.schedule.daysOfWeek.includes(day)) {
        this.schedule.daysOfWeek.push(day)
      } else {
        this.schedule.daysOfWeek.splice(this.schedule.daysOfWeek.indexOf(day), 1)
      }
    },
    editDayOfWeek(day) {
      this.editChange += 1
      if (!this.editMySchedule.daysOfWeek.includes(day)) {
        this.editMySchedule.daysOfWeek.push(day)
      } else {
        this.editMySchedule.daysOfWeek.splice(this.editMySchedule.daysOfWeek.indexOf(day), 1)
      }
    },
    updateSchedule(schedule, index) {
      this.selectedDevice = {}
      this.selectedDevice._id = schedule.deviceId
      this.editMySchedule = {}
      this.editMySchedule.deviceId = schedule.deviceId
      this.editMySchedule.name = schedule.name
      this.editMySchedule._id = schedule._id
      this.editMySchedule.groupId = schedule.groupId
      this.editMySchedule.startTime = schedule.startTime
      this.editMySchedule.endTime = schedule.endTime
      this.editMySchedule.daysOfWeek = schedule.daysOfWeek.map(day => this.daysOfWeek.indexOf(day))
      if (this.editSchedules.length > 0) {
        this.editSchedules = []
        this.editSchedules.push(schedule)
      } else {
        this.editSchedules.push(schedule)
      }

    },
    editSchedule(schedule) {

      let that = this
      this.loading = true;

      let daysOfWeek = this.editMySchedule.daysOfWeek
        .filter(day => day !== null && day !== undefined)
        .map(day => that.daysOfWeek[day]);

      let formData = {
        id: schedule._id,
        name: this.editMySchedule.name,
        deviceId: this.editMySchedule.deviceId,
        groupId: this.editMySchedule.groupId,
        startTime: this.editMySchedule.startTime,
        endTime: this.editMySchedule.endTime,
        daysOfWeek: JSON.stringify(daysOfWeek)
      }

      try {
        axios.put("/schedules", formData).then(function (data) {
          that.loading = false;
          that.$toaster.success('Schedule Edited!')
          // that.schedules.push(data.data)
          that.getSchedules()
        }).catch(function (error) {
          console.log(error);
          that.$toaster.error('An error occurred while edit schedule.');
          that.loading = false;
        })

      } catch (error) {
        console.error(error);
        that.$toaster.error('An error occurred while edit schedule.');
        that.loading = false;
      }
    },
    saveSchedule() {
      let that = this
      this.loading = true;

      //console.log(device);
      let formData = new FormData();
      formData.append("scheduleType", this.schedule.scheduleType);
      if (this.schedule.scheduleType === "device") {
        formData.append("deviceId", this.selectedDevice.id);
      } else if (this.schedule.scheduleType === "group") {
        formData.append("groupId", this.selectedGroup.id);
      }
      formData.append("name", this.schedule.name);
      formData.append("startTime", this.schedule.startTime);
      formData.append("endTime", this.schedule.endTime);

      //formData.append("daysOfWeek", this.schedule.daysOfWeek);
      // this.schedule.daysOfWeek.forEach((day, index) => {
      //   formData.append(`daysOfWeek`, that.daysOfWeek[day]);
      // })

      let daysOfWeek = this.schedule.daysOfWeek.map(day => that.daysOfWeek[day]);
      formData.append("daysOfWeek", JSON.stringify(daysOfWeek));

      try {
        axios.post("/schedules", Vue.prototype.$FormToJson(formData)).then(function (data) {
          that.loading = false;
          that.$toaster.success('Schedule added!')
          that.schedules.push(data.data)
        }).catch(function (error) {
          console.log(error);
          that.$toaster.error('An error occurred while adding schedule.');
          that.loading = false;
        })

      } catch (error) {
        console.error(error);
        that.$toaster.error('An error occurred while adding schedule.');
        that.loading = false;
      }

    },
    getSchedules() {
      let that = this;
      try {
        axios.get("/schedules").then(function (data) {
          that.schedules = data.data.schedules;
          //console.log("SCEDULES:", that.schedules)
          that.loading = false;
        }).catch(function (error) {
          console.log(error);
        })

      } catch (error) {
        this.error = 'An error occurred while fetching data.';
        console.error(error);
        that.loading = false;
      }

    },
    deleteSchedule(scheduleId, index) {
      let that = this;
      if (confirm("Are you sure you want to delete this schedule?")) {
        that.loading = true;

        try {
          axios.delete("/schedules?id=" + scheduleId).then(function (data) {
            //remove schedule from schedules array
            that.schedules.splice(index, 1);
            that.$toaster.success('Schedule deleted!')
            that.loading = false;
          }).catch(function (error) {
            that.$toaster.error('An error occurred while deleting schedule.');
            that.loading = false;
          })
        } catch (error) {
          console.error(error);
          that.$toaster.error('An error occurred while deleting schedule.');
          that.loading = false;
        }
      }

    },
    validateSelection(selection) {
      this.selectedDevice = selection;
      this.schedule.name = selection.name;
      this.schedule.scheduleType = "device";
      //console.log(selection.name + " has been selected");
    },
    validateSelectionGroup(selection) {
      this.selectedGroup = selection;
      this.schedule.name = selection.name;
      this.schedule.scheduleType = "group";
      //console.log(selection.name + " has been selected");
    },
    getDropdownValues(keyword) {
      //console.log("You could refresh options by querying the API with " + keyword);
    }
  },
  mounted() {
    //this.devices = this.$store.state.Devices.devices
    this.getDevices();
    this.getGroups();
    this.getSchedules();
  },
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

.card-header {
  font-size: 1.25rem;
  font-weight: 500;
}

.badge {
  padding: 0.5em 0.75em;
  font-size: 0.9em;
}

.list-group-item {
  border: none;
  /* Remove borders for a cleaner look */
  border-bottom: 1px solid #f0f0f0;
  /* Add subtle borders between list items */
}

.list-group-item:last-child {
  border-bottom: none;
  /* Remove the bottom border for the last item */
}

.day-circle {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #ccc;
  margin-right: 5px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
}

.day-circle.active {
  background-color: #007bff;
  color: #fff;
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