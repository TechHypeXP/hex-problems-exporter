"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockVscode = exports.resetMocks = void 0;
const chai_1 = require("chai");
const sinon = __importStar(require("sinon"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const globals_1 = require("@jest/globals");
// Configure Chai plugins
(0, chai_1.use)(sinon_chai_1.default);
(0, chai_1.use)(chai_as_promised_1.default);
// Safe assignment to global scope
global.expect = chai_1.expect;
const vscode_1 = require("./mocks/vscode");
Object.defineProperty(exports, "mockVscode", { enumerable: true, get: function () { return vscode_1.mockVscode; } });
globals_1.jest.mock('vscode', () => vscode_1.mockVscode, { virtual: true });
// Add custom matchers
chai_1.expect.extend({
    toHaveFailed(received) {
        return {
            message: () => `expected ${JSON.stringify(received)} to have failed`,
            pass: received.status === 'failed'
        };
    }
});
// Global test setup
beforeEach(() => {
    globals_1.jest.clearAllMocks();
});
const resetMocks = () => {
    globals_1.jest.resetAllMocks();
};
exports.resetMocks = resetMocks;
afterEach(() => {
    // Restore Sinon sandbox after each test
    sinon.restore();
});
//# sourceMappingURL=setup.js.map