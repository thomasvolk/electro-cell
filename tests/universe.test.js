
QUnit.module('Endless2DUniverse', function() {
    QUnit.test('init', function(assert) {
        const u = new Endless2DUniverse(20, 20)
        assert.equal(u.width, 20, 'width = 20')
        assert.equal(u.height, 20, 'height = 20')
        assert.equal(u.getCells().length, 400, 'count of cells = 400')
    })
    QUnit.test('cycle', function(assert) {
        assert.equal(Endless2DUniverse.cycle(5,  10),  5, "cycle(5,  10) = 5")
        assert.equal(Endless2DUniverse.cycle(10, 10),  0, "cycle(10, 10) = 0")
        assert.equal(Endless2DUniverse.cycle(14, 10),  4, "cycle(14, 10) = 4")
        assert.equal(Endless2DUniverse.cycle(0,  10),  0, "cycle(0,  10) = 0")
        assert.equal(Endless2DUniverse.cycle(0,   1),  0, "cycle(0,   1) = 0")
        assert.equal(Endless2DUniverse.cycle(1,   1),  0, "cycle(1,   1) = 0")
        assert.true(isNaN(Endless2DUniverse.cycle(0,   0)), "cycle(0,   0) = NaN")
    })
    QUnit.test('neighbours', function(assert) {
        const u = new Endless2DUniverse(20, 20)
        const c_10_10 = u.getCell(10, 10)
        const n_10_10 = u.getNeighbours(c_10_10)
        assert.equal(n_10_10.length, 9, 'neighbours.length = 9')
        assert.equal(n_10_10[0].getX(), 9, 'neighbour[0].x = 9')
        assert.equal(n_10_10[0].getY(), 9, 'neighbour[0].y = 9')
        assert.equal(n_10_10[3].getX(), 9, 'neighbour[3].x = 9')
        assert.equal(n_10_10[3].getY(), 10, 'neighbour[3].y = 10')
        assert.equal(n_10_10[8].getX(), 11, 'neighbour[8].x = 11')
        assert.equal(n_10_10[8].getY(), 11, 'neighbour[8].y = 11')
    })
})

QUnit.module('ConwayAlgorithm', function() {
    QUnit.test('normalizeToOneOrZero', function(assert) {
        assert.equal(ConwayAlgorithm.normalizeToOneOrZero([5, 0.7, 0, 1, -1, 0]).join(","), "1,1,0,1,0,0", 
            'normalizeToOneOrZero([5, 0.7, 0, 1, -1, 0] = [1,1,0,1,0,0]')
    })
    QUnit.test('rules', function(assert) {
        assert.equal(ConwayAlgorithm.calculateCellValue([5, 0.7, 0, 1, -1, 0, 0, 0, 0]), 1, 
            'calculateCellValue([5, 0.7, 0, 1, -1, 0, 0, 0, 0] = 1')
        
        assert.equal(ConwayAlgorithm.calculateCellValue([1, 1, 0, 0, 0, 0]), 1, 
            'calculateCellValue([1, 1, 0, 0, 0, 0, 0, 0, 0] = 1')
        assert.equal(ConwayAlgorithm.calculateCellValue([1, 1, 1, 0, 0, 0]), 1, 
            'calculateCellValue([1, 1, 1, 0, 0, 0, 0, 0, 0] = 1')
        assert.equal(ConwayAlgorithm.calculateCellValue([1, 1, 1, 1, 0, 0]), 0, 
            'calculateCellValue([1, 1, 1, 1, 0, 0, 0, 0, 0] = 0')
        assert.equal(ConwayAlgorithm.calculateCellValue([1, 0, 0, 0, 0, 0]), 0, 
            'calculateCellValue([1, 0, 0, 0, 0, 0, 0, 0, 0] = 0')
    })
})