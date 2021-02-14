import container, { IContainer } from "../src/container";
import chai from 'chai';

describe('container', () => {
    it('Make sure all dependencies can be resolved', () => {

        Object.keys(container).forEach(x => {
            try {
                const k = x as keyof IContainer;
                container[k];
            } catch (e) {
                chai.assert(false, e.message);
            }
        })
    })
})
