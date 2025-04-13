import Vue from 'vue'
import axios from 'axios'

const defaultState = {
  totalStats: {},
  topDevicesStats: [],
  dateFormat: 'YYYY-MM-DD HH:mm',
  types: [{
    name: 'Shelly Plug S',
    channels: 1
  },
  {
    name: 'Shelly Pro 1PM',
    channels: 1
  },
  {
    name: 'Shelly 1PM Mini',
    channels: 1
  },
  {
    name: 'Shelly Pro 2PM',
    channels: 2
  },
  {
    name: 'Shelly Plus 2PM',
    channels: 2
  },
  {
    name: 'Shelly Pro 4PM',
    channels: 4
  },],
};

const actions = {
};

const mutations = {
  SOCKET_devicesStats: (state, data) => {
    //console.log("SOCKET_devicesStats")
    //console.log(data)
    state.totalStats = data.totalStats;
    state.topDevicesStats = data.topDevicesStats;
    state.dateFormat = data.dateFormat;

    //localStorage.setItem('stats', JSON.stringify(data.totalStats));
    //localStorage.setItem('topDevicesStats', JSON.stringify(data.topDevicesStats));
  },
  clear_devicesData: (state) => {
    state.totalStats = {};
    state.topDevicesStats = [];
    state.dateFormat = 'YYYY-MM-DD HH:mm';
  }
};

const getters = {
  totalStats: state => state.totalStats,
  deviceById: state => id => state.topDevicesStat[0],
  dateFormat: state => state.dateFormat,
  types: state => state.types
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
