

class CellularAutomat2D {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private cellSize: number
    private width: number
    private height: number
    private interationIntervall: number
    private interval: any
    private universe: Endless2DUniverse

    constructor(width: number, height: number, interationIntervall = 100) {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.cellSize = Math.round(Math.min(this.canvas.height, this.canvas.width) / Math.max(width, height))
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
        this.width = width
        this.height = height
        this.interationIntervall = interationIntervall
        this.interval = null
        this.universe = new Endless2DUniverse(this.width, this.height)
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

    activateCell(x: number, y: number) {
        this.universe.getCell(x, y).enterValue(1).apply()
    }
    

    start() {
        const conway = new ConwayAlgorithm<Cell2D>(this.universe)
        this.interval = setInterval(()=> { 
            this.draw(this.universe)
            conway.iterate()
         }, this.interationIntervall);
    }

    stop() {
        clearInterval(this.interval)
        this.interval = null
    }

    isRunning(): boolean {
        return this.interval != null
    }
}


let ca = new CellularAutomat2D(80, 60, 1)
ca.activateCell(10, 10)
ca.activateCell(11, 10)
ca.activateCell(12, 10)
ca.activateCell(12, 11)
ca.activateCell(11, 12)

let toggleButton = document.getElementById('toggle-button')

function toggle() {
    if(ca.isRunning()) {
        ca.stop()
        toggleButton.textContent = "Start"
    }
    else {
        ca.start()
        toggleButton.textContent = "Stop"
    }
}

toggleButton.addEventListener('click', toggle)