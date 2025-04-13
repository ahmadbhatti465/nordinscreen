<template>
    <div class="modal fade" id="addGroupModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style="color: var(--secondary-color-1)">Add Group</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="color: var(--secondary-color-1);">
                    <!-- Multi Columns Form -->
                    <form class="row g-3" id="addGroup_form" ref="addGroup_form" v-on:submit.prevent="addGroup">
                        <input type="hidden" class="form-control" id="inputDeviceAUserId" name="aUserId"
                            v-model="selectedUserId">
                        <div class="col-md-12">
                            <label for="inputName5" class="form-label">Group Name</label>
                            <input type="text" class="form-control" id="inputName5" name="name">
                        </div>
                        <!-- <div class="col-md-12">
                            <label for="inputName5" class="form-label">Select Devices</label>
                            <Dropdown :inputStyle="'height: 42px;'" :options="options" v-on:selected="validateSelection"
                                v-on:filter="getDropdownValues" :disabled="false" :defaultShowItems="true"
                                placeholder="Search a Device">
                            </Dropdown>

                            <div>
                                <span v-for="(device, index) in selectedDevices" :key="device._id" v-if="device.name">

                                    <h4 style="display: inline;">
                                        <span class="badge bg-primary mt-2 me-1">{{ device.name }}
                                            <span style="cursor: pointer;"
                                                @click="removeSelectedDevice(index)">&nbsp;&nbsp;&nbsp;X</span>
                                        </span>
                                    </h4>
                                </span>
                            </div>
                        </div> -->
                        <!-- <div class="col-12">
                      <label for="inputAddress5" class="form-label">API key</label>
                      <input type="text" class="form-control" id="inputAddres5s" name="apiKey" placeholder="12345ABC">
                    </div> -->
                        <div class="d-flex gap-3 justify-content-center">
                            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
                            <button type="reset" class="btn btn-secondary" @click="selectedDevices = []">Reset</button>
                        </div>
                    </form><!-- End Multi Columns Form -->
                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                  </div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import Dropdown from './Dropdown.vue'
    import axios from 'axios'
    export default {
        name: "AddGroupModal",
        props: ['loading', 'defaultGroupId', 'getFreshDevices'],
        components: {
            Dropdown
        },
        data() {
            return {
                selectedDevice: 0,
                options: [],
                users: [],
                selectedUser: { name: null, id: null },

                devices: [],
                selectedDevices: [],
            };
        },
        watch: {
            getFreshDevices: function () {
                //console.log("Get fresh devices")
                this.getDevices()
            }
        },
        computed: {
            deviceTypes: function () {
                return this.$store.state.Devices.types
            },
            selectedUserId() {
                return this.$store.getters.adminSelectedUserId
            },
        },
        methods: {
            addGroup() {
                let formData = new FormData(this.$refs.addGroup_form);
                let that = this
                this.$emit('set-loading', true);
                let data = this.$FormToJson(formData);

                data.devices = JSON.stringify(this.selectedDevices.map((d) => d.id));

                axios.post("/devices/groups", data).then(function (data) {
                    //console.log(data.data);
                    //that.devices.push(data.data);
                    that.selectedDevices = [];

                    that.$emit('added-group', data.data);
                    that.$refs.addGroup_form.reset();
                    setTimeout(function () {
                        that.$emit('set-loading', false);
                    }, 2000)
                    that.$toaster.success('Group Added!')
                }).catch(function (error) {
                    if (error.response) {
                        that.$toaster.error(that.$capitalizedString(error.response.data.data));
                    } else {
                        that.$toaster.error(error);
                    }
                    that.$emit('set-loading', false);
                })
            },
            getDevices() {
                let that = this;
                this.options = [];
                axios.get("/devices?fields=id,name,groupId").then(function (data) {
                    let devices = data.data.devices;
                    //console.log("default group: ", that.defaultGroupId);
                    devices.map((d) => {
                        if(d.groupId == that.defaultGroupId){
                            that.options.push({ name: d.name, id: d._id })
                        }
                            
                    })
                }).catch(function (error) {
                    if (error.response) {
                        console.error(error.response.data.data);
                    } else {
                        console.error('Error:', error.message);
                    }
                })
            },
            removeSelectedDevice(index) {
                this.selectedDevices.splice(index, 1)
            },
            validateSelection(selection) {
                //console.log(selection)
                //console.log(selection.name + " has been selected");

                //this.selectedDevices.push(selection);
                if (this.selectedDevices.find(x => x.name && x.id == selection.id)) {
                } else if (selection.name) {
                    this.selectedDevices.push(selection)
                }
            },
            getDropdownValues(keyword) {
                //console.log("You could refresh options by querying the API with " + keyword);
            }
        },
        mounted() {
            this.getDevices();
        }
    }
</script>