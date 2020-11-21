
QUnit.module('Endless2DUniverse', function() {
    QUnit.test('init', function(assert) {
        const u = new Endless2DUniverse(20, 20)
        assert.equal(u.width, 20, 'width = 20')
        assert.equal(u.height, 20, 'height = 20')
        assert.equal(u.getCells().length, 400, 'count of cells = 400')
    })
    QUnit.test('cycle', function(assert) {
        assert.equal(Endless2DUniverse.cycle(5,  10),  5)
        assert.equal(Endless2DUniverse.cycle(10, 10),  0)
        assert.equal(Endless2DUniverse.cycle(14, 10),  4)
        assert.equal(Endless2DUniverse.cycle(0,  10),  0)
        assert.true(isNaN(Endless2DUniverse.cycle(0,   0)))
        assert.equal(Endless2DUniverse.cycle(0,   1),  0)
        assert.equal(Endless2DUniverse.cycle(1,   1),  0)
    })
});