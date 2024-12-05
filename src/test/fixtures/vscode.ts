import { jest } from '@jest/globals';
import type { VSCodeOutputChannel, VSCodeWindow, VSCodeWorkspace } from '../../infrastructure/vscode/types';

const createMockOutputChannel = (): VSCodeOutputChannel => ({
  append: jest.fn(),
  appendLine: jest.fn(),
  clear: jest.fn(),
  show: jest.fn(),
  dispose: jest.fn(),
  hide: jest.fn(),
  name: 'mock-channel'
});

const createMockWindow = (): VSCodeWindow => ({
  createOutputChannel: jest.fn().mockReturnValue(createMockOutputChannel()),
  showErrorMessage: jest.fn().mockResolvedValue(''),
  showInformationMessage: jest.fn().mockResolvedValue('')
});

const createMockWorkspace = (): VSCodeWorkspace => ({
  getConfiguration: jest.fn()
});

export const mockVSCode = {
  window: createMockWindow(),
  workspace: createMockWorkspace()
};
