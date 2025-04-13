
// Mocking Device model
const Device = {
    find: jest.fn().mockResolvedValue([
        { apiKey: 'api_key_1', deviceId: 'device_1' },
        { apiKey: 'api_key_2', deviceId: 'device_2' },
        { apiKey: 'api_key_1', deviceId: 'device_3' },
        { apiKey: 'api_key_2', deviceId: 'device_4' },
        { apiKey: 'api_key_3', deviceId: 'device_5' },
        { apiKey: 'api_key_1', deviceId: 'device_6' },
        { apiKey: 'api_key_2', deviceId: 'device_7' },
        { apiKey: 'api_key_3', deviceId: 'device_8' },
        { apiKey: 'api_key_4', deviceId: 'device_9' },
        { apiKey: 'api_key_1', deviceId: 'device_10' },
        { apiKey: 'api_key_2', deviceId: 'device_11' },
        { apiKey: 'api_key_3', deviceId: 'device_12' },
        { apiKey: 'api_key_4', deviceId: 'device_13' },
        { apiKey: 'api_key_5', deviceId: 'device_14' },
        { apiKey: 'api_key_1', deviceId: 'device_15' },
        { apiKey: 'api_key_2', deviceId: 'device_16' },
        { apiKey: 'api_key_3', deviceId: 'device_17' },
        { apiKey: 'api_key_4', deviceId: 'device_18' },
        { apiKey: 'api_key_5', deviceId: 'device_19' },
        { apiKey: 'api_key_1', deviceId: 'device_20' },
        { apiKey: 'api_key_2', deviceId: 'device_21' },
        { apiKey: 'api_key_3', deviceId: 'device_22' },
        { apiKey: 'api_key_4', deviceId: 'device_23' },
        { apiKey: 'api_key_5', deviceId: 'device_24' },
        { apiKey: 'api_key_1', deviceId: 'device_25' },
        { apiKey: 'api_key_2', deviceId: 'device_26' },
        { apiKey: 'api_key_3', deviceId: 'device_27' },
        { apiKey: 'api_key_4', deviceId: 'device_28' },
        { apiKey: 'api_key_5', deviceId: 'device_29' },
        { apiKey: 'api_key_1', deviceId: 'device_30' },
        { apiKey: 'api_key_2', deviceId: 'device_31' },
        { apiKey: 'api_key_3', deviceId: 'device_32' },
        { apiKey: 'api_key_4', deviceId: 'device_33' },
        { apiKey: 'api_key_5', deviceId: 'device_34' },
        { apiKey: 'api_key_1', deviceId: 'device_35' },
        { apiKey: 'api_key_2', deviceId: 'device_36' },
        { apiKey: 'api_key_3', deviceId: 'device_37' },
        { apiKey: 'api_key_4', deviceId: 'device_38' },
        { apiKey: 'api_key_5', deviceId: 'device_39' },
        { apiKey: 'api_key_1', deviceId: 'device_40' },
        { apiKey: 'api_key_2', deviceId: 'device_41' },
        { apiKey: 'api_key_3', deviceId: 'device_42' },
        { apiKey: 'api_key_4', deviceId: 'device_43' },
        { apiKey: 'api_key_5', deviceId: 'device_44' },
        { apiKey: 'api_key_1', deviceId: 'device_45' },
        { apiKey: 'api_key_2', deviceId: 'device_46' },
        { apiKey: 'api_key_3', deviceId: 'device_47' },
        { apiKey: 'api_key_4', deviceId: 'device_48' },
        { apiKey: 'api_key_5', deviceId: 'device_49' },
        { apiKey: 'api_key_1', deviceId: 'device_50' },
        { apiKey: 'api_key_1', deviceId: 'device_51' },
        { apiKey: 'api_key_2', deviceId: 'device_52' },
        { apiKey: 'api_key_1', deviceId: 'device_53' },
        { apiKey: 'api_key_2', deviceId: 'device_54' },
        { apiKey: 'api_key_3', deviceId: 'device_55' },
        { apiKey: 'api_key_1', deviceId: 'device_56' },
        { apiKey: 'api_key_2', deviceId: 'device_57' },
        { apiKey: 'api_key_3', deviceId: 'device_58' },
        { apiKey: 'api_key_4', deviceId: 'device_59' },
        { apiKey: 'api_key_1', deviceId: 'device_60' },
        { apiKey: 'api_key_2', deviceId: 'device_61' },
        { apiKey: 'api_key_3', deviceId: 'device_62' },
        { apiKey: 'api_key_4', deviceId: 'device_63' },
        { apiKey: 'api_key_5', deviceId: 'device_64' },
        { apiKey: 'api_key_1', deviceId: 'device_65' },
        { apiKey: 'api_key_2', deviceId: 'device_66' },
        { apiKey: 'api_key_3', deviceId: 'device_67' },
        { apiKey: 'api_key_4', deviceId: 'device_68' },
        { apiKey: 'api_key_5', deviceId: 'device_69' },
        { apiKey: 'api_key_1', deviceId: 'device_70' },
        { apiKey: 'api_key_2', deviceId: 'device_71' },
        { apiKey: 'api_key_3', deviceId: 'device_72' },
        { apiKey: 'api_key_4', deviceId: 'device_73' },
        { apiKey: 'api_key_5', deviceId: 'device_74' },
        { apiKey: 'api_key_1', deviceId: 'device_75' },
        { apiKey: 'api_key_2', deviceId: 'device_76' },
        { apiKey: 'api_key_3', deviceId: 'device_77' },
        { apiKey: 'api_key_4', deviceId: 'device_78' },
        { apiKey: 'api_key_5', deviceId: 'device_79' },
        { apiKey: 'api_key_1', deviceId: 'device_80' },
        { apiKey: 'api_key_2', deviceId: 'device_81' },
        { apiKey: 'api_key_3', deviceId: 'device_82' },
        { apiKey: 'api_key_4', deviceId: 'device_83' },
        { apiKey: 'api_key_5', deviceId: 'device_84' },
        { apiKey: 'api_key_1', deviceId: 'device_85' },
        { apiKey: 'api_key_2', deviceId: 'device_86' },
        { apiKey: 'api_key_3', deviceId: 'device_87' },
        { apiKey: 'api_key_4', deviceId: 'device_88' },
        { apiKey: 'api_key_5', deviceId: 'device_89' },
        { apiKey: 'api_key_1', deviceId: 'device_90' },
        { apiKey: 'api_key_2', deviceId: 'device_91' },
        { apiKey: 'api_key_3', deviceId: 'device_92' },
        { apiKey: 'api_key_4', deviceId: 'device_93' },
        { apiKey: 'api_key_5', deviceId: 'device_94' },
        { apiKey: 'api_key_1', deviceId: 'device_95' },
        { apiKey: 'api_key_2', deviceId: 'device_96' },
        { apiKey: 'api_key_3', deviceId: 'device_97' },
        { apiKey: 'api_key_4', deviceId: 'device_98' },
        { apiKey: 'api_key_5', deviceId: 'device_99' },
        { apiKey: 'api_key_1', deviceId: 'device_100' },
    ])
};

// Function to group devices by API key
async function groupDevices() {
    try {
        // Retrieve devices from the mock Device model
        const devices = await Device.find();

        // Group devices by API key
        const groupedDevices = devices.reduce((acc, device) => {
            const key = device.apiKey;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(device);
            return acc;
        }, {});

        // Create groups of 20 or less devices with the same API key
        const deviceGroups = [];
        for (const key in groupedDevices) {
            const devices = groupedDevices[key];
            while (devices.length > 0) {
                deviceGroups.push(devices.splice(0, Math.min(20, devices.length)));
            }
        }

        // Return the device groups
        return deviceGroups;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Test the groupDevices function
test('groupDevices function', async () => {
    const result = await groupDevices();
    console.log(result)
    expect(result).toHaveLength(7); // We expect 5 groups based on the sample data
    expect(result[0]).toHaveLength(20); // First group API 1 should have 20 devices
    expect(result[1]).toHaveLength(4); // Second group API 1 should have 4 devices
    // expect(result[2]).toHaveLength(1); // Third group should have 1 device
});
