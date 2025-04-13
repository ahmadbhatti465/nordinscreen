<template>
    <Dropdown class="" style="width: 100%;" :options="options" v-on:selected="validateSelection"
        v-on:filter="getDropdownValues" :disabled="false" placeholder="Select a group">
    </Dropdown>
</template>

<script>
    import Dropdown from './Dropdown.vue';
    import axios from 'axios'
    export default {
        name: "SearchGroupDropdown",
        props: ['selectedGroupId', 'update'],
        data() {
            return {
                options: [],
                groups: [],
                selectedGroup: { name: null, id: null },
            }
        },
        components: {
            Dropdown
        },
        watch: {
            update: function () {
                this.getGroups();
            }
        },
        methods: {
            getGroups() {
                let that = this;
                this.$emit('set-loading', true);
                axios.get("/devices/groups").then(function (data) {
                    //that.users = data.data;
                    that.options = data.data.groups;

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
                this.selectedGroup = selection;
                //this.schedule.name = selection.name;
                this.$emit('change-group', selection);
            },
            getDropdownValues(keyword) {
                //console.log("You could refresh options by querying the API with " + keyword);
            }
        },
        mounted() {
            this.getGroups();
        }
    }
</script>