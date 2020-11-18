class Cell {
    value: number
    new_value: number
    private x: number
    private y: number
    
    constructor(x: number, y: number) {
        this.value = 0
        this.new_value = 0
        this.x = x
        this.y = y
    }
    
    getX(): number {
        return this.x
    }
    
    getY(): number {
        return this.y
    }
}

class Grid2D {
    private cells: Array<Cell>
    
    constructor(width: number, height: number) {
        this.cells = []
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                this.cells.push(new Cell(x, y))
            }
        }
    }

    getCell(x: number, y: number) {
        return this.cells[x*y]
    }

    getCells(): Array<Cell> {
        return this.cells
    }

}



class CellularAutomat {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    }

    run() {
        const grid = new Grid2D(20, 20)
        grid.getCell(2,3).value = 1
        grid.getCell(12,5).value = 1
        grid.getCell(9,9).value = 1
        this.context.fillStyle = 'black'
        const size = 10
        for (var c of grid.getCells()) {
            if (c.value > 0) {
                const x = c.getX() * size
                const y = c.getY() * size
                this.context.fillRect(x, y, size, size)
            }
        }
    }
}

let ca = new CellularAutomat()
ca.run()