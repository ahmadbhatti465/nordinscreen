describe('powerSavingHourly', () => {

  //voltage greater than 0 minutes 56
  /* it('should correctly calculate power consumption for devices with voltage greater than 0', async () => {
    const mockDevicesStatusModel = {
      find: jest.fn().mockResolvedValue([{
        "_id": "668690020aa6090013fbf404",
        "isOnline": true,
        "totalPowerConsumption": 62766.805,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:05:22.753Z",
        "updatedAt": "2024-07-04T12:05:22.753Z",
        "__v": 0
      },
      {
        "_id": "6686912e0aa6090013fbf42b",
        "isOnline": true,
        "totalPowerConsumption": 62780.867,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:10:22.701Z",
        "updatedAt": "2024-07-04T12:10:22.701Z",
        "__v": 0
      },
      {
        "_id": "66869184d6de3b001274286e",
        "isOnline": true,
        "totalPowerConsumption": 62783.68,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:11:48.763Z",
        "updatedAt": "2024-07-04T12:11:48.763Z",
        "__v": 0
      },
      {
        "_id": "668692b0d6de3b0012742895",
        "isOnline": true,
        "totalPowerConsumption": 62797.742,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:16:48.661Z",
        "updatedAt": "2024-07-04T12:16:48.661Z",
        "__v": 0
      },
      {
        "_id": "668693dcd6de3b00127428bc",
        "isOnline": true,
        "totalPowerConsumption": 62811.805,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:21:48.671Z",
        "updatedAt": "2024-07-04T12:21:48.671Z",
        "__v": 0
      },
      {
        "_id": "66869508d6de3b00127428e3",
        "isOnline": true,
        "totalPowerConsumption": 62825.867,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:26:48.643Z",
        "updatedAt": "2024-07-04T12:26:48.643Z",
        "__v": 0
      },
      {
        "_id": "66869634d6de3b001274290a",
        "isOnline": true,
        "totalPowerConsumption": 62839.93,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:31:48.772Z",
        "updatedAt": "2024-07-04T12:31:48.772Z",
        "__v": 0
      },
      {
        "_id": "66869760d6de3b0012742931",
        "isOnline": true,
        "totalPowerConsumption": 62853.992,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:36:48.642Z",
        "updatedAt": "2024-07-04T12:36:48.642Z",
        "__v": 0
      },
      {
        "_id": "6686988cd6de3b0012742958",
        "isOnline": true,
        "totalPowerConsumption": 62868.055,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:41:48.679Z",
        "updatedAt": "2024-07-04T12:41:48.679Z",
        "__v": 0
      },
      {
        "_id": "668699b8d6de3b001274297f",
        "isOnline": true,
        "totalPowerConsumption": 62882.117,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:46:48.650Z",
        "updatedAt": "2024-07-04T12:46:48.650Z",
        "__v": 0
      },
      {
        "_id": "66869ae4d6de3b00127429a6",
        "isOnline": true,
        "totalPowerConsumption": 62896.18,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:51:48.689Z",
        "updatedAt": "2024-07-04T12:51:48.690Z",
        "__v": 0
      },
      {
        "_id": "66869c10d6de3b00127429cd",
        "isOnline": true,
        "totalPowerConsumption": 62910.242,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T12:56:48.674Z",
        "updatedAt": "2024-07-04T12:56:48.674Z",
        "__v": 0
      },
      ])
    };

    let device = {
      _id: "664c71e6d321f60013414fc7",
      userId: "664c70d30c97c400135fd192",
      name: "test device",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "deviceType",
    }
    let statuses = await mockDevicesStatusModel.find();


    const powerSavingOfDevices = statuses.reduce((acc, status) => {
      const deviceId = status.deviceId;
      const createdAt = status.createdAt;
      const voltage = status.voltage;
      const powerConsumption = status.powerConsumption;
      if (!acc[deviceId]) {
        acc[deviceId] = { deviceId, minutesVoltageZero: 0, minutesVoltageGreaterThanZero: 0, averageUsage: [], powerConsumption: 0, prev: { createdAt, voltage, powerConsumption } };
      }
      if (voltage > 0 && powerConsumption > 0) {
        const prev = acc[deviceId].prev;
        const current = { createdAt, voltage, powerConsumption };
        let timeDiffMinutes = (new Date(current.createdAt).getTime() - new Date(prev.createdAt).getTime()) / (1000 * 60); // Convert milliseconds to minutes
        //console.log("timeDiffMinutes", timeDiffMinutes)
        timeDiffMinutes = timeDiffMinutes <= 0 ? 5 : timeDiffMinutes;

        if (prev.voltage === 0) {
          acc[deviceId].minutesVoltageZero += Math.round(timeDiffMinutes);
        } else if (prev.voltage > 0) {
          acc[deviceId].minutesVoltageGreaterThanZero += Math.round(timeDiffMinutes);
          acc[deviceId].averageUsage.push(prev.powerConsumption);
        }

        acc[deviceId].powerConsumption = Math.round(acc[deviceId].averageUsage.reduce((a, b) => a + b, 0) / acc[deviceId].averageUsage.length);

        acc[deviceId].prev = current;

      }

      return acc;
    }, {});

    let powerSavingOfDevice = powerSavingOfDevices[device._id];

    console.log(powerSavingOfDevice);

    let consumed = 0, saved = 0, powerConsumption = 0;
    if (powerSavingOfDevice) {

      consumed = powerSavingOfDevice.minutesVoltageGreaterThanZero > 0 ? powerSavingOfDevice.powerConsumption * (powerSavingOfDevice.minutesVoltageGreaterThanZero / 60) : 0;
      //saved = powerSavingOfDevice.minutesVoltageZero > 0 ? powerSavingOfDevice.powerConsumption * (powerSavingOfDevice.minutesVoltageZero / 60) : 0;
      saved = 60 - powerSavingOfDevice.minutesVoltageGreaterThanZero > 0 ? powerSavingOfDevice.powerConsumption * (60 - powerSavingOfDevice.minutesVoltageGreaterThanZero) / 60 : 0;
      powerConsumption = powerSavingOfDevice.powerConsumption;

      if (consumed <= 0 && saved <= 0 && powerConsumption <= 0) {
        //find last Energy that was saved 
        //where consumed > 0 
        //meaning: we get its powerConsumption and that's what is saved energy

        let energy = await service.getLastConsumedEnergy({ deviceId: device._id.toString() });
        if (energy) {
          consumed = 0;
          saved = energy.powerConsumption; //100watt * 1 hour = 100wh
          powerConsumption = 0
        }
      }
    } else {
      let energy = await service.getLastConsumedEnergy({ deviceId: device._id.toString() });
      if (energy) {
        consumed = 0;
        saved = energy.powerConsumption; //100watt * 1 hour = 100wh
        powerConsumption = 0
      }
    }

    let res = {
      userId: device.userId,
      deviceId: device._id.toString(),
      deviceName: device.name,
      consumed: consumed,
      saved: saved,
      powerConsumption: powerConsumption
    }

    console.log(res);

    expect(res).toEqual({
      device1: expect.objectContaining({
        deviceId: '664c71e6d321f60013414fc7',
        minutesVoltageZero: expect.any(Number),
        minutesVoltageGreaterThanZero: expect.any(Number),
        powerConsumption: expect.any(Number)
      })
    })
  }); */

  //voltage greater than 0 minutes 60
  /* it('should correctly calculate power consumption for devices with voltage greater than 0', async () => {
    const mockDevicesStatusModel = {
      find: jest.fn().mockResolvedValue([{
        "_id": {
          "$oid": "66869d3cd6de3b00127429f4"
        },
        "isOnline": true,
        "totalPowerConsumption": 62924.305,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:01:48.698Z",
        "updatedAt": "2024-07-04T13:01:48.698Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "66869e68d6de3b0012742a1b"
        },
        "isOnline": true,
        "totalPowerConsumption": 62938.367,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:06:48.682Z",
        "updatedAt": "2024-07-04T13:06:48.682Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "66869f94d6de3b0012742a42"
        },
        "isOnline": true,
        "totalPowerConsumption": 62952.43,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:11:48.719Z",
        "updatedAt": "2024-07-04T13:11:48.719Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686a0c0d6de3b0012742a69"
        },
        "isOnline": true,
        "totalPowerConsumption": 62966.492,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:16:48.691Z",
        "updatedAt": "2024-07-04T13:16:48.691Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686a1ecd6de3b0012742a90"
        },
        "isOnline": true,
        "totalPowerConsumption": 62980.555,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:21:48.706Z",
        "updatedAt": "2024-07-04T13:21:48.706Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686a318d6de3b0012742ab7"
        },
        "isOnline": true,
        "totalPowerConsumption": 62994.617,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:26:48.802Z",
        "updatedAt": "2024-07-04T13:26:48.802Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686a444d6de3b0012742ade"
        },
        "isOnline": true,
        "totalPowerConsumption": 63008.68,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:31:48.757Z",
        "updatedAt": "2024-07-04T13:31:48.757Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686a570d6de3b0012742b05"
        },
        "isOnline": true,
        "totalPowerConsumption": 63022.742,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:36:48.708Z",
        "updatedAt": "2024-07-04T13:36:48.708Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686a69cd6de3b0012742b2c"
        },
        "isOnline": true,
        "totalPowerConsumption": 63036.805,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:41:48.745Z",
        "updatedAt": "2024-07-04T13:41:48.745Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686a7c8d6de3b0012742b53"
        },
        "isOnline": true,
        "totalPowerConsumption": 63050.867,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:46:48.730Z",
        "updatedAt": "2024-07-04T13:46:48.730Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686a8f4d6de3b0012742b7a"
        },
        "isOnline": true,
        "totalPowerConsumption": 63064.93,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:51:48.736Z",
        "updatedAt": "2024-07-04T13:51:48.736Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686aa20d6de3b0012742ba1"
        },
        "isOnline": true,
        "totalPowerConsumption": 63078.992,
        "powerConsumption": 178.7,
        "powerUsage": 178.7,
        "voltage": 218.8,
        "current": 0.766,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T13:56:48.735Z",
        "updatedAt": "2024-07-04T13:56:48.735Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686aaf4d6de3b0012742bd0"
        },
        "isOnline": false,
        "totalPowerConsumption": 63087.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:00:20.414Z",
        "updatedAt": "2024-07-04T14:00:20.414Z",
        "__v": 0
      }])
    };
    
    let device = {
      _id: "664c71e6d321f60013414fc7",
      userId: "664c70d30c97c400135fd192",
      name: "test device",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "deviceType",
    }
    let statuses = await mockDevicesStatusModel.find();


    const powerSavingOfDevices = statuses.reduce((acc, status) => {
      const deviceId = status.deviceId;
      const createdAt = status.createdAt;
      const voltage = status.voltage;
      const powerConsumption = status.powerConsumption;
      if (!acc[deviceId]) {
        acc[deviceId] = { deviceId, minutesVoltageZero: 0, minutesVoltageGreaterThanZero: 0, averageUsage: [], powerConsumption: 0, prev: { createdAt, voltage, powerConsumption } };
      }
      if (voltage > 0 && powerConsumption > 0) {
        const prev = acc[deviceId].prev;
        const current = { createdAt, voltage, powerConsumption };
        let timeDiffMinutes = (new Date(current.createdAt).getTime() - new Date(prev.createdAt).getTime()) / (1000 * 60); // Convert milliseconds to minutes
        //console.log("timeDiffMinutes", timeDiffMinutes)
        timeDiffMinutes = timeDiffMinutes <= 0 ? 5 : timeDiffMinutes;

        if (prev.voltage === 0) {
          acc[deviceId].minutesVoltageZero += Math.round(timeDiffMinutes);
        } else if (prev.voltage > 0) {
          acc[deviceId].minutesVoltageGreaterThanZero += Math.round(timeDiffMinutes);
          acc[deviceId].averageUsage.push(prev.powerConsumption);
        }

        acc[deviceId].powerConsumption = Math.round(acc[deviceId].averageUsage.reduce((a, b) => a + b, 0) / acc[deviceId].averageUsage.length);

        acc[deviceId].prev = current;

      }

      return acc;
    }, {});

    let powerSavingOfDevice = powerSavingOfDevices[device._id];

    console.log(powerSavingOfDevice);

    let consumed = 0, saved = 0, powerConsumption = 0;
    if (powerSavingOfDevice) {

      consumed = powerSavingOfDevice.minutesVoltageGreaterThanZero > 0 ? powerSavingOfDevice.powerConsumption * (powerSavingOfDevice.minutesVoltageGreaterThanZero / 60) : 0;
      //saved = powerSavingOfDevice.minutesVoltageZero > 0 ? powerSavingOfDevice.powerConsumption * (powerSavingOfDevice.minutesVoltageZero / 60) : 0;
      saved = 60 - powerSavingOfDevice.minutesVoltageGreaterThanZero > 0 ? powerSavingOfDevice.powerConsumption * (60 - powerSavingOfDevice.minutesVoltageGreaterThanZero) / 60 : 0;
      powerConsumption = powerSavingOfDevice.powerConsumption;

      if (consumed <= 0 && saved <= 0 && powerConsumption <= 0) {
        //find last Energy that was saved 
        //where consumed > 0 
        //meaning: we get its powerConsumption and that's what is saved energy

        let energy = await service.getLastConsumedEnergy({ deviceId: device._id.toString() });
        if (energy) {
          consumed = 0;
          saved = energy.powerConsumption; //100watt * 1 hour = 100wh
          powerConsumption = 0
        }
      }
    } else {
      let energy = await service.getLastConsumedEnergy({ deviceId: device._id.toString() });
      if (energy) {
        consumed = 0;
        saved = energy.powerConsumption; //100watt * 1 hour = 100wh
        powerConsumption = 0
      }
    }

    let res = {
      userId: device.userId,
      deviceId: device._id.toString(),
      deviceName: device.name,
      consumed: consumed,
      saved: saved,
      powerConsumption: powerConsumption
    }

    console.log(res);

    expect(res).toEqual({
      device1: expect.objectContaining({
        deviceId: '664c71e6d321f60013414fc7',
        minutesVoltageZero: expect.any(Number),
        minutesVoltageGreaterThanZero: expect.any(Number),
        powerConsumption: expect.any(Number)
      })
    })
  }); */

  // voltage = 0 for 60 minutes
  it('should correctly calculate power consumption for devices with voltage greater than 0', async () => {
    const mockDevicesStatusModel = {
      find: jest.fn().mockResolvedValue([{
        "_id": {
          "$oid": "6686aaf4d6de3b0012742bd0"
        },
        "isOnline": false,
        "totalPowerConsumption": 63087.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:00:20.414Z",
        "updatedAt": "2024-07-04T14:00:20.414Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686ab4cd6de3b0012742bdc"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:01:48.724Z",
        "updatedAt": "2024-07-04T14:01:48.724Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686ac78d6de3b0012742c03"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:06:48.744Z",
        "updatedAt": "2024-07-04T14:06:48.744Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686ada4d6de3b0012742c2a"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:11:48.728Z",
        "updatedAt": "2024-07-04T14:11:48.728Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686aed0d6de3b0012742c51"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:16:48.754Z",
        "updatedAt": "2024-07-04T14:16:48.754Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686affcd6de3b0012742c78"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:21:48.874Z",
        "updatedAt": "2024-07-04T14:21:48.874Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686b128d6de3b0012742c9f"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:26:48.759Z",
        "updatedAt": "2024-07-04T14:26:48.759Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686b254d6de3b0012742cce"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:31:48.742Z",
        "updatedAt": "2024-07-04T14:31:48.742Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686b380d6de3b0012742cf5"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:36:48.766Z",
        "updatedAt": "2024-07-04T14:36:48.766Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686b4acd6de3b0012742d1c"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:41:48.749Z",
        "updatedAt": "2024-07-04T14:41:48.749Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686b5d8d6de3b0012742d43"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:46:48.773Z",
        "updatedAt": "2024-07-04T14:46:48.773Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686b704d6de3b0012742d6a"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:51:48.749Z",
        "updatedAt": "2024-07-04T14:51:48.749Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686b830d6de3b0012742d91"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T14:56:48.770Z",
        "updatedAt": "2024-07-04T14:56:48.770Z",
        "__v": 0
      },
      {
        "_id": {
          "$oid": "6686b95cd6de3b0012742dbc"
        },
        "isOnline": false,
        "totalPowerConsumption": 63090.43,
        "powerConsumption": 0,
        "powerUsage": 0,
        "voltage": 0,
        "current": 0,
        "userId": "664c70d30c97c400135fd192",
        "deviceId": "664c71e6d321f60013414fc7",
        "createdAt": "2024-07-04T15:01:48.751Z",
        "updatedAt": "2024-07-04T14:56:48.770Z",
        "__v": 0
      }])
    };

    let device = {
      _id: "664c71e6d321f60013414fc7",
      userId: "664c70d30c97c400135fd192",
      name: "test device",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "deviceType",
    }
    let statuses = await mockDevicesStatusModel.find();


    const powerSavingOfDevices = statuses.reduce((acc, status) => {
      const deviceId = status.deviceId;
      const createdAt = status.createdAt;
      const voltage = status.voltage;
      const powerConsumption = status.powerConsumption;
      if (!acc[deviceId]) {
        acc[deviceId] = { deviceId, minutesVoltageZero: 0, minutesVoltageGreaterThanZero: 0, averageUsage: [], powerConsumption: 0, prev: { createdAt, voltage, powerConsumption } };
      }
      if (voltage > 0 && powerConsumption > 0) {
        const prev = acc[deviceId].prev;
        const current = { createdAt, voltage, powerConsumption };
        let timeDiffMinutes = (new Date(current.createdAt).getTime() - new Date(prev.createdAt).getTime()) / (1000 * 60); // Convert milliseconds to minutes
        //console.log("timeDiffMinutes", timeDiffMinutes)
        timeDiffMinutes = timeDiffMinutes <= 0 ? 5 : timeDiffMinutes;

        if (prev.voltage === 0) {
          acc[deviceId].minutesVoltageZero += Math.round(timeDiffMinutes);
        } else if (prev.voltage > 0) {
          acc[deviceId].minutesVoltageGreaterThanZero += Math.round(timeDiffMinutes);
          acc[deviceId].averageUsage.push(prev.powerConsumption);
        }

        acc[deviceId].powerConsumption = Math.round(acc[deviceId].averageUsage.reduce((a, b) => a + b, 0) / acc[deviceId].averageUsage.length);

        acc[deviceId].prev = current;

      }

      return acc;
    }, {});

    let powerSavingOfDevice = powerSavingOfDevices[device._id];

    console.log(powerSavingOfDevice);

    let consumed = 0, saved = 0, powerConsumption = 0;
    if (powerSavingOfDevice) {

      consumed = powerSavingOfDevice.minutesVoltageGreaterThanZero > 0 ? powerSavingOfDevice.powerConsumption * (powerSavingOfDevice.minutesVoltageGreaterThanZero / 60) : 0;
      //saved = powerSavingOfDevice.minutesVoltageZero > 0 ? powerSavingOfDevice.powerConsumption * (powerSavingOfDevice.minutesVoltageZero / 60) : 0;
      saved = 60 - powerSavingOfDevice.minutesVoltageGreaterThanZero > 0 ? powerSavingOfDevice.powerConsumption * (60 - powerSavingOfDevice.minutesVoltageGreaterThanZero) / 60 : 0;
      powerConsumption = powerSavingOfDevice.powerConsumption;

      if (consumed <= 0 && saved <= 0 && powerConsumption <= 0) {
        //find last Energy that was saved 
        //where consumed > 0 
        //meaning: we get its powerConsumption and that's what is saved energy

        //let energy = await service.getLastConsumedEnergy({ deviceId: device._id.toString() });
        let energy = {powerConsumption: 179}
        if (energy) {
          consumed = 0;
          saved = energy.powerConsumption; //100watt * 1 hour = 100wh
          powerConsumption = 0
        }
      }
    } else {
      //let energy = await service.getLastConsumedEnergy({ deviceId: device._id.toString() });
      let energy = {powerConsumption: 179}
      if (energy) {
        consumed = 0;
        saved = energy.powerConsumption; //100watt * 1 hour = 100wh
        powerConsumption = 0
      }
    }

    let res = {
      userId: device.userId,
      deviceId: device._id.toString(),
      deviceName: device.name,
      consumed: consumed,
      saved: saved,
      powerConsumption: powerConsumption
    }

    console.log(res);

    expect(res).toEqual({
      device1: expect.objectContaining({
        deviceId: '664c71e6d321f60013414fc7',
        minutesVoltageZero: expect.any(Number),
        minutesVoltageGreaterThanZero: expect.any(Number),
        powerConsumption: expect.any(Number)
      })
    })
  });
  // no deviceIds provided
  /* it('should handle case when no deviceIds are provided', async () => {
      const mockDevicesStatusModel = {
          find: jest.fn().mockResolvedValue([
              { deviceId: 'device1', createdAt: new Date(), voltage: 120, powerConsumption: 10 },
              { deviceId: 'device1', createdAt: new Date(), voltage: 120, powerConsumption: 20 },
          ])
      };

      const repository = new DevicesStatusRepository();
      repository.DevicesStatusModel = mockDevicesStatusModel;

      const result = await repository.powerSavingHourly();

      expect(result).toEqual({
          device1: expect.objectContaining({
              deviceId: 'device1',
              minutesVoltageZero: expect.any(Number),
              minutesVoltageGreaterThanZero: expect.any(Number),
              powerConsumption: expect.any(Number)
          })
      });
  }); */
});
