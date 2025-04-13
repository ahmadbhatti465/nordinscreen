const DevicesService = require("../services/devices-service");
const DevicesStatusService = require("../services/devices-status-service");
const EnergyService = require("../services/energy-service");

const service = new DevicesService();
const statusService = new DevicesStatusService();
const energyService = new EnergyService();

module.exports = class DevicesListener {

    constructor() {
    }

    static error(socket, event, message) {
        socket.emit(event, {
            success: false,
            message: message
        });
    }

    async devicesStats(socket) {
        try {
            //console.log("socket.user and filter", socket.user)
            //let userId = socket.user.type == 'admin' ? null : socket.user._id;
            let userId = socket.user._id;
            if (userId) {
                let stats = await service.getAllDevicesStats(userId);
                stats.totalPowerConsumption = await energyService.getPowerConsumption({userId, dateRange: this.getDateRange( socket.filter && socket.filter['powerConsumption']? socket.filter['powerConsumption'] : 'last24h')});
                stats.totalPowerSaving = await energyService.getPowerSaving({userId, dateRange: this.getDateRange( socket.filter && socket.filter['powerSaving']? socket.filter['powerSaving'] : 'last24h')});
                stats.co2emissionReduction = await energyService.getCO2EmissionReduction({userId, dateRange: this.getDateRange( socket.filter && socket.filter['co2EmissionReduction']? socket.filter['co2EmissionReduction'] : 'last24h')});
                //stats.powerSaving
                //stats.co2emissionReduction
                //console.log(stats)
                socket.emit('devicesStats', {
                    success: true,
                    totalStats: stats,
                    //topDevicesStats: XDevicesStats
                });
            } else {
                socket.emit('devicesStats', {
                    success: true,
                    totalStats: {},
                });
            }
            return;
        } catch (error) {
            socket.emit('devicesStats', {
                success: true,
                totalStats: {},
            });
            // console.log("ALIERROR: ")
            // console.log(error);
            return;
        }
    }

    // Function to get date range based on the filter
    getDateRange(filter) {
        const now = new Date();
        let startDate;
        let endDate = new Date(); // Default to 'now' for endDate

        switch (filter) {
            case 'last24h':
                startDate = new Date(now);
                startDate.setHours(now.getHours() - 24);
                break;

            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;

            case 'lastMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of the previous month
                break;

            case 'last3Month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                break;

            case 'last6Month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                break;

            case 'last12Month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
                break;

            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1); // January 1st of this year
                break;

            case 'lastYear':
                startDate = new Date(now.getFullYear() - 1, 0, 1); // January 1st of last year
                endDate = new Date(now.getFullYear(), 0, 0); // December 31st of last year
                break;

            default:
                throw new Error('Invalid filter selection');
        }

        return { startDate, endDate };
    };

}