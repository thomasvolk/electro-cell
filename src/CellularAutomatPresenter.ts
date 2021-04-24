import {
    Configuration,
} from "./CellularAutomat";


export class CellularAutomatPresenter {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private cellSize: number
    private interval: any
    private config: Configuration

    constructor(config: Configuration) {
        this.reset(config)
    }

    draw() {
        const size = this.cellSize
        for (var c of this.config.universe.getCells()) {
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

    getConfig(): Configuration {
        return this.config
    }

    activateCell(x: number, y: number) {
        this.config.universe.getCell(x, y).enterValue(1).apply()
    }
    
    random() {
        this.config.universe.reset()
        for (var c of this.config.universe.getCells()) {
            c.enterValue(Math.floor(Math.random() * Math.floor(2)))
            c.apply(true)
        }
    }

    reset(config: Configuration = null) {
        this.stop()
        if(config != null) {
            this.config = config
        }
        else {
            this.config.universe.reset()
        }
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.cellSize = Math.round(Math.min(this.canvas.height, this.canvas.width) / Math.max(config.universe.width, config.universe.height))
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
        this.interval = null
        this.draw()
    }

    start() {
        if (!this.isRunning()) {
            const algorithm = this.config.newAlgorithm()
            this.interval = setInterval(()=> { 
                this.draw()
                algorithm.iterate()
            }, this.config.delay_ms);
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
