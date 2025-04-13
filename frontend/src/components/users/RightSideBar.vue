es<template>
    <div class="sidebar-right ms-3 p-4" style="background: white; border-radius: 5px;">
        <h3>Devices Stats</h3>
        <div class="row">
            <div class="col-12 d-none">
                <div class="card text-center p-3" style="background: var(--primary-color);">
                    <span class="fs-1" style="color: var(--secondary-color-1)"><i class="bx bxs-bolt-circle"></i></span>
                    <span class="fs-3">{{ isNaN(stats.totalPowerConsumption / 1000) ? 0 :
                        (stats.totalPowerConsumption / 1000).toFixed(2) }} kWh</span>
                    <span class="fs-5">Total Consumption</span>
                </div>
            </div>
            <div class="col-4">
                <div class="card text-center p-3" style="background: var(--primary-color);">
                    <span class="fs-3">{{ stats.totalDevices >= 0 ? stats.totalDevices : 0 }}</span>
                    <span style="font-size: 12px;">Total Devices</span>
                </div>
            </div>
            <div class="col-4">
                <div class="card text-center p-3" style="background: var(--primary-color);">
                    <span class="fs-3">{{ stats.totalIsOnline >= 0 ?
                        stats.totalIsOnline : 0 }}</span>
                    <span style="font-size: 12px;">Devices Online</span>
                </div>
            </div>
            <div class="col-4">
                <div class="card text-center p-3" style="background: var(--primary-color);">
                    <span class="fs-3">{{ (stats.totalDevices -
                        stats.totalIsOnline) >= 0 ? (stats.totalDevices - stats.totalIsOnline) : 0 }}</span>
                    <span style="font-size: 12px;">Devices Offline</span>
                </div>
            </div>
            <div class="col-4">
                <div class="card text-center p-3" style="background: var(--primary-color);">
                    <span class="fs-3">{{ stats.totalIsTurnedOn >= 0 ? stats.totalIsTurnedOn : 0 }}</span>
                    <span style="font-size: 12px;">Devices ON</span>
                </div>
            </div>
            <div class="col-4">
                <div class="card text-center p-3" style="background: var(--primary-color);">
                    <span class="fs-3">{{ isNaN(stats.totalDevices - stats.totalIsTurnedOn) ? 0 : stats.totalDevices -
                        stats.totalIsTurnedOn
                        }}</span>
                    <span style="font-size: 12px;">Devices OFF</span>
                </div>
            </div>


        </div>

        <template v-if="totalPowerSaving > 0">
            <h3>Power Saving</h3>
            <hr />
            <div class="row">
                <div class="col-12">
                    <div class="card text-center p-3 border shadow">
                        <span class="fs-1" style="color: var(--secondary-color-1)"><i
                                class="bx bxs-tree-alt"></i></span>
                        <span class="fs-3">{{ isNaN(totalPowerSaving) ? 0 :
                            totalPowerSaving }} kWh</span>
                        <span class="fs-5">Total Saving</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: "RightSideBar",
    props: ['userId', 'totalPowerSaving'],
    data() {
        return {
            chart: null,

        }
    },
    watch: {
        topDevicesStats(newVal) {
            //update with new data
            // if (this.$store.state.Devices.topDevicesStats.length > 0) {
            //     this.initPieChart(this.$store.state.Devices.topDevicesStats)
            // }
        },
        totalPowerSaving(newVal) {
            //console.log("Rightsidebar: ", newVal)
        }
    },
    computed: {
        stats() {
            return this.$store.state.Devices.totalStats
        },

        topDevicesStats() {
            return this.$store.state.Devices.topDevicesStats
        }
    },
    methods: {
    },
    mounted() {
        console.log("rightsidebar", this.userId, this.totalPowerSaving)
    }
}
</script>

<style></style>
