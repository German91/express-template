const expect = require('expect');

describe('Node Environment', () => {
  it('should return test', () => {
    let env = process.env.NODE_ENV;

    expect(env).toBe('test');
  });
});
