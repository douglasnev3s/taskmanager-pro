import { Task, TaskStatus, TaskPriority, AdvancedSearchFilters } from '@/types';
import { applyAdvancedFilters } from './task-filters';

interface PerformanceMetrics {
  executionTime: number;
  memoryUsed?: number;
  itemsProcessed: number;
  itemsReturned: number;
  filteringRate: number; // items per millisecond
}

// Generate large dataset for performance testing
export function generateLargeTaskDataset(count: number): Task[] {
  const tasks: Task[] = [];
  const priorities = Object.values(TaskPriority);
  const statuses = Object.values(TaskStatus);
  const sampleTitles = [
    'Complete project documentation',
    'Review code changes',
    'Update API endpoints',
    'Design system improvements',
    'Database optimization',
    'Mobile responsiveness fixes',
    'User testing session',
    'Performance monitoring setup',
    'Security audit',
    'Accessibility improvements',
    'Bug fixes and improvements',
    'Feature implementation',
    'UI/UX enhancements',
    'Testing and QA',
    'Deployment and DevOps',
  ];
  
  const sampleDescriptions = [
    'Detailed description of the task requirements and acceptance criteria.',
    'Implementation notes and technical specifications for the development team.',
    'User story with clear acceptance criteria and edge cases to consider.',
    'Research task requiring investigation and documentation of findings.',
    'Maintenance task for keeping the system up to date and secure.',
  ];

  const sampleTags = [
    'frontend', 'backend', 'api', 'ui/ux', 'design', 'security', 'performance',
    'mobile', 'testing', 'documentation', 'bug', 'feature', 'enhancement',
    'urgent', 'review', 'research', 'maintenance', 'deployment', 'monitoring',
  ];

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    // Random due date (some tasks won't have due dates)
    const hasDueDate = Math.random() > 0.3;
    const dueDate = hasDueDate 
      ? new Date(Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000)
      : undefined;

    // Random tags (0-5 tags per task)
    const taskTagCount = Math.floor(Math.random() * 6);
    const taskTags = Array.from({ length: taskTagCount }, () => 
      sampleTags[Math.floor(Math.random() * sampleTags.length)]
    ).filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates

    tasks.push({
      id: `task-${i + 1}`,
      title: `${sampleTitles[Math.floor(Math.random() * sampleTitles.length)]} ${i + 1}`,
      description: Math.random() > 0.2 ? sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)] : undefined,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      dueDate: dueDate?.toISOString(),
      tags: taskTags,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  }

  return tasks;
}

// Measure filtering performance
export function measureFilteringPerformance(
  tasks: Task[],
  filters: AdvancedSearchFilters,
  iterations: number = 1
): PerformanceMetrics {
  const startTime = performance.now();
  const startMemory = (performance as any).memory?.usedJSHeapSize;

  let filteredTasks: Task[] = [];
  
  // Run filtering multiple times for more accurate measurement
  for (let i = 0; i < iterations; i++) {
    filteredTasks = applyAdvancedFilters(tasks, filters);
  }

  const endTime = performance.now();
  const endMemory = (performance as any).memory?.usedJSHeapSize;
  
  const executionTime = endTime - startTime;
  const memoryUsed = startMemory && endMemory ? endMemory - startMemory : undefined;
  
  return {
    executionTime,
    memoryUsed,
    itemsProcessed: tasks.length * iterations,
    itemsReturned: filteredTasks.length,
    filteringRate: (tasks.length * iterations) / executionTime,
  };
}

// Performance test suite
export class PerformanceTestSuite {
  private testResults: Array<{
    testName: string;
    datasetSize: number;
    filters: AdvancedSearchFilters;
    metrics: PerformanceMetrics;
  }> = [];

  addTest(
    testName: string,
    datasetSize: number,
    filters: AdvancedSearchFilters,
    iterations: number = 5
  ) {
    console.log(`Running performance test: ${testName} (${datasetSize} items)`);
    
    const tasks = generateLargeTaskDataset(datasetSize);
    const metrics = measureFilteringPerformance(tasks, filters, iterations);
    
    this.testResults.push({
      testName,
      datasetSize,
      filters,
      metrics,
    });

    console.log(`Test completed: ${metrics.executionTime.toFixed(2)}ms, ${metrics.filteringRate.toFixed(0)} items/ms`);
  }

  runStandardTests() {
    console.log('Starting performance test suite...');

    // Test 1: Text search on small dataset
    this.addTest('Text Search - Small Dataset', 1000, {
      text: 'documentation',
    });

    // Test 2: Text search on medium dataset
    this.addTest('Text Search - Medium Dataset', 10000, {
      text: 'documentation',
    });

    // Test 3: Text search on large dataset
    this.addTest('Text Search - Large Dataset', 50000, {
      text: 'documentation',
    });

    // Test 4: Complex multi-filter on medium dataset
    this.addTest('Complex Filtering - Medium Dataset', 10000, {
      text: 'implementation',
      status: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
      priority: [TaskPriority.HIGH],
      tags: ['frontend', 'urgent'],
      isOverdue: true,
    });

    // Test 5: Date range filtering on large dataset
    this.addTest('Date Range Filtering - Large Dataset', 50000, {
      dueDateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Test 6: Tag filtering on large dataset
    this.addTest('Tag Filtering - Large Dataset', 50000, {
      tags: ['frontend', 'backend', 'api'],
    });

    console.log('Performance test suite completed!');
  }

  getResults() {
    return this.testResults;
  }

  printResults() {
    console.log('\n=== Performance Test Results ===');
    this.testResults.forEach(result => {
      console.log(`\n${result.testName}:`);
      console.log(`  Dataset Size: ${result.datasetSize.toLocaleString()} tasks`);
      console.log(`  Execution Time: ${result.metrics.executionTime.toFixed(2)}ms`);
      console.log(`  Items Returned: ${result.metrics.itemsReturned.toLocaleString()}`);
      console.log(`  Filtering Rate: ${result.metrics.filteringRate.toFixed(0)} items/ms`);
      if (result.metrics.memoryUsed !== undefined) {
        console.log(`  Memory Used: ${(result.metrics.memoryUsed / 1024 / 1024).toFixed(2)}MB`);
      }
    });
  }

  getBenchmarkReport(): string {
    let report = '# Advanced Search Performance Report\n\n';
    
    report += '| Test | Dataset Size | Execution Time | Items Returned | Rate (items/ms) |\n';
    report += '|------|-------------|---------------|---------------|----------------|\n';
    
    this.testResults.forEach(result => {
      report += `| ${result.testName} | ${result.datasetSize.toLocaleString()} | ${result.metrics.executionTime.toFixed(2)}ms | ${result.metrics.itemsReturned.toLocaleString()} | ${result.metrics.filteringRate.toFixed(0)} |\n`;
    });

    report += '\n## Performance Analysis\n\n';
    
    const avgRate = this.testResults.reduce((sum, result) => 
      sum + result.metrics.filteringRate, 0) / this.testResults.length;
    
    report += `- Average filtering rate: ${avgRate.toFixed(0)} items/ms\n`;
    report += `- Total tests run: ${this.testResults.length}\n`;
    report += `- Largest dataset tested: ${Math.max(...this.testResults.map(r => r.datasetSize)).toLocaleString()} items\n`;

    return report;
  }
}

// Utility to check if performance is acceptable
export function isPerformanceAcceptable(metrics: PerformanceMetrics): boolean {
  // Consider performance acceptable if we can process at least 1000 items per millisecond
  return metrics.filteringRate >= 1000;
}

// Quick performance test for development
export function quickPerformanceTest(): void {
  console.log('Running quick performance test...');
  
  const tasks = generateLargeTaskDataset(10000);
  const filters: AdvancedSearchFilters = {
    text: 'implementation',
    status: [TaskStatus.TODO],
    priority: [TaskPriority.HIGH],
  };
  
  const metrics = measureFilteringPerformance(tasks, filters);
  
  console.log('Quick test results:', {
    executionTime: `${metrics.executionTime.toFixed(2)}ms`,
    itemsProcessed: metrics.itemsProcessed.toLocaleString(),
    itemsReturned: metrics.itemsReturned.toLocaleString(),
    filteringRate: `${metrics.filteringRate.toFixed(0)} items/ms`,
    performanceAcceptable: isPerformanceAcceptable(metrics),
  });
}