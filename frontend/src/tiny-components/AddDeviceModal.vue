<template>
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
                        <!-- <template v-if="isAdmin">
                            <div class="col-md-12">
                                <label for="inputDeviceAUserId" class="form-label">User</label>
                                <Dropdown class="" style="width: 100%;" :options="options"
                                    v-on:selected="validateSelection" v-on:filter="getDropdownValues" :disabled="false"
                                    placeholder="Search a User">
                                </Dropdown>
                                <input type="hidden" class="form-control" id="inputDeviceAUserId" name="aUserId"
                                    :value="selectedUser.id" readonly>
                            </div>
                        </template> -->
                        <input type="hidden" class="form-control" id="inputDeviceAUserId" name="aUserId"
                            v-model="selectedUserId">
                        <div class="col-md-12">
                            <label for="inputName5" class="form-label">Device Name</label>
                            <input type="text" class="form-control" id="inputName5" name="name">
                        </div>
                        <div class="col-md-6">
                            <label for="inputDeviceType" class="form-label">Device Type</label>
                            <select id="inputDeviceType" class="form-select" v-model="selectedDevice">
                                <option v-for="(deviceType, index) in deviceTypes" :value="index">{{ deviceType.name }}
                                </option>
                            </select>
                            <input type="hidden" name="type" :value="deviceTypes[selectedDevice].name" readonly>
                            <input type="hidden" name="channels" :value="deviceTypes[selectedDevice].channels" readonly>
                        </div>
                        <div class="col-md-6">
                            <label for="inputCode" class="form-label">Device ID</label>
                            <input type="text" class="form-control" id="inputCode" name="code">
                        </div>


                        <div class="col-12">
                            <label for="inputAddress5" class="form-label">Group</label>
                            <Select class="form-select" name="groupId">
                                <option v-for="(group, index) in groups" :value="group._id">{{ group.name }}</option>
                            </Select>
                        </div>
                        <div class="d-flex gap-3 justify-content-center">
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
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "AddDeviceModal",
        props: ['loading', 'groups', 'isAdmin'],
        components: {
        },
        data() {
            return {
                selectedDevice: 0,
                options: [],
                users: [],
                selectedUser: { name: null, id: null },
            };
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
            addDevice() {
                let formData = new FormData(this.$refs.addDevice_form);
                let that = this
                this.$emit('set-loading', true);
                let data = this.$FormToJson(formData);

                axios.post("/devices", data).then(function (data) {
                    //console.log(data.data);
                    //that.devices.push(data.data);
                    that.$emit('added-device', data.data);
                    that.$refs.addDevice_form.reset();
                    setTimeout(function () {
                        that.$emit('set-loading', false);
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
        },
        mounted() {
        }
    }
</script>