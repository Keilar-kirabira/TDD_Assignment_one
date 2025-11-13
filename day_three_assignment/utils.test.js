const utils = require('./utils');

describe('Exact equality matchers', () =>{
    test('sum(2,2) toBe 4 (pass)',() =>{
        expect(utils.sum(2, 2)).toBe(4);
    });
    test('sum(2,2) toBe 5 (fail)', () => {
        expect(utils.sum(2, 2)).toBe(5);
    });

     test('createUser() toEqual expected object (pass)', () => {
    const fixedDate = new Date('2020-01-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
    expect(utils.createUser('Alice', 30)).toEqual({
      name: 'Alice',
      age: 30,
      createdAt: fixedDate,
    });
    global.Date.mockRestore();
  });
    test('createUser() toEqual wrong object (fail)', () => {
    const fixedDate = new Date('2020-01-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

    expect(utils.createUser('Alice', 30)).toEqual({
      name: 'Alice',
      age: 25,
      createdAt: fixedDate,
    });

    global.Date.mockRestore();
  });

   test('toStrictEqual passes with identical array', () => {
    expect([1, 2, 3]).toStrictEqual([1, 2, 3]);
  });

  test('toStrictEqual fails with sparse array', () => {
    expect([, 2, 3]).toStrictEqual([undefined, 2, 3]);
  });
});


describe('Negation matchers', () => {
 test('sum(1,1) not toBe 3 (pass)', () => {
    expect(utils.sum(1, 1)).not.toBe(3);
  });

  test('sum(1,1) not toBe 2 (fail)', () => {
    expect(utils.sum(1, 1)).not.toBe(2);
  });

  test('string not.toMatch (pass)', () => {
    expect('Hello World').not.toMatch(/bye/i);
  });

  test('string not.toMatch (fail)', () => {
    expect('Hello World').not.toMatch(/hello/i);
  });
});

describe('Truthiness matchers', () => {
  test('toBeNull (pass)', () => {
    const value = null;
    expect(value).toBeNull();
  });

  test('toBeNull (fail)', () => {
    expect('not null').toBeNull();
  });

  test('toBeUndefined (pass)', () => {
    let x;
    expect(x).toBeUndefined();
  });

  test('toBeUndefined (fail)', () => {
    const y = 10;
    expect(y).toBeUndefined();
  });

  test('toBeDefined (pass)', () => {
    const z = 1;
    expect(z).toBeDefined();
  });

  test('toBeDefined (fail)', () => {
    let a;
    expect(a).toBeDefined();
  });

  test('toBeTruthy (pass)', () => {
    expect(utils.findInArray([1, 2, 3], 2)).toBeTruthy();
  });

  test('toBeTruthy (fail)', () => {
    expect(utils.findInArray([], 2)).toBeTruthy();
  });

  test('toBeFalsy (pass)', () => {
    expect(utils.findInArray([1, 2, 3], 9)).toBeFalsy();
  });

  test('toBeFalsy (fail)', () => {
    expect(utils.findInArray([1, 2, 3], 1)).toBeFalsy();
  });
});

describe('Number matchers', () => {
  test('toBeGreaterThan (pass)', () => {
    expect(utils.sum(2, 3)).toBeGreaterThan(4);
  });

  test('toBeGreaterThan (fail)', () => {
    expect(utils.sum(2, 3)).toBeGreaterThan(10);
  });

  test('toBeLessThanOrEqual (pass)', () => {
    expect(utils.approximateDivision(10, 2)).toBeLessThanOrEqual(5);
  });

  test('toBeLessThanOrEqual (fail)', () => {
    expect(utils.approximateDivision(10, 2)).toBeLessThanOrEqual(3);
  });

  test('toBeCloseTo (pass)', () => {
    expect(utils.approximateDivision(0.3, 0.1)).toBeCloseTo(3);
  });

  test('toBeCloseTo (fail)', () => {
    expect(utils.approximateDivision(0.3, 0.1)).toBeCloseTo(5);
  });
});

describe('String matchers', () => {
  test('toMatch regex (pass)', () => {
    const user = utils.createUser('Alice', 25);
    expect(user.name).toMatch(/^A/);
  });

  test('toMatch regex (fail)', () => {
    const user = utils.createUser('Bob', 25);
    expect(user.name).toMatch(/^A/);
  });

  test('not.toMatch (pass)', () => {
    expect('Testing123').not.toMatch(/abc/);
  });

  test('not.toMatch (fail)', () => {
    expect('Hello123').not.toMatch(/Hello/);
  });
});


describe('Iterable matchers', () => {
  const users = ['Alice', 'Bob', 'Carol'];

  test('toContain (pass)', () => {
    expect(users).toContain('Bob');
  });

  test('toContain (fail)', () => {
    expect(users).toContain('Dave');
  });

  test('toContain with Set (pass)', () => {
    const set = new Set([1, 2, 3]);
    expect(set).toContain(2);
  });

  test('toContain with Set (fail)', () => {
    const set = new Set([1, 2, 3]);
    expect(set).toContain(5);
  });
});

describe('Exception matchers', () => {
  test('parseJSON throws error (pass)', () => {
    expect(() => utils.parseJSON('invalid JSON')).toThrow();
  });

  test('parseJSON does not throw for valid JSON (fail)', () => {
    expect(() => utils.parseJSON('{"name":"Alice"}')).toThrow();
  });
});