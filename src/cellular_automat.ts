class Cell {
    private universe: Universe 
    private value: number
    private newValue: number
    private hasChanged: boolean

    constructor(universe: Universe) {
        this.universe = universe
        this.value = 0
        this.newValue = 0
        this.hasChanged = false
    }

    getNeighbours(): Array<Cell> {
        return this.universe.getNeighbours(this)
    }

    private setValue(v: number) {
        if(v != this.value) {
            this.value = v
            this.hasChanged = true
        }
    }

    getValue() {
        return this.value
    }

    setNewValue(v: number): Cell {
        this.newValue = v
        return this
    }

    copyNewValueToValue() {
        this.setValue(this.newValue)
    }

    getHasChanged() {
        return this.hasChanged
    }
}

class Cell2D extends Cell {

    private x: number
    private y: number

    
    constructor(universe: Universe, x: number, y: number) {
        super(universe)
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

interface Universe {
    getNeighbours(cell: Cell): Array<Cell>
}

class Endless2DUniverse implements Universe {
    private cells: Array<Cell2D>
    width: number
    height: number
    
    constructor(width: number, height: number) {
        this.cells = []
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                this.cells.push(new Cell2D(this, x, y))
            }
        }
        this.width = width
        this.height = height
    }

    static cycle(v: number, max: number): number {
        if (v < max) {
            return v
        }
        return v % max
    }

    getCell(x: number, y: number): Cell2D {
        const cx = Endless2DUniverse.cycle(x, this.width)
        const cy = Endless2DUniverse.cycle(y, this.height)
        const i = cx + cy * this.width
        return this.cells[i]
    }

    getCells(): Array<Cell2D> {
        return this.cells
    }

    getNeighbours(cell: Cell2D): Array<Cell2D> {
        return null
    }

}

