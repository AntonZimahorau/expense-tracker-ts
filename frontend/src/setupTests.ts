import '@testing-library/jest-dom';

const origWarn = console.warn;
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const msg = String(args[0] ?? '');
    if (msg.includes('v7_relativeSplatPath')) return;
    origWarn(...(args as any));
  });
});

jest.mock('axios');
