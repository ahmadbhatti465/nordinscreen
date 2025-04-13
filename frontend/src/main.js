import Vue from 'vue'
import axios from 'axios'
import { BootstrapVue, VBPopover, BCardGroup, BCard, BCardText } from 'bootstrap-vue'
import Toaster from 'v-toaster'
import SocketIO from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import VueApexCharts from 'vue-apexcharts'


import App from './App'
import router from './router'
import store from './store'
import { EventBus } from './events/eventBus';

import 'v-toaster/dist/v-toaster.css'
import VueConfirmDialog from 'vue-confirm-dialog'

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)



Vue.prototype.$socket = "";

// let server = "http://31.222.235.214:8090";
// let wsServer = "http://31.222.235.214:8090";
let server = "https://app.q-power.io",
    wsServer = "https://app.q-power.io";

if (process.env.NODE_ENV === 'development') {
    server = "https://nordicscreen.logicnextech.com";
    wsServer = "https://nordicscreen.logicnextech.com";
}

Vue.prototype.$serverUrl = server;

Vue.prototype.$socket = {};

axios.defaults.baseURL = server;
// Add a request interceptor to attach the Bearer token
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => {
        // This block handles successful responses
        return response;
    },
    error => {
        console.log("ahmad::")       // This block handles errors in the response
        if (error.response && error.response.status == 401) {
            localStorage.removeItem('userToken'); // Remove token from localStorage
            window.location.href = '/login';
        } else if (error.request) {
            // The request was made but no response was received
            console.log('No Response Received:', error.request);
        } else {
            // Something else triggered the error
            console.log('Error Message:', error.message);
        }

        // Optionally return a rejected promise to propagate the error further
        return Promise.reject(error);
    }
);


Vue.prototype.$FormToJson = function (formData) {
    const jsonObject = {};
    formData.forEach((value, key) => {
        jsonObject[key] = value;
    });
    return jsonObject;
};
Vue.prototype.$capitalizedString = function (inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}
Vue.prototype.$local = {
    appType: 'web',
    userData: {},
}



window.jQuery = window.$ = require('jquery/dist/jquery.min')
//Vue.prototype.$localDatabase = require('./api/index')

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Toaster, { timeout: 3000 })
Vue.use(VueApexCharts)

//library.add(faCoffee, faArrowCircleLeft, faTrash, faPencilAlt, faCheck, faTimes, faEllipsisV, faSpinner, faToggleOff, faToggleOn, faFilter)

//Vue.component('font-awesome-icon', FontAwesomeIcon)

/**
 * Bootstrap directives
 */
Vue.directive('b-popover', VBPopover);
Vue.component('b-card-group', BCardGroup);
Vue.component('b-card', BCard);
Vue.component('b-card-text', BCardText);
Vue.component('apexchart', VueApexCharts)

/* eslint-disable no-new */
var vm = new Vue({
    components: { App },
    router,
    store,
    //BootstrapVue,
    template: '<App/>',
    created() {
        this.$store.dispatch('initializeUserToken');
        let token = localStorage.getItem('userToken');
        let type = localStorage.getItem('userType');
        let fullname = localStorage.getItem('userFullname');
        let useToken = this.$store.state.User.user.token || token;
        if (useToken && type) {
            this.$store.dispatch('setUserToken', useToken);
            this.$store.dispatch('setUserType', type);
            this.$store.dispatch('setUserFullname', fullname);

            this.initializeSocket(useToken);
        }

        // Listen for clearSocket event
        EventBus.$on('clearSocket', this.clearSocket);
        EventBus.$on('initSocket', this.initializeSocket);
        EventBus.$on('changeUserSocket', this.changeUserSocket);
    },
    mounted() {

    },
    beforeDestroy() {
        this.clearSocket();
        EventBus.$off('clearSocket', this.clearSocket);
        EventBus.$off('initSocket', this.initializeSocket);
        EventBus.$off('changeUserSocket', this.changeUserSocket);
    },
    methods: {
        initializeSocket(useToken = null, userId = null) {
            //console.log("initializeSocket")
            //console.log(useToken, userId)
            if (this.socketInstance) {
                this.clearSocket();
            }

            this.socketInstance = new VueSocketIO({
                connection: SocketIO(wsServer, {
                    query: `token=${useToken ? useToken : this.$store.state.User.user.token}&userId=${userId ? userId : this.$store.state.User.user._id}`,
                }),
                vuex: {
                    store,
                    actionPrefix: 'SOCKET_',
                    mutationPrefix: 'SOCKET_'
                }
            });
            Vue.use(this.socketInstance);
        },
        clearSocket() {
            console.log("clearSocket")
            if (this.socketInstance) {
                this.socketInstance.io.disconnect();
                this.socketInstance = null;
            }
        },
        changeUserSocket(userId) {
            this.clearSocket();
            //wait for socket to clear
            setTimeout(() => {
                this.initializeSocket(null, userId);
            }, 1000);

        }
    }
});
global.vm = vm;
vm.$mount('#app')