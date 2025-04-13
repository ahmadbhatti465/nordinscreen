<template>
    <!-- ======= Sidebar ======= -->
    <aside id="sidebar" class="sidebar">

        <ul class="sidebar-nav" id="sidebar-nav">
            <!-- logo -->
            <li class="d-md-none d-lg-block mb-3" style="text-align: center;">

                <div class="dropdown" style="display: inline-block;">
                    <i class='bx bxs-grid' type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                    <ul class="dropdown-menu rounded-3 shadow-lg" style="width: 760px; min-width: 100%;">
                        <div class="row g-1 align-item-center m-3">
                            <div class="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <li>
                                    <a class="dropdown-item" style="text-decoration: none; padding: 0px 15px"
                                        target="_blank" href="https://app.q-play.io">
                                        <div class="d-flex justify-content-start g-3">
                                            <img class="img-fluid" style="max-height: 60px; margin: 2px"
                                                src="../assets/img/q-play.png" alt="logo" />

                                            <div class="mx-3 mt-1">
                                                <h6 style="line-height: 0.5">Q-Play - Digital
                                                    Signage</h6>
                                                <span>Design and manage your <br> digital
                                                    signage
                                                </span>
                                            </div>
                                        </div>

                                    </a>
                                </li>
                            </div>
                            <div class="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <li>
                                    <a style="text-decoration: none; padding: 0px 15px" class="dropdown-item"
                                        target="_blank" href="https://app.q-cal.net">
                                        <div class="d-flex justify-content-start g-3">
                                            <img class="img-fluid" style="max-height: 60px; margin: 2px"
                                                src="../assets/img/q-cal.png" alt="logo" />

                                            <div class="mx-3 mt-1">
                                                <h6 style="line-height: 0.5">Q-Cal - Booking</h6>
                                                <span>Streamline your office calendar
                                                </span>
                                            </div>
                                        </div>

                                    </a>
                                </li>
                            </div>
                            <div class="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <li>
                                    <a style="text-decoration: none;" class="dropdown-item" target="_blank"
                                        href="https://app.q-cal.net">
                                        <div class="d-flex justify-content-start g-3">
                                            <img class="img-fluid" style="max-height: 60px; margin: 2px"
                                                src="../assets/img/q-host.png" alt="logo" />

                                            <div class="mx-3 mt-1">
                                                <h6 style="line-height: 0.5">Q-Host - Conference Room Display</h6>
                                                <span>Ensure efficient use of office <br> meeting areas
                                                </span>
                                            </div>
                                        </div>

                                    </a>
                                </li>
                            </div>
                            <div class="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <li>
                                    <a style="text-decoration: none;" class="dropdown-item" target="_blank"
                                        href="https://app.q-cal.net">
                                        <div class="d-flex justify-content-start g-3">
                                            <img class="img-fluid" style="max-height: 60px; margin: 2px"
                                                src="../assets/img/q-visit.png" alt="logo" />

                                            <div class="mx-3 mt-1">
                                                <h6 style="line-height: 0.5">Q-Visit - Visitor Management</h6>
                                                <span>Reducing confusion and wait times
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </div>
                        </div>
                        <hr style="color: #D9D9D9" class="mx-4">
                        <div class="d-flex gap-3 mx-4">
                            <div>
                                <a style="text-decoration: none; background-color: #F8FAF1"
                                    class="d-flex align-items-center text-black p-2 rounded-2"
                                    href="https://nordicscreen.com" target="_blank">
                                    <img class="img-fluid mx-2" style="max-height: 25px; margin: 2px"
                                        src="../assets/img/nordicScreen.png" alt="logo" />
                                    NordicScreen.com
                                </a>
                            </div>
                            <div>
                                <a style="text-decoration: none; background-color: #F8FAF1"
                                    class="d-flex align-items-center text-black p-2 rounded-2"
                                    href="https://portal.nordicscreen.com" target="_blank">
                                    <img class="img-fluid mx-2" style="max-height: 25px; margin: 2px"
                                        src="../assets/img/nordicScreen.png" alt="logo" />
                                    Portal
                                </a>
                            </div>
                        </div>
                    </ul>

                </div>

                <router-link :to="'/user/dashboard' + (userId ? '/' + userId : '')" class="nav-link"
                    @click.native="closeSidebar" style="display: inline-block;">
                    <img class="img-fluid" style="max-height: 40px; margin: 0px" src="../assets/img/logo.png"
                        alt="logo" />
                </router-link>
            </li>


            <li>
                <h5 v-if="accountType === 'admin' && selectedUserName">{{ selectedUserName }}</h5>
                <template v-if="accountType === 'admin'">
                    <SearchUserDropdown @change-user="changeUser" :selectUserId="userId" ></SearchUserDropdown>
                </template>
            </li>

            <template>
                <li class="nav-item">
                    <router-link :to="'/user/dashboard' + (userId ? '/' + userId : '')" class="nav-link"
                        @click.native="closeSidebar">
                        <i class="bx bxs-dashboard"></i>
                        <span>Overview</span>
                    </router-link>
                </li>
                <!-- <li class="nav-item">
                <router-link :to="'/user/template' + (userId ? '/' + userId : '')" class="nav-link" @click.native="closeSidebar">
                    <i class="bx bxs-devices"></i>
                    <span>Template</span>
                </router-link>
            </li> -->

                <li class="nav-item">
                    <router-link :to="'/user/devices' + (userId ? '/' + userId : '')" class="nav-link"
                        @click.native="closeSidebar">
                        <i class="bx bx-plug"></i>
                        <span>Devices</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="'/user/energy' + (userId ? '/' + userId : '')" class="nav-link"
                        @click.native="closeSidebar">
                        <i class="bx bxs-zap"></i>
                        <span>Energy</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="'/user/schedule' + (userId ? '/' + userId : '')" class="nav-link"
                        @click.native="closeSidebar">
                        <i class="bx bx-calendar"></i>
                        <span>Schedule</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="'/user/widgets' + (userId ? '/' + userId : '')" class="nav-link"
                        @click.native="closeSidebar">
                        <i class="bx bxs-widget"></i>
                        <span>Widgets</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="'/user/logs' + (userId ? '/' + userId : '')" class="nav-link"
                        @click.native="closeSidebar">
                        <i class="bx bx-message-square-detail"></i>
                        <span>Logs</span>
                    </router-link>
                </li>
                <!-- <li class="nav-item">
                    <a class="nav-link" href="/" @click="logout">
                        <i class="bx bx-log-out"></i>
                        <span>Logout</span>
                    </a>
                </li> -->
                <!-- End Profile Page Nav -->
                <!-- <li class="nav-item">
                <router-link :to="'/user/settings' + (userId ? '/' + userId : '')" class="nav-link"
                    @click.native="closeSidebar">
                    <i class="bx bxs-cog"></i>
                    <span>Settings</span>
                </router-link>
            </li> -->
            </template>
            <!-- <template v-if="accountType === 'admin'">
                <li class="nav-item">
                    <router-link :to="'/admin/dashboard' + (userId ? '/' + userId : '')" class="nav-link"
                        @click.native="closeSidebar">
                        <i class="bx bxs-dashboard"></i>
                        <span>Overview</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="'/admin/devices' + (userId ? '/' + userId : '')" class="nav-link"
                        @click.native="closeSidebar">
                        <i class="bx bx-plug"></i>
                        <span>Devices</span>
                    </router-link>
                </li>
            </template> -->
        </ul>
        <ul class="sidebar-nav" id="sidebar-nav" style="position: absolute; bottom: 0px">
            <!-- <li class="nav-item">
                <router-link :to="'/user/user' + (userId ? '/' + userId : '')"
                    class="nav-link collapsed d-flex align-items-center pe-0" @click.native="closeSidebar">
                    <img src="../assets/img/messages-2.jpg" alt="Profile" style="height: 30px" class="rounded-circle" />
                    <span class="d-none d-md-block ps-2">K. Anderson</span>
                </router-link>
            </li> -->
            <!-- <li class="nav-item">
                <a class="nav-link" href="/" @click="logout">
                    <i class="bx bx-log-out"></i>
                    <span>Logout</span>
                </a>
            </li> -->
        </ul>

    </aside><!-- End Sidebar-->
</template>

<script>
import { EventBus } from '../events/eventBus.js';
import SearchUserDropdown from '../tiny-components/SearchUserDropdown.vue'


export default {
    name: "CommonSidebar",
    props: ['userId'],
    components: {
        SearchUserDropdown
    },
    data() {
        return {
            accountType: 'user',
            hideBackBtn: false,
            currentPage: "",
            previousPath: "/",
            syncOption: "new",
            synchedProducts: 0,
        };
    },
    computed: {
        selectedUserId() {
            return this.$store.getters.adminSelectedUserId
        },
        selectedUserName() {
            return this.$store.getters.adminSelectedUserName
        },
        
    },
    methods: {
        changeUser(user) {
            if (this.selectedUserId == user.id) return;
            if (user.id == null) return;

            this.$store.commit('set_adminSelectedUserId', { id: user.id });
            this.$store.commit('set_adminSelectedUserName', { name: user.name });

            //EventBus.$emit('clearSocket');
            //EventBus.$emit('initSocket', null, user.id);
            EventBus.$emit('changeUserSocket', user.id);
            //this.getDevices(1);
        },
        goPrevious() {
            if (this.previousPath) {
                this.$router.push(this.previousPath);
            } else {
                this.$router.push("/");
            }
        },
        closeSidebar(clear_userToken = null) {
            //console.log("closeSidebar")
            if (clear_userToken == 'clear_userToken') {
                this.$store.commit('clear_userToken', {});
                this.$store.commit('clear_devicesData', {});
                this.$store.commit('clear_userData', {});
                EventBus.$emit('clearSocket');
            }
            let body = document.getElementsByTagName("body")[0]
            if (body.clientWidth < 800) {
                body.classList.remove('toggle-sidebar')
            }
        },
        logout() {
            this.$store.commit('clear_userToken', {});
            this.$store.commit('clear_devicesData', {});
            this.$store.commit('clear_userData', {});
            EventBus.$emit('clearSocket');
            window.location.href = '/';
        }
    },
    created() { },
    mounted() {
        let currentRoute = this.$router.currentRoute;
        // console.log('Current Route: ')
        // console.log(currentRoute)
        this.currentPage = currentRoute.name;
        let str = currentRoute.path;
        let prev = str.substring(0, str.lastIndexOf("/"));
        this.previousPath = prev;
        this.hideBackBtn = false;
        // console.log('User Data Exists:')
        // console.log(this.previousPath)
        if (this.$local.userData) {
            // console.log(this.$local.userData);
            if (this.$local.userData.accountType === "admin") {
                this.previousPath = "/admin/dashboard-page";
            } else {
                this.hideBackBtn = true;
            }
        } else {
            this.$router.push("/");
        }

        //console.log(this.previousPath);
        //console.log("CommonSideBar: ")
        //console.log(this.$store.state.User.user.type)
        this.accountType = this.$store.state.User.user.type;

        //console.log("Account Type", this.accountType);
        //console.log("testing-Commonsidebar-userid", this.userId)
        //this.changeUser({id: this.userId})

       
    },
};
</script>

<style scoped>
.back-btn {
    color: white;
    transition: transform 0.2s;
    transform: scale(1);
}

.back-btn:hover {
    transition: transform 0.2s;
    transform: scale(1.2);
}
</style>