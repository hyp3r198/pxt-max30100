# MAX30100 Extension for MakeCode (micro:bit)

This extension adds support for reading IR and RED values from the MAX30100 pulse oximeter over I2C.

## Blocks

- `initialize MAX30100`
- `update readings`
- `get IR value`
- `get RED value`

## Wiring

| MAX30100 | micro:bit |
|----------|-----------|
| VIN      | 3V        |
| GND      | GND       |
| SDA      | P20       |
| SCL      | P19       |

## Example

```blocks
max30100.init()
basic.forever(function () {
    max30100.update()
    serial.writeValue("IR", max30100.getIR())
    serial.writeValue("RED", max30100.getRed())
    basic.pause(1000)
})
