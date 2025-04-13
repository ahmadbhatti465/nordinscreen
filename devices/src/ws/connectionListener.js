const DevicesListener = require("./devicesListener");

module.exports = class ConnectionListener {

    constructor() {
        console.log("started class connectionlistener")
        this.connected = this.connected.bind(this);
        this.disconnected = this.disconnected.bind(this);  // Bind the disconnected method
        this.myInterval = null;  // Initialize as null
    }

    connected(socket) {
        // console.log("Socket Connected!!");
        //socket.emit('connected', "congrats you are connected after authentication");


        let devicesListener = new DevicesListener();

        devicesListener.devicesStats(socket);
        this.myInterval = setInterval(() => {
            devicesListener.devicesStats(socket);
        }, 10000)

        

        setTimeout(() => {
            clearInterval(this.myInterval)
            socket.disconnect()
        }, 1000*60*60*12)//after 12 hours auto clear connection

        socket.on('hiserver', function (something) {
            console.log("Somebody said Hi");
        });

        //set filters
        socket.on('filter', function (filter) {
            //filter contains {type: 'powerConsumption', value: 'last24h'}
            if (!socket.filter) {
                socket.filter = {};
            }
            socket.filter[filter.type] = filter.value;
            devicesListener.devicesStats(socket);
        })

        socket.on('error', this.disconnected);
        socket.on('disconnect', this.disconnected);
    }

    async disconnected(err) {
        console.log("disconnected!!!!!")
        console.log(err);
        //await Factory.redisClient.del(`${this.USER._id}`, this.id);
        //console.log(this.myInterval);
        clearInterval(this.myInterval);
        // Factory.redisClient.srem([`${this.USER._id}`, this.id], (err, reply) => {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
    }
}