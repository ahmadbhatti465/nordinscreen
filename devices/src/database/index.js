module.exports = {
    databaseConnection: require('./connection'),
    DevicesRepository: require('./repository/devices-repository'),
    DevicesStatusRepository: require('./repository/devices-status-respository'),
    GroupsRepository: require('./repository/groups-repository'),
    EnergyRepository: require('./repository/energy-repository'),
}