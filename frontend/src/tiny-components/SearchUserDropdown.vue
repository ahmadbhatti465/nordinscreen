<template>
    <Dropdown class="" :options="options" v-on:selected="validateSelection" v-on:filter="getDropdownValues"
        :disabled="false" placeholder="Search a User">
    </Dropdown>
</template>

<script>
import Dropdown from './Dropdown.vue';
import axios from 'axios'
export default {
    name: "SearchUserDropdown",
    props: ['selectedUserId', 'selectUserId'],
    data() {
        return {
            options: [],
            users: [],
            selectedUser: { name: null, id: null },
        }
    },
    components: {
        Dropdown
    },
    methods: {
        getUsers() {
            let that = this;
            this.$emit('set-loading', true);
            axios.get("/user/users").then(function (data) {
                //that.users = data.data;
                that.options = data.data;

                console.log("options", data.data);

                // Assuming selectedUser  is defined somewhere in your code
                const selectedUser  = that.selectedUser

                data.data.forEach(user => {
                    if (user === selectedUser ) { // Check if the user is the selected user
                    console.log("Selected User:", user); // Print the selected user
                    that.$emit('change-user', user); // Emit the change-user event with the selected user
                }
                });
            

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
            this.selectedUser = selection;
            console.log("test-selecteduser", this.selectedUser)
            //this.schedule.name = selection.name;
            this.$emit('change-user', selection);
        },
        getDropdownValues(keyword) {
            //console.log("You could refresh options by querying the API with " + keyword);
        }
    },
    mounted() {
        this.getUsers();

    }
}
</script>