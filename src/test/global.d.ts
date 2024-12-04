// Type declarations for global test utilities
declare global {
  const expect: Chai.ExpectStatic & {
    extend(matchers: { [key: string]: unknown }): void;
  };
}

export {};
