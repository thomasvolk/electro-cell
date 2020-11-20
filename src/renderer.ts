

class CellularAutomat2D {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    }

    run() {
        const grid = new Endless2DUniverse(20, 20)
        grid.getCell(0,0).setNewValue(1).copyNewValueToValue()
        grid.getCell(1,1).setNewValue(1).copyNewValueToValue()
        grid.getCell(2,2).setNewValue(1).copyNewValueToValue()

        const size = 10
        for (var c of grid.getCells()) {
            if(c.getHasChanged()) {
                if (c.getValue() > 0) {
                    this.context.fillStyle = 'black'
                }
                else {
                    this.context.fillStyle = 'white'
                }
            
                const x = c.getX() * size
                const y = c.getY() * size
                this.context.fillRect(x, y, size, size)
            }
        }
    }
}


let ca = new CellularAutomat2D()
ca.run()