<template>
    <div class="modal fade" id="addWidgetModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style="color: var(--secondary-color-1)">Add Widget</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="color: var(--secondary-color-1);">
                    <!-- Multi Columns Form -->
                    <form class="row g-3" id="addWidget_form" ref="addWidget_form" v-on:submit.prevent="addWidget">
                        <input type="hidden" class="form-control" id="inputDeviceAUserId" name="aUserId"
                            v-model="selectedUserId">
                        <div class="col-md-12">
                            <label for="inputName5" class="form-label">Widget Name</label>
                            <input type="text" class="form-control" id="inputName5" name="name">
                        </div>
                        <div class="col-md-12">
                            <label for="inputName6" class="form-label">Widget Type</label>
                            <select name="type" class="form-select" id="">
                                <option value="powersavings">Power Savings</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label for="inputName5" class="form-label">Select Groups</label>
                            <Dropdown :inputStyle="'height: 42px;'" :options="options" v-on:selected="validateSelection"
                                v-on:filter="getDropdownValues" :disabled="false" :defaultShowItems="true"
                                placeholder="Search a Group">
                            </Dropdown>

                            <div>
                                <span v-for="(group, index) in selectedGroups" :key="group._id" v-if="group.name">

                                    <h4 style="display: inline;">
                                        <span class="badge bg-primary mt-2 me-1">{{ group.name }}
                                            <span style="cursor: pointer;"
                                                @click="removeSelectedGroup(index)">&nbsp;&nbsp;&nbsp;X</span>
                                        </span>
                                    </h4>
                                </span>
                            </div>
                        </div>
                        <!-- <div class="col-12">
                      <label for="inputAddress5" class="form-label">API key</label>
                      <input type="text" class="form-control" id="inputAddres5s" name="apiKey" placeholder="12345ABC">
                    </div> -->
                        <div class="d-flex gap-3 justify-content-center">
                            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
                            <button type="reset" class="btn btn-secondary" @click="selectedGroups = []">Reset</button>
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
        name: "AddWidgetModal",
        props: ['loading'],
        components: {
            Dropdown
        },
        data() {
            return {
                selectedDevice: 0,
                options: [],
                users: [],
                selectedUser: { name: null, id: null },

                groups: [],
                selectedGroups: [],
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
            addWidget() {
                let formData = new FormData(this.$refs.addWidget_form);
                let that = this
                this.$emit('set-loading', true);
                let data = this.$FormToJson(formData);

                data.groupsIds = JSON.stringify(this.selectedGroups.map((d) => d._id));

                axios.post("/widget", data).then(function (data) {
                    //console.log(data.data);
                    //that.devices.push(data.data);
                    that.$emit('added-widget', data.data);
                    that.$refs.addWidget_form.reset();
                    setTimeout(function () {
                        that.$emit('set-loading', false);
                    }, 2000)
                    that.$toaster.success('Widget Added!')
                }).catch(function (error) {
                    if (error.response) {
                        that.$toaster.error(that.$capitalizedString(error.response.data.data));
                    } else {
                        that.$toaster.error(error);
                    }
                    that.loading = false;
                })
            },
            getGroups() {
                let that = this;
                this.$emit('set-loading', true);
                axios.get("/devices/groups").then(function (data) {
                    console.log("getGroups", data.data.groups);
                    //that.users = data.data;
                    that.options = data.data.groups;
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
            removeSelectedGroup(index) {
                this.selectedGroups.splice(index, 1)
            },
            validateSelection(selection) {
                //console.log(selection)
                //console.log(selection.name + " has been selected");

                //console.log(this.selectedGroups)
                if (this.selectedGroups.find(x => x.name && x._id == selection._id)) {
                } else if (selection.name) {
                    this.selectedGroups.push(selection)
                }
            },
            getDropdownValues(keyword) {
                //console.log("You could refresh options by querying the API with " + keyword);
            }
        },
        mounted() {
            this.getGroups()
        }
    }
</script>