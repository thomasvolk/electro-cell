

class CellularAutomat2D {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    cellSize: number
    width: number
    height: number

    constructor(width: number, height: number, cellSize: number = 10) {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
        this.cellSize = cellSize
        this.width = width
        this.height = height
    }

    draw<C extends Cell2D>(universe: Universe<C>) {
        const size = this.cellSize
        for (var c of universe.getCells()) {
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

    run() {
        const universe = new Endless2DUniverse(20, 20)
        universe.getCell(0,0).enterValue(1).apply()
        universe.getCell(1,1).enterValue(1).apply()
        universe.getCell(1,0).enterValue(1).apply()
        universe.getCell(2,2).enterValue(1).apply()
        universe.getCell(2,3).enterValue(1).apply()
        
        const conway = new ConwayAlgorithm<Cell2D>(universe)
        while(true) {
            this.draw(universe)
            conway.iterate()
        }
    }
}


let ca = new CellularAutomat2D(20, 20)
ca.run()