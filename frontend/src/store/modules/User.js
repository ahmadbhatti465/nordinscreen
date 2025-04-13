import Vue from 'vue'
import axios from 'axios';

const defaultState = {
    user: {},
    adminSelectedUserId: '',
    adminSelectedUserName: ''
};

const actions = {
    initializeUserToken({ commit }) {
        //console.log("I'm action and setting token: " + localStorage.getItem('userToken'))
        // const storedToken = localStorage.getItem('userToken');
        // if (storedToken) {
        //     commit('set_userToken', {token: storedToken});
        //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // }
    },
    setUserToken({ commit }, token) {
        commit('set_userToken', {token: token});
    },
    setUserType({ commit }, type) {
        commit('set_userType', {type: type});
    },
    setUserFullname({ commit }, fullname) {
        commit('set_userFullname', {fullname: fullname});
    },
    setAdminSelectedUserId({ commit }, id) {
        commit('set_adminSelectedUserId', {id});
    },
    setAdminSelectedUser({ commit }, name) {
        commit('set_adminSelectedUserName', {name});
    }
};

const mutations = {
    set_userToken: (state, userInput) => {
        let { token } = userInput
        if (token && token != "") {
            //console.log("I'm mutation and setting token: " + token)
            state.user.token = token
            localStorage.setItem('userToken', token);
            //console.log("I'm mutation and setting token: " + localStorage.getItem('userToken'))
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    },
    set_userType: (state, userInput) => {
        let { type } = userInput
        if (type && type != "") {
            //console.log("I'm mutation and setting type: " + type)
            state.user.type = type
            localStorage.setItem('userType', type);
        } else{
            state.user.type = 'user'
            localStorage.setItem('userType', 'user');
        }
    },
    set_userFullname: (state, userInput) => {
        let { fullname } = userInput
        if (fullname && fullname != "") {
            state.user.fullname = fullname
            localStorage.setItem('userFullname', fullname);
        } else{
            state.user.fullname = ''
            localStorage.removeItem('userFullname');
        }
    },
    clear_userToken: (state) => {
        //console.log("I'm mutation and clearing token")
        state.user = {}
        localStorage.removeItem('userToken');
        delete axios.defaults.headers.common['Authorization'];
    },
    clear_userData: (state) => {
        state.user = {}
    },
    set_adminSelectedUserId: (state, userInput) => {
        let { id } = userInput
        if (id && id != "") {
            state.adminSelectedUserId = id
            axios.defaults.headers.common['userId'] = `${id}`;
        }
    },
    set_adminSelectedUserName: (state, userInput) => {
        let { name } = userInput
        if (name && name != "") {
            state.adminSelectedUserName = name
        }
    }
};

const getters = {
    user: state => state.user,
    adminSelectedUserId: state => state.adminSelectedUserId,
    adminSelectedUserName: state => state.adminSelectedUserName
};

export default {
    state: defaultState,
    getters,
    actions,
    mutations,
};
