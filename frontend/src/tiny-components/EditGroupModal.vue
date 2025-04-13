<template>
    <div class="modal fade" id="editGroupModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style="color: var(--secondary-color-1)">Edit Group</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="color: var(--secondary-color-1);">
                    <form class="row g-3" id="editGroup_form" ref="editGroup_form" v-on:submit.prevent="editGroup">
                        <input type="hidden" name="id" v-model="myGroup._id">
                        <div class="col-md-12">
                            <label for="inputName5" class="form-label">Group Name</label>
                            <input type="text" class="form-control" id="inputName5" name="name" v-model="myGroup.name">
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

                        <div class="d-flex gap-3 justify-content-center">
                            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Save</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Dropdown from './Dropdown.vue'
    import axios from 'axios'
    export default {
        name: "EditGroupModal",
        props: ['loading', 'group', 'defaultGroupId', 'getFreshDevices'],
        components: {
            Dropdown
        },
        data() {
            return {
                selectedDevice: 0,
                options: [],
                users: [],
                selectedUser: { name: null, _id: null },

                myGroup: {},
                devices: [],
                selectedDevices: [],
            };
        },
        computed: {
            deviceTypes: function () {
                return this.$store.state.Devices.types
            },
        },
        watch: {
            getFreshDevices: function () {
                //console.log("Get fresh devices")
                this.getDevices()
            },
            group: function () {
                //console.log("watch", this.group)
                
                //this.selectedDevices = Object.assign([], this.group.devices);
                // this.selectedDevices = [];
                // for (let index = 0; index < this.group.devices.length; index++) {
                //     const device = this.group.devices[index];
                //     if(device.groupId == this.group._id){
                //         this.selectedDevices.push(device)
                //     }
                    
                // }
                this.myGroup = Object.assign({}, this.group)
            }
        },
        methods: {
            editGroup() {
                let formData = new FormData(this.$refs.editGroup_form);
                let that = this
                this.$emit('set-loading', true);
                let data = this.$FormToJson(formData);

                data.devices = JSON.stringify(this.selectedDevices.map((d) => d._id));

                //console.log(data)

                axios.put("/devices/groups", data).then(function (data) {
                    //console.log(data.data);
                    //that.devices.push(data.data);

                    that.$emit('updated-group', data.data);
                    //that.$refs.editGroup_form.reset();
                    that.$emit('set-loading', false);
                    that.$toaster.success('Group Updated!')
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
                    //console.log("Edit defaultGroupId", that.defaultGroupId)
                    devices.map((d) => {
                        //console.log(d.groupId)
                        if (d.groupId == that.defaultGroupId)
                            that.options.push({ name: d.name, _id: d._id })
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

                //console.log(this.selectedDevices)
                if (this.selectedDevices.find(x => x.name && x._id == selection._id)) {
                } else if (selection.name) {
                    this.selectedDevices.push(selection)
                }
            },
            getDropdownValues(keyword) {
                //console.log("You could refresh options by querying the API with " + keyword);
            }
        },

        mounted() {
            this.getDevices()
        }
    }
</script>