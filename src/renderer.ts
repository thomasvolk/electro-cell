

class CellularAutomat {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    }

    run() {
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, 10, 10)
        this.context.fillRect(10, 10, 10, 10)
        this.context.fillRect(20, 20, 10, 10)
        //this.context.fillRect(30, 30, 10, 10)
    }
}

let ca = new CellularAutomat()
ca.run()