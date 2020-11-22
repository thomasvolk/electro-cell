class Cell {
    private value: number
    private newValue: number
    private hasChanged: boolean

    constructor() {
        this.value = 0
        this.newValue = 0
        this.hasChanged = false
    }

    private setValue(v: number) {
        if(v != this.value) {
            this.value = v
            this.hasChanged = true
        }
    }

    getValue(): number {
        return this.value
    }

    enterValue(v: number): Cell {
        this.newValue = v
        return this
    }

    apply() {
        this.setValue(this.newValue)
    }

    getHasChanged() {
        return this.hasChanged
    }
}

class Cell2D extends Cell {

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

interface Universe<C> {
    getNeighbours(cell: C): Array<C>
    getCells(): Array<C>
}

class Endless2DUniverse implements Universe<Cell2D> {
    private cells: Array<Cell2D>
    width: number
    height: number
    
    constructor(width: number, height: number) {
        this.cells = []
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                this.cells.push(new Cell2D(x, y))
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
        const x = cell.getX()
        const y = cell.getY()
        const neighbours = new Array<Cell2D>()
        for (var nx=-1; nx < 2; nx++) {
            for (var ny=-1; ny < 2; ny++) {
                neighbours.push(this.getCell(x + nx, y + ny))
            }
        }
        return neighbours
    }

}


abstract class EvolutionAlgorithm<C extends Cell> {
    private universe: Universe<C>

    constructor(universe: Universe<C>) {
        this.universe = universe
    }

    iterate() {
        this.universe.getCells().forEach(cell => {
            const neighbours = this.universe.getNeighbours(cell)
            const newValue = this.calculateNewValue(neighbours.map(c => c.getValue()))
            cell.enterValue(newValue)
        });
    }

    protected abstract calculateNewValue(neighbourValues: Array<number>): number
}

class ConwayAlgorithm<C extends Cell> extends EvolutionAlgorithm<C> {
    static normalizeValuesOneOrZero(values: Array<number>): Array<number> {
        return values.map(v => {
            if (v > 0) return 1
            else return 0
        })
    }

    protected calculateNewValue(neighbourValues: Array<number>): number {
        const normalizedValues = ConwayAlgorithm.normalizeValuesOneOrZero(neighbourValues)
        const neighbourSum = normalizedValues.reduce((sum, current) => sum + current, 0)
        if (neighbourSum < 2 || neighbourSum > 3) return 0
        return 1
    }
}