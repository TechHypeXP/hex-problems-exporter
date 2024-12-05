/**
 * Utility functions for performance testing
 */

export interface PerformanceMetrics {
    executionTimeMs: number;
    memoryUsageMB: number;
    heapUsedMB: number;
    heapTotalMB: number;
}

export async function measureExecutionTime(
    operation: () => Promise<void>
): Promise<PerformanceMetrics> {
    const startMemory = process.memoryUsage();
    const startTime = process.hrtime.bigint();
    
    await operation();
    
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();

    return {
        executionTimeMs: Number(endTime - startTime) / 1_000_000,
        memoryUsageMB: (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024,
        heapUsedMB: endMemory.heapUsed / 1024 / 1024,
        heapTotalMB: endMemory.heapTotal / 1024 / 1024
    };
}

export function logPerformanceMetrics(
    operation: string,
    metrics: PerformanceMetrics
): void {
    console.log(`
Performance Metrics for: ${operation}
--------------------------------
Execution Time: ${metrics.executionTimeMs.toFixed(2)}ms
Memory Usage:
  - Heap Used: ${metrics.heapUsedMB.toFixed(2)}MB
  - Heap Total: ${metrics.heapTotalMB.toFixed(2)}MB
    `);
}
