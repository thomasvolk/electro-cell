interface Serializable {
    toObject(): Object
}

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

    apply(touch: boolean = false) {
        if(this.newValue != this.value) {
            this.value = this.newValue 
            this.hasChanged = true
        }
        else {
            this.hasChanged = touch            
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

export class Cell2D extends Cell implements Serializable {

    private x: number
    private y: number

    
    constructor(x: number, y: number) {
        super()
        this.x = x
        this.y = y
    }

    toObject(): Object {
        return { 
            x: this.x,
            y: this.y,
            v: this.getValue()
         }
    }
    
    getX(): number {
        return this.x
    }
    
    getY(): number {
        return this.y
    }
}

abstract class Universe<C extends Cell> implements Serializable {
    abstract toObject(): Object 
    
    abstract getCells(): Array<C>
    
    getValue(): number {
        return this.getCells().reduce((sum, cell) => sum + cell.getValue(), 0)
    }

    reset() {
        this.getCells().forEach(c => c.reset())
    }
}

export class Universe2D extends Universe<Cell2D> {
    private cells: Array<Cell2D>
    width: number
    height: number
    endless: boolean
    
    constructor(width: number, height: number, endless: boolean = true) {
        super()
        this.width = width
        this.height = height
        this.endless = endless
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

    toObject(): Object {
        const cells = this.cells.filter((c) => c.getValue() > 0).map((c) => c.toObject())
        return {
            type: "2D",
            endless: this.endless,
            width: this.width,
            height: this.height,
            cells: cells
        }
    }
    
    static fromObject(obj: any): Universe2D {
        const u = new Universe2D(obj.width, obj.height);
        (obj.cells as Array<any>).forEach((c) => {
            const cell = u.getCell(c.x, c.y)
            cell.enterValue(c.v)
            cell.apply(true)
        })
        return u
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

    private isInside(x: number, y: number): boolean {
        return this.endless || x > 0 && x < this.width && y > 0 && y < this.height
    }

    getCell(x: number, y: number): Cell2D {
        const cx = Universe2D.cycle(x, this.width)
        const cy = Universe2D.cycle(y, this.height)
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
        for(var ny = -1; ny < 2; ny++) {
            for(var nx = -1; nx < 2; nx++) {
                if(!(nx == 0 && ny == 0) && this.isInside(nx, ny)) {
                    neighbours.push(this.getCell(x + nx, y + ny))
                }
            }
        }
        return neighbours
    }

}

export interface Rule extends Serializable {
    calculateNewValue(cellValue: number, neighbourValues: Array<number>): number
}

export class EEFFRule implements Rule {
    static normalizeToOneOrZero(values: Array<number>): Array<number> {
        return values.map(v => {
            if (v > 0) return 1
            else return 0
        })
    }

    private el: number
    private eu: number
    private fl: number
    private fu: number

    constructor(el: number, eu: number, fl: number, fu: number) {
        this.el = el
        this.eu = eu
        this.fl = fl
        this.fu = fu
    }
    toObject(): Object {
        return {
            type: "EEFF",
            el: this.el,
            eu: this.eu,
            fl: this.fl,
            fu: this.fu
        }
    }
    static fromObject(obj: any): EEFFRule {
        return new EEFFRule(
            obj.el,
            obj.eu,
            obj.fl,
            obj.fu
        )
    }

    calculateNewValue(cellValue: number, neighbourValues: Array<number>): number {
        const normalizedValues = EEFFRule.normalizeToOneOrZero(neighbourValues)
        const livingNeighbours = normalizedValues.reduce((sum, current) => sum + current, 0)
        if(cellValue > 0 && (livingNeighbours < this.el || livingNeighbours > this.eu)) {
            return 0
        }
        else if(cellValue == 0 && (livingNeighbours >= this.fl && livingNeighbours <= this.fu)) {
            return 1
        }
        return cellValue
    }
}

export class EvolutionAlgorithm<C extends Cell> {
    private universe: Universe<C>
    private rule: Rule

    constructor(universe: Universe<C>, rule: Rule) {
        this.universe = universe
        this.rule = rule
    }

    iterate() {
        this.universe.getCells().forEach(cell => {
            const newValue = this.rule.calculateNewValue(cell.getValue(), cell.getNeighbours().map(c => c.getValue()))
            cell.enterValue(newValue)
        })
        this.universe.getCells().forEach(c => c.apply())
    }
}

export class Configuration2D {
    universe: Universe2D
    rule: Rule
    delay_ms: number

    constructor(universe: Universe2D, rule: Rule, delay_ms: number) {
        this.universe = universe
        this.rule = rule
        this.delay_ms = delay_ms
    }

    toObject(): Object {
        return {
            universe: this.universe.toObject(),
            rule: this.rule.toObject(),
            delay_ms: this.delay_ms
        }
    }

    static fromObject(cfg: any): Configuration2D {
        return new Configuration2D(
            Universe2D.fromObject(cfg.universe),
            EEFFRule.fromObject(cfg.rule),
            cfg.delay_ms
        )
    }
}

