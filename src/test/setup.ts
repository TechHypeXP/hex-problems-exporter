import { expect, use, Assertion } from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import type { OutputChannel, WorkspaceConfiguration } from 'vscode';

// Type augmentation for Chai
declare global {
  namespace Chai {
    interface Assertion {
      extend(matchers: Record<string, unknown>): void;
    }
  }
}

// Configure Chai plugins
use(sinonChai);
use(chaiAsPromised);
(global as typeof globalThis).expect = expect;

export interface MockOutputChannel extends OutputChannel {
  append: Mock<(value: string) => void>;
  appendLine: Mock<(value: string) => void>;
  clear: Mock<() => void>;
  show: Mock<() => void>;
}

export interface MockWorkspace {
  getConfiguration: Mock<(section?: string) => WorkspaceConfiguration>;
}

export interface MockWindow {
  createOutputChannel: Mock<((name: string) => MockOutputChannel)>;
  showErrorMessage: Mock<((message: string) => Promise<string>)>;
  showInformationMessage: Mock<((message: string) => Promise<string>)>;
}

import { mockVscode } from './mocks/vscode';

jest.mock('vscode', () => mockVscode, { virtual: true });

// Add custom matchers
expect.extend({
  toHaveFailed(received: { status: string; }): boolean {
    return {
      message: () => `expected ${JSON.stringify(received)} to have failed`,
      pass: received.status === 'failed'
    };
  }
});

// Global test setup
beforeEach((): void => {
  jest.clearAllMocks();
});

export const resetMocks = (): void => {
  jest.resetAllMocks();
};

afterEach(() => {
  // Restore Sinon sandbox after each test
  sinon.restore();
});

export {
  mockVscode
};
