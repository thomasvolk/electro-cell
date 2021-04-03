import {
    Endless2DUniverse, 
    EvolutionAlgorithm, 
    ConwayAlgorithm, 
    Cell2D
} from "./CellularAutomat";


export class CellularAutomat2DPresenter {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private cellSize: number
    private width: number
    private height: number
    private interationIntervall: number
    private interval: any
    private universe: Endless2DUniverse
    private algorithm: EvolutionAlgorithm<Cell2D>

    constructor(width: number, height: number, interationIntervall = 100) {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.cellSize = Math.round(Math.min(this.canvas.height, this.canvas.width) / Math.max(width, height))
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
        this.width = width
        this.height = height
        this.interationIntervall = interationIntervall
        this.interval = null
        this.universe = new Endless2DUniverse(this.width, this.height)
        this.algorithm = new ConwayAlgorithm<Cell2D>(this.universe)
    }

    draw() {
        const size = this.cellSize
        for (var c of this.universe.getCells()) {
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
    
    random() {
        this.universe.reset()
        for (var c of this.universe.getCells()) {
            c.enterValue(Math.floor(Math.random() * Math.floor(2)))
            c.apply(true)
        }
    }

    reset(pattern: string = "") {
        stop()
        this.universe.reset()
        pattern.split('\n').forEach( (line, y) => {
            Array.from(line).forEach( (c, x) => {
                if(c != ' ') {
                    this.activateCell(x, y)
                }
            })
        })
        this.draw()
    }

    start() {
        if (!this.isRunning()) {
            this.interval = setInterval(()=> { 
                this.draw()
                this.algorithm.iterate()
            }, this.interationIntervall);
        }
    }

    stop() {
        if (this.isRunning()) {
            clearInterval(this.interval)
            this.interval = null
        }
    }

    isRunning(): boolean {
        return this.interval != null
    }
}