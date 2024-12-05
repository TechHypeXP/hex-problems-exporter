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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormatter = exports.supportedFormats = exports.formatters = exports.formatXlsx = exports.formatCsv = exports.formatJson = exports.formatMarkdown = void 0;
const markdownFormatter_1 = require("./markdownFormatter");
Object.defineProperty(exports, "formatMarkdown", { enumerable: true, get: function () { return markdownFormatter_1.formatMarkdown; } });
const jsonFormatter_1 = require("./jsonFormatter");
Object.defineProperty(exports, "formatJson", { enumerable: true, get: function () { return jsonFormatter_1.formatJson; } });
const csvFormatter_1 = require("./csvFormatter");
Object.defineProperty(exports, "formatCsv", { enumerable: true, get: function () { return csvFormatter_1.formatCsv; } });
const xlsxFormatter_1 = require("./xlsxFormatter");
Object.defineProperty(exports, "formatXlsx", { enumerable: true, get: function () { return xlsxFormatter_1.formatXlsx; } });
__exportStar(require("./base/BaseFormatter"), exports);
exports.formatters = {
    markdown: markdownFormatter_1.formatMarkdown,
    json: jsonFormatter_1.formatJson,
    csv: csvFormatter_1.formatCsv,
    xlsx: xlsxFormatter_1.formatXlsx
};
exports.supportedFormats = Object.keys(exports.formatters);
function getFormatter(format) {
    const lowercaseFormat = format.toLowerCase();
    if (!(lowercaseFormat in exports.formatters)) {
        throw new Error(`Unsupported format: ${format}`);
    }
    return exports.formatters[lowercaseFormat];
}
exports.getFormatter = getFormatter;
//# sourceMappingURL=index.js.map