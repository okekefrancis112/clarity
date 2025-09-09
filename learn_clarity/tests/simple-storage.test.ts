import { describe, it, expect, beforeEach } from 'vitest';

describe('Simple Storage Contract', () => {
  let deployer: string;

  beforeEach(() => {
    const { simnet } = globalThis;
    const accounts = simnet.getAccounts();
    deployer = accounts.get('deployer')!;
  });

  it('Can set and get string value', () => {
    const { simnet } = globalThis;
    const testValue = 'Hello, World!';

    const block = simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-value',
        args: [simnet.types.utf8(testValue)],
        sender: deployer
      }
    ]);

    expect(block[0].result).toBeOk(expect.toBeBool(true));

    const result = simnet.callReadOnlyFn('simple-storage', 'get-value', [], deployer);
    expect(result.result).toBeOk(expect.toBeUtf8(testValue));
  });

  it('Can set and get number value', () => {
    const { simnet } = globalThis;
    const testNumber = 42;

    const block = simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-number',
        args: [simnet.types.uint(testNumber)],
        sender: deployer
      }
    ]);

    expect(block[0].result).toBeOk(expect.toBeBool(true));

    const result = simnet.callReadOnlyFn('simple-storage', 'get-number', [], deployer);
    expect(result.result).toBeOk(expect.toBeUint(testNumber));
  });

  it('Multiple value updates work correctly', () => {
    const { simnet } = globalThis;

    simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-value',
        args: [simnet.types.utf8('First Value')],
        sender: deployer
      },
      {
        contract: 'simple-storage',
        method: 'set-number',
        args: [simnet.types.uint(100)],
        sender: deployer
      }
    ]);

    simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-value',
        args: [simnet.types.utf8('Updated Value')],
        sender: deployer
      },
      {
        contract: 'simple-storage',
        method: 'set-number',
        args: [simnet.types.uint(200)],
        sender: deployer
      }
    ]);

    const stringResult = simnet.callReadOnlyFn('simple-storage', 'get-value', [], deployer);
    expect(stringResult.result).toBeOk(expect.toBeUtf8('Updated Value'));

    const numberResult = simnet.callReadOnlyFn('simple-storage', 'get-number', [], deployer);
    expect(numberResult.result).toBeOk(expect.toBeUint(200));
  });

  it('Empty string value works correctly', () => {
    const { simnet } = globalThis;

    const block = simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-value',
        args: [simnet.types.utf8('')],
        sender: deployer
      }
    ]);

    expect(block[0].result).toBeOk(expect.toBeBool(true));

    const result = simnet.callReadOnlyFn('simple-storage', 'get-value', [], deployer);
    expect(result.result).toBeOk(expect.toBeUtf8(''));
  });

  it('Zero number value works correctly', () => {
    const { simnet } = globalThis;

    const block = simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-number',
        args: [simnet.types.uint(0)],
        sender: deployer
      }
    ]);

    expect(block[0].result).toBeOk(expect.toBeBool(true));

    const result = simnet.callReadOnlyFn('simple-storage', 'get-number', [], deployer);
    expect(result.result).toBeOk(expect.toBeUint(0));
  });

  it('Maximum uint value works correctly', () => {
    const { simnet } = globalThis;
    const maxUint = BigInt('340282366920938463463374607431768211455'); // 2^128 - 1

    const block = simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-number',
        args: [simnet.types.uint(maxUint)],
        sender: deployer
      }
    ]);

    expect(block[0].result).toBeOk(expect.toBeBool(true));

    const result = simnet.callReadOnlyFn('simple-storage', 'get-number', [], deployer);
    expect(result.result).toBeOk(expect.toBeUint(maxUint));
  });

  it('Long string within limit works correctly', () => {
    const { simnet } = globalThis;
    const longString = 'A'.repeat(95);

    const block = simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-value',
        args: [simnet.types.utf8(longString)],
        sender: deployer
      }
    ]);

    expect(block[0].result).toBeOk(expect.toBeBool(true));

    const result = simnet.callReadOnlyFn('simple-storage', 'get-value', [], deployer);
    expect(result.result).toBeOk(expect.toBeUtf8(longString));
  });

  it('String exceeding 100 bytes should fail', () => {
    const { simnet } = globalThis;
    const tooLongString = 'A'.repeat(101);

    const block = simnet.mineBlock([
      {
        contract: 'simple-storage',
        method: 'set-value',
        args: [simnet.types.utf8(tooLongString)],
        sender: deployer
      }
    ]);

    expect(block[0].result).toBeErr();
  });
});