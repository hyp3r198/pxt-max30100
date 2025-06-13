const MAX30100_ADDR = 0x57;
const REG_MODE = 0x06;
const REG_SPO2 = 0x07;
const REG_LED = 0x09;
const REG_INT_STA = 0x00;
const REG_FIFO = 0x05;

let irValue = 0;
let redValue = 0;

//% weight=100 color=#00AEEF icon="♥"
namespace max30100 {

    //% block="initialize MAX30100"
    export function init(): void {
        // enable SpO2 mode w/ high-res and LED currents
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_MODE, 0x03]));
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_SPO2, 0x47]));
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_LED, 0x24]));
        // clear FIFO pointers
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([0x02, 0x00]));
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([0x04, 0x00]));
    }

    //% block="update readings"
    export function update(): void {
        // check if SpO2 data is ready (bit 4 in INT_STATUS)
        pins.i2cWriteNumber(MAX30100_ADDR, REG_INT_STA, NumberFormat.UInt8BE);
        let intReg = pins.i2cReadNumber(MAX30100_ADDR, NumberFormat.UInt8BE);
        if ((intReg & 0x10) == 0) return;

        // read one sample (4 bytes)
        pins.i2cWriteNumber(MAX30100_ADDR, REG_FIFO, NumberFormat.UInt8BE);
        let buf = pins.i2cReadBuffer(MAX30100_ADDR, 4);
        irValue = (buf[0] << 8) | buf[1];
        redValue = (buf[2] << 8) | buf[3];
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
