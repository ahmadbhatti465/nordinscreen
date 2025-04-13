<template>
    <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style="color: var(--secondary-color-1)">{{ device.name }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="color: var(--secondary-color-1);">
                    <form class="row g-3" id="editDevice_form" ref="editDevice_form" v-on:submit.prevent="editDevice">

                        <div class="col-md-12">
                            <!-- <label for="inputName5" class="form-label">Device Name: {{ device.name }}</label> -->
                        </div>
                        <div class="col-12">
                            <label for="inputAddress5" class="form-label">Group</label>
                            <Select class="form-select" name="groupId">
                                <option v-for="(group, index) in groups" :value="group._id" :selected="groupId == group._id">{{ group.name }}</option>
                            </Select>
                        </div>
                        <div class="col-12">
                            <label for="inputAddress5" class="form-label">Channel Delays</label>
                        <template v-for="(channel, index) in device.channels">
                            <div class="input-group mb-3">
                                <span class="input-group-text">Channel {{ index }}</span>
                                <input :disabled="index == 0" type="text" class="form-control"
                                    v-model="channels[index].delay">
                                <span class="input-group-text">seconds Delay</span>
                            </div>
                        </template>
                        </div>

                        <div class="d-flex gap-3 justify-content-center">
                            <button type="submit" class="btn btn-primary"
                                data-bs-dismiss="modal">Save</button>
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
        name: "EditDeviceModal",
        props: ['loading', 'device', 'groups', 'isAdmin'],
        components: {
            Dropdown
        },
        data() {
            return {
                selectedDevice: 0,
                groupId: "",
                options: [],
                users: [],
                selectedUser: { name: null, id: null },
                channels: []
            };
        },
        computed: {
            deviceTypes: function () {
                return this.$store.state.Devices.types
            }
        },
        watch: {
            device: function () {
                //console.log("watch", this.device)
                //console.log(this.device.channels)
                this.groupId = this.device.groupId
                this.channels = this.device.channelsDelays ? JSON.parse(JSON.stringify(this.device.channelsDelays)) : []
                if (this.channels.length == 0) {
                    for (let index = 0; index < this.device.channels; index++) {
                        this.channels.push({ channel: index, delay: 0 })

                    }
                }
                //console.log(this.channels)
            }
        },
        methods: {
            editDevice() {
                let that = this
                this.$emit('set-loading', true);
                let formData = new FormData(this.$refs.editDevice_form);
                let data = this.$FormToJson(formData);

                let extraData = {
                    id: this.device._id,
                    channelsDelays: this.channels.map((ch, index) => ({
                        channel: index,
                        delay: ch.delay,
                    })),
                };

                data = Object.assign(data, extraData);

                //console.log(data)

                axios.put("/devices", data).then(function (data) {
                    //console.log(data.data);
                    //that.devices.push(data.data);
                    that.$emit('updated-device', data.data);
                    that.$refs.editDevice_form.reset();
                    setTimeout(function () {
                        that.$emit('set-loading', false);
                    }, 2000)
                    that.$toaster.success('Device Updated!')
                }).catch(function (error) {
                    if (error.response) {
                        that.$toaster.error(that.$capitalizedString(error.response.data.data));
                    } else {
                        that.$toaster.error(error);
                    }
                    that.loading = false;
                })
            },
            getUsers() {
                let that = this;
                console.log("getUsers")
                this.$emit('set-loading', true);
                axios.get("/user/users").then(function (data) {
                    console.log("getUsers", data.data);
                    //that.users = data.data;
                    that.options = data.data;
                    // that.users.map((d) => {
                    //   that.options.push({ name: d.name, id: d._id })
                    // })

                    that.$emit('set-loading', false);
                }).catch(function (error) {
                    that.$emit('set-loading', false);
                    if (error.response) {
                        //that.$toaster.error(that.$capitalizedString(error.response.data.data));            
                        console.error(error.response.data.data);
                    } else {
                        console.error('Error:', error.message);
                    }
                })
            },
            validateSelection(selection) {
                //console.log(selection)
                this.selectedUser = selection;
                //this.schedule.name = selection.name;
                //console.log(selection.name + " has been selected");
            },
            getDropdownValues(keyword) {
                //console.log("You could refresh options by querying the API with " + keyword);
            }
        },

        mounted() {

            if (this.isAdmin)
                this.getUsers();
        }
    }
</script>