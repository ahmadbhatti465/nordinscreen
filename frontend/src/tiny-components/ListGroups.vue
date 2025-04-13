<template>
    <div class="row">
        <div class="container" v-if="groups.length > 0">
            <div class="d-flex flex-wrap gap-2 mb-4 p-1 border border-secondary rounded align-items-baseline">
                <div class="d-flex p-2 rounded align-items-center" v-for="(group, index) in groups" :key="group._id"
                    :style="'font-size: 12px;' + (group.selected ? 'background-color: var(--secondary-color-2);' : 'background-color: var(--secondary-color-4);')">
                    <div :class="'d-flex ' + (group.isDefault ? '' : 'me-3')" style="cursor: pointer;"
                        @click="selectGroup(group, index)">{{ group.name }}</div>
                    <div v-if="!group.isDefault" class="d-flex gap-1">
                        <a data-bs-toggle="modal" data-bs-target="#editGroupModal" @click="editGroup = group"
                            style="cursor: pointer;">
                            <i class="bx bx-pencil"></i></a>
                        |
                        <a @click="deleteGroup(group._id, index)" style="cursor: pointer;">
                            <i class="bx bx-trash"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <AddGroupModal :loading="loading" :defaultGroupId="defaultGroupId" @added-group="addedGroup"
            @set-loading="setLoading" :getFreshDevices="getFreshDevicesCounter"></AddGroupModal>

        <EditGroupModal :loading="loading" :defaultGroupId="defaultGroupId" :group="editGroup"
            @updated-group="updatedGroup" @set-loading="setLoading" :getFreshDevices="getFreshDevicesCounter">
        </EditGroupModal>
    </div>
</template>

<script>
import AddGroupModal from './AddGroupModal.vue'
import EditGroupModal from './EditGroupModal.vue'
import axios from 'axios'

export default {
    name: "ListGroups",
    props: ['loading'],
    components: {
        AddGroupModal: AddGroupModal,
        EditGroupModal: EditGroupModal
    },
    data() {
        return {
            groups: [],
            editGroup: null,
            getFreshDevicesCounter: 0,
        };
    },
    watch: {
        selectedUserId() {
            this.getGroups()
        }
    },
    computed: {
        deviceTypes: function () {
            return this.$store.state.Devices.types
        },
        selectedUserId() {
            return this.$store.getters.adminSelectedUserId
        },
        defaultGroupId() {
            if (this.groups.length > 0) { return this.groups.find(x => x.isDefault == true)._id; }

        }
    },
    methods: {
        setLoading(value) {
            this.$emit('set-loading', value);
        },
        selectGroup(group) {
            this.$set(group, 'selected', !group.selected)

            let groupsIds = [];
            for (let index = 0; index < this.groups.length; index++) {
                const mgroup = this.groups[index];
                if (mgroup.selected) {
                    groupsIds.push(mgroup._id)
                }

            }

            this.$emit('groups-selected', groupsIds);
        },
        addSelectedGroup(group, index) {
            //check if group._id is already in selectedGroups
            if (this.selectedGroups.find(x => x._id == group._id)) {
                this.removeSelectedGroup(index)
            } else if (group.name) {
                this.selectedGroups.push(group)
            }
        },
        removeSelectedGroup(index) {
            this.selectedGroups.splice(index, 1)
        },
        addedGroup() {
            this.getGroups();
            this.getFreshDevicesCounter++;
        },
        updatedGroup(data) {
            //console.log("updatedGroup", data)
            this.editGroup = {};
            //this.selectedGroups = [];
            //this.updateGroupsField++;
            this.getGroups();
            //this.getDevices()
            //this.myInterval = setInterval(this.getDevices, 8 * 1000);


        },
        getGroups() {
            let that = this;
            this.setLoading(true);

            that.groups = [];
            axios.get("/devices/groups").then(function (data) {
                //console.log(data.data);
                that.groups = data.data.groups;
                //console.log("groups", that.groups)
                //console.log("setGroups", that.groups)
                that.$emit('set-groups', that.groups);
                that.setLoading(false);

            }).catch(function (error) {
                that.setLoading(false);

                if (error.response) {
                    //that.$toaster.error(that.$capitalizedString(error.response.data.data));
                    console.error(error.response.data.data);
                } else {
                    console.error('Error:', error.message);
                }
            })
        },
        deleteGroup(id, index) {
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
                                axios.delete("/devices/groups", { data: { "id": id } })
                                    .then(function (data) {
                                        ////console.log(data);
                                        that.$toaster.error('Group Deleted.')
                                        that.getGroups();
                                        that.selectGroup({});
                                        return true
                                    })
                                    .catch(function (msg) {
                                        //console.log(msg)
                                        that.$toaster.error('Something went wrong.')
                                        return false
                                    })
                            } catch (error) {
                                console.error(error);
                                that.$toaster.error('Something went wrong.')
                            }
                        }
                    }
                })

        },
    },
    mounted() {
        this.getGroups();
    }
}
</script>