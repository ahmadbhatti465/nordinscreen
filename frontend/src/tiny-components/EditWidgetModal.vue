<template>
    <div class="modal fade" id="editWidgetModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style="color: var(--secondary-color-1)">Edit Widget</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="color: var(--secondary-color-1);">
                    <form class="row g-3" id="editWidget_form" ref="editWidget_form" v-on:submit.prevent="editWidget">
                        <input type="hidden" name="id" v-model="widget._id">
                        <div class="col-md-12">
                            <label for="inputName5" class="form-label">Widget Name</label>
                            <input type="text" class="form-control" id="inputName5" name="name" v-model="widget.name">
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

                        <div class="d-flex gap-3 justify-content-center">
                            <button type="submit" class="btn btn-primary"
                                data-bs-dismiss="modal">Save</button>
                            <button type="reset" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
        name: "EditWidgetModal",
        props: ['loading', 'widget'],
        components: {
            Dropdown
        },
        data() {
            return {
                selectedGroup: 0,
                options: [],
                users: [],
                selectedUser: { name: null, _id: null },

                groups: [],
                selectedGroups: [],
            };
        },
        computed: {
        },
        watch: {
            widget: function () {
                //console.log("watch", this.widget)
                //this.selectedGroups = this.widget.groupsIds;
                if(this.groups.length > 0) {
                    //console.log("inside watch groups length > 0")
                    let groupsIds = this.widget.groupsIds;
                    this.selectedGroups = this.groups.filter((d) => groupsIds.includes(d._id));
                    //console.log(this.selectedGroups)
                } else {
                    //console.log("inside watch groups length <= 0")
                }
            }
        },
        methods: {
            editWidget() {
                let formData = new FormData(this.$refs.editWidget_form);
                let that = this
                this.$emit('set-loading', true);
                let data = this.$FormToJson(formData);

                data.groupsIds = JSON.stringify(this.selectedGroups.map((d) => d._id));

                //console.log(data)

                axios.put("/widget", data).then(function (data) {
                    //console.log(data.data);
                    //that.devices.push(data.data);
                    //that.selectedGroups = [];

                    that.$emit('updated-widget', data.data);
                    //that.$refs.editWidget_form.reset();
                    setTimeout(function () {
                        that.$emit('set-loading', false);
                    }, 2000)
                    that.$toaster.success('Widget Updated!')
                }).catch(function (error) {
                    if (error.response) {
                        that.$toaster.error(that.$capitalizedString(error.response.data.data));
                    } else {
                        that.$toaster.error(error);
                    }
                    that.$emit('set-loading', false);
                })
            },
            getGroups() {
                //console.log("EditWidget - getGroups")
                let that = this;
                axios.get("/devices/groups?fields=id,name").then(function (data) {
                    let groups = data.data.groups;
                    //console.log("EditWidget - getGroups", groups)
                    groups.map((d) => {
                        that.options.push({ name: d.name, _id: d._id })
                    })
                    that.groups = groups
                }).catch(function (error) {
                    if (error.response) {
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