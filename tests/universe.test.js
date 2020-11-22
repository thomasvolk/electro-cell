
QUnit.module('Endless2DUniverse', function() {
    QUnit.test('init', function(assert) {
        const u = new Endless2DUniverse(20, 20)
        assert.equal(u.width, 20, 'width = 20')
        assert.equal(u.height, 20, 'height = 20')
        assert.equal(u.getCells().length, 400, 'count of cells = 400')
    })
    QUnit.test('cycle', function(assert) {
        assert.equal(Endless2DUniverse.cycle(5,  10),  5,   "cycle(5,  10) = 5")
        assert.equal(Endless2DUniverse.cycle(10, 10),  0,   "cycle(10, 10) = 0")
        assert.equal(Endless2DUniverse.cycle(14, 10),  4,   "cycle(14, 10) = 4")
        assert.equal(Endless2DUniverse.cycle(0,  10),  0,   "cycle(0,  10) = 0")
        assert.equal(Endless2DUniverse.cycle(0,   1),  0,   "cycle(0,   1) = 0")
        assert.equal(Endless2DUniverse.cycle(1,   1),  0,   "cycle(1,   1) = 0")
        assert.true(isNaN(Endless2DUniverse.cycle(0,   0)), "cycle(0,   0) = NaN")
        assert.equal(Endless2DUniverse.cycle(-1, 10),  9,   "cycle(-1, 10) = 9")
        assert.equal(Endless2DUniverse.cycle(-8, 10),  2,   "cycle(-8, 10) = 2")
        assert.equal(Endless2DUniverse.cycle(-12, 10), 8,   "cycle(-12, 10) = 8")
    })
    QUnit.test('neighbours of middle cell', function(assert) {
        const u = new Endless2DUniverse(20, 20)
        
        const cell = u.getCell(10, 10)
        const neighbours = u.getNeighbours(cell)
        assert.equal(neighbours.length,     8, 'neighbours.length = 8')
        assert.equal(neighbours[0].getX(),  9, 'neighbour[0].x = 9')
        assert.equal(neighbours[0].getY(),  9, 'neighbour[0].y = 9')
        assert.equal(neighbours[3].getX(),  9, 'neighbour[3].x = 9')
        assert.equal(neighbours[3].getY(), 10, 'neighbour[3].y = 10')
        assert.equal(neighbours[7].getX(), 11, 'neighbour[7].x = 11')
        assert.equal(neighbours[7].getY(), 11, 'neighbour[7].y = 11')
    })
    QUnit.test('neighbours of corner cell', function(assert) {
        const u = new Endless2DUniverse(20, 20)

        const cell = u.getCell(0, 0)
        const neighbours = u.getNeighbours(cell)
        assert.equal(neighbours.length,     8, 'neighbours.length = 8')
        assert.equal(neighbours[0].getX(), 19, 'neighbour[0].x = 19')
        assert.equal(neighbours[0].getY(), 19, 'neighbour[0].y = 19')
        assert.equal(neighbours[1].getX(),  0, 'neighbour[1].x =  0')
        assert.equal(neighbours[1].getY(), 19, 'neighbour[1].y = 19')
        assert.equal(neighbours[2].getX(),  1, 'neighbour[2].x =  1')
        assert.equal(neighbours[2].getY(), 19, 'neighbour[2].y = 19')
        assert.equal(neighbours[3].getX(), 19, 'neighbour[3].x = 19')
        assert.equal(neighbours[3].getY(),  0, 'neighbour[3].y = 0')
        assert.equal(neighbours[4].getX(),  1, 'neighbour[4].x = 1')
        assert.equal(neighbours[4].getY(),  0, 'neighbour[4].y = 0')
        assert.equal(neighbours[7].getX(),  1, 'neighbour[7].x = 1')
        assert.equal(neighbours[7].getY(),  1, 'neighbour[7].y = 1')
    })
})

QUnit.module('ConwayAlgorithm', function() {
    QUnit.test('normalizeToOneOrZero', function(assert) {
        assert.equal(ConwayAlgorithm.normalizeToOneOrZero([5, 0.7, 0, 1, -1, 0]).join(","), "1,1,0,1,0,0", 
            'normalizeToOneOrZero([5, 0.7, 0, 1, -1, 0] = [1,1,0,1,0,0]')
    })
    QUnit.test('rules', function(assert) {
        assert.equal(ConwayAlgorithm.calculateCellValue(0, [5, 0.7, 0, 1, -1, 0, 0, 0, 0]), 1, 
            'calculateCellValue(0, [5, 0.7, 0, 1, -1, 0, 0, 0, 0] = 1')
        
        assert.equal(ConwayAlgorithm.calculateCellValue(1, [1, 1, 0, 0, 0, 0]), 1, 
            'calculateCellValue(1, [1, 1, 0, 0, 0, 0, 0, 0, 0] = 1')
        assert.equal(ConwayAlgorithm.calculateCellValue(0, [1, 1, 0, 0, 0, 0]), 0, 
            'calculateCellValue(0, [1, 1, 0, 0, 0, 0, 0, 0, 0] = 0')
        assert.equal(ConwayAlgorithm.calculateCellValue(0, [1, 1, 1, 0, 0, 0]), 1, 
            'calculateCellValue(0, [1, 1, 1, 0, 0, 0, 0, 0, 0] = 1')
        assert.equal(ConwayAlgorithm.calculateCellValue(1, [1, 1, 1, 1, 0, 0]), 0, 
            'calculateCellValue(1, [1, 1, 1, 1, 0, 0, 0, 0, 0] = 0')
        assert.equal(ConwayAlgorithm.calculateCellValue(1, [1, 0, 0, 0, 0, 0]), 0, 
            'calculateCellValue(1, [1, 0, 0, 0, 0, 0, 0, 0, 0] = 0')
    })
})