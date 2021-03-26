class Cell {
    private value: number
    private newValue: number
    private hasChanged: boolean
    private neighbours: Array<Cell>

    constructor() {
        this.value = 0
        this.newValue = 0
        this.hasChanged = false
        this.neighbours = new Array<Cell>()
    }

    getValue(): number {
        return this.value
    }

    setNeighbours(n: Array<Cell>) {
        this.neighbours = n
    }

    getNeighbours(): Array<Cell> {
        return this.neighbours
    }

    enterValue(v: number): Cell {
        this.newValue = v
        return this
    }

    apply() {
        if(this.newValue != this.value) {
            this.value = this.newValue 
            this.hasChanged = true
        }
        else {
            this.hasChanged = false            
        }
    }

    reset() {
        this.value = 0
        this.newValue = 0
        this.hasChanged = true
    }

    getHasChanged() {
        return this.hasChanged
    }
}

export class Cell2D extends Cell {

    private x: number
    private y: number

    
    constructor(x: number, y: number) {
        super()
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

abstract class Universe<C extends Cell> {
    
    abstract getCells(): Array<C>
    
    getValue(): number {
        return this.getCells().reduce((sum, cell) => sum + cell.getValue(), 0)
    }

    reset() {
        this.getCells().forEach(c => c.reset())
    }
}

export class Endless2DUniverse extends Universe<Cell2D> {
    private cells: Array<Cell2D>
    width: number
    height: number
    
    constructor(width: number, height: number) {
        super()
        this.width = width
        this.height = height
        this.cells = []
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                this.cells.push(new Cell2D(x, y))
            }
        }
        for (let cell of this.cells) {
            cell.setNeighbours(this.getNeighbours(cell))
        }
    }

    static cycle(v: number, max: number): number {
        if (v < 0) {
            return max + (v % max)
        }
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

    private getNeighbours(cell: Cell2D): Array<Cell2D> {
        const x = cell.getX()
        const y = cell.getY()
        const neighbours = new Array<Cell2D>()
        for (var n of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) {
            neighbours.push(this.getCell(x + n[0], y + n[1]))
        }
        return neighbours
    }

}


export abstract class EvolutionAlgorithm<C extends Cell> {
    private universe: Universe<C>

    constructor(universe: Universe<C>) {
        this.universe = universe
    }

    iterate() {
        this.universe.getCells().forEach(cell => {
            const newValue = this.calculateNewValue(cell.getValue(), cell.getNeighbours().map(c => c.getValue()))
            cell.enterValue(newValue)
        })
        this.universe.getCells().forEach(c => c.apply())
    }

    protected abstract calculateNewValue(cellValue: number, neighbourValues: Array<number>): number
}

export class ConwayAlgorithm<C extends Cell> extends EvolutionAlgorithm<C> {
    static normalizeToOneOrZero(values: Array<number>): Array<number> {
        return values.map(v => {
            if (v > 0) return 1
            else return 0
        })
    }

    static calculateCellValue(cellValue: number, neighbourValues: Array<number>): number {
        const normalizedValues = ConwayAlgorithm.normalizeToOneOrZero(neighbourValues)
        const neighbourSum = normalizedValues.reduce((sum, current) => sum + current, 0)
        if (neighbourSum < 2 || neighbourSum > 3) return 0
        if (cellValue > 0) return 1
        if (cellValue == 0 && neighbourSum == 3) return 1
        return 0
    }

    protected calculateNewValue(cellValue: number, neighbourValues: Array<number>): number {
        return ConwayAlgorithm.calculateCellValue(cellValue, neighbourValues)
    }
}