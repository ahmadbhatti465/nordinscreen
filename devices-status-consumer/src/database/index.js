module.exports = {
    databaseConnection: require('./connection'),
    DevicesRepository: require('./repository/devices-repository'),
    DevicesStatusRepository: require('./repository/devices-status-repository')
}