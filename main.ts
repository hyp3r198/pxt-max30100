const MAX30100_ADDR = 0x57
const REG_INT_STATUS = 0x00
const REG_MODE_CONFIG = 0x06
const REG_SPO2_CONFIG = 0x07
const REG_LED_CONFIG = 0x09
const REG_FIFO_DATA = 0x05
const REG_FIFO_WR_PTR = 0x02
const REG_FIFO_RD_PTR = 0x04
const REG_FIFO_OV_PTR = 0x03

let ir = 0
let red = 0

//% weight=100 color=#ff4b4b icon="\uf21e"
namespace max30100 {

    //% block="initialize MAX30100"
    export function initialize(): void {
        // Reset FIFO pointers
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_FIFO_WR_PTR, 0x00]))
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_FIFO_RD_PTR, 0x00]))
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_FIFO_OV_PTR, 0x00]))

        // Set SpO2 mode
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_MODE_CONFIG, 0x03]))

        // Set SpO2 config: 100Hz sample rate, 1600us pulse width
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_SPO2_CONFIG, 0x47]))

        // Set LED currents: IR = 27mA, RED = 27mA
        pins.i2cWriteBuffer(MAX30100_ADDR, pins.createBufferFromArray([REG_LED_CONFIG, 0x24]))
    }

    //% block="update readings"
    export function update(): void {
        pins.i2cWriteNumber(MAX30100_ADDR, REG_INT_STATUS, NumberFormat.UInt8BE)
        let status = pins.i2cReadNumber(MAX30100_ADDR, NumberFormat.UInt8BE)
        
        // Only read if data is ready
        if ((status & 0x20) == 0x20) {
            pins.i2cWriteNumber(MAX30100_ADDR, REG_FIFO_DATA, NumberFormat.UInt8BE)
            let data = pins.i2cReadBuffer(MAX30100_ADDR, 4)
            ir = (data[0] << 8) | data[1]
            red = (data[2] << 8) | data[3]
        }
    }

    //% block="get IR value"
    export function getIR(): number {
        return ir
    }

    //% block="get RED value"
    export function getRED(): number {
        return red
    }
}
