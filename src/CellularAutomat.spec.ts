import { expect, assert } from 'chai';
import {
    Endless2DUniverse, 
    EvolutionAlgorithm, 
    ConwayAlgorithm, 
    Cell2D
} from "./CellularAutomat";

describe('Endless2DUniverse', () => {
    it('should initialize properly', () => {
        const u = new Endless2DUniverse(20, 20);
        expect(u.width).to.equal(20)
        expect(u.height).to.equal(20)
        expect(u.getCells().length).to.equal(400)
    });
});

describe('cycle function', () => {
    it('should calculate correctly', () => {
        const testData = [
            [5, 10, 5],
            [10, 10, 0],
            [14, 10, 4],
            [0, 10, 0],
            [0, 1, 0],
            [1, 1, 0],
            [-1, 10, 9],
            [-8, 10, 2],
            [-12, 10, 8]
        ]
        testData.forEach(([value, max, expected]) => {
            expect(Endless2DUniverse.cycle(value, max), 
              `cycle(${value}, ${max})`).to.equal(expected) 
        });
        
        assert(isNaN(Endless2DUniverse.cycle(0,   0)), "cycle(0,   0) = NaN")
    });
});