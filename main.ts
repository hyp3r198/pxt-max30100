const MAX30100_ADDRESS = 0x57;
const REG_FIFO_DATA = 0x05;
const REG_MODE_CONFIG = 0x06;
const REG_SPO2_CONFIG = 0x07;
const REG_LED_CONFIG = 0x09;

let irValue = 0;
let redValue = 0;

/**
 * MAX30100 Sensor
 */
//% weight=100 color=#00AEEF icon="♥"
namespace max30100 {

    //% block="initialize MAX30100"
    export function init(): void {
        pins.i2cWriteBuffer(MAX30100_ADDRESS, pins.createBufferFromArray([REG_MODE_CONFIG, 0x03])); // HR + SpO2 mode
        pins.i2cWriteBuffer(MAX30100_ADDRESS, pins.createBufferFromArray([REG_SPO2_CONFIG, 0x47])); // High resolution
        pins.i2cWriteBuffer(MAX30100_ADDRESS, pins.createBufferFromArray([REG_LED_CONFIG, 0x24]));  // LED currents
    }

    //% block="update readings"
   export function update(): void {
    let reg = readRegister8(REG_INTERRUPT_STATUS)
    if (reg & 0x20) {
        IR = readRegister16(REG_FIFO_DATA)
        RED = readRegister16(REG_FIFO_DATA)
    }
}

    //% block="get IR value"
    export function getIR(): number {
        return irValue;
    }

    //% block="get RED value"
    export function getRed(): number {
        return redValue;
    }
}

