#!/usr/bin/env node

/**
 * Integration Tests for KG4EPIC v8 MCP Tools
 * Tests all 18+ tools through the /api/tool endpoint
 */

const API_URL = 'http://localhost:3000/api/tool';
const API_KEY = 'your_secure_api_key_here';

// Test data storage
const testData = {
  blueprintId: null,
  blueprintSlug: 'test-integration-' + Date.now(),
  executionId: null,
  patternId: null
};

// Test counters
let passedTests = 0;
let failedTests = 0;
const testResults = [];

// Helper function to make API calls
async function callTool(tool, args = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({ tool, arguments: args })
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// Test runner
async function runTest(testId, description, testFn) {
  process.stdout.write(`[${testId}] ${description}... `);
  try {
    await testFn();
    console.log('✅ PASS');
    passedTests++;
    testResults.push({ id: testId, description, status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL: ${error.message}`);
    failedTests++;
    testResults.push({ id: testId, description, status: 'FAIL', error: error.message });
  }
}

// Assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// === BLUEPRINT TESTS ===
async function testBlueprints() {
  console.log('\n=== BLUEPRINT TESTS ===');
  
  // BP-001: Create blueprint
  await runTest('BP-001', 'Create blueprint with embeddings', async () => {
    const result = await callTool('blueprint-create', {
      slug: testData.blueprintSlug,
      name: 'Integration Test Blueprint',
      yaml_content: 'BLUEPRINT:\n  test: true\n  description: Integration test',
      tags: ['test', 'integration']
    });
    
    assert(result.data.success === true, 'Response not successful');
    assert(result.data.result.blueprint_id, 'No blueprint ID returned');
    assert(result.data.result.content[0].type === 'text', 'Invalid content type');
    testData.blueprintId = result.data.result.blueprint_id;
  });
  
  // BP-002: Get blueprint
  await runTest('BP-002', 'Retrieve by ID and slug', async () => {
    // Test get by ID
    const byId = await callTool('blueprint-get', { id: testData.blueprintId });
    assert(byId.data.success === true, 'Get by ID failed');
    assert(byId.data.result.blueprint.id === testData.blueprintId, 'Wrong blueprint returned');
    
    // Test get by slug
    const bySlug = await callTool('blueprint-get', { slug: testData.blueprintSlug });
    assert(bySlug.data.success === true, 'Get by slug failed');
    assert(bySlug.data.result.blueprint.slug === testData.blueprintSlug, 'Wrong slug returned');
    
    // Test error on not found
    const notFound = await callTool('blueprint-get', { id: '00000000-0000-0000-0000-000000000000' });
    assert(notFound.data.success === false, 'Should fail for non-existent ID');
    assert(notFound.data.error_code === 'ENTITY_NOT_FOUND', 'Wrong error code');
  });
  
  // BP-003: List blueprints
  await runTest('BP-003', 'List with pagination', async () => {
    const result = await callTool('blueprint-list', { limit: 5, offset: 0 });
    assert(result.data.success === true, 'List failed');
    assert(Array.isArray(result.data.result.blueprints), 'Blueprints not an array');
    assert(result.data.result.blueprints.length > 0, 'No blueprints returned');
  });
  
  // BP-004: Update blueprint
  await runTest('BP-004', 'Update existing blueprint', async () => {
    const result = await callTool('blueprint-update', {
      id: testData.blueprintId,
      name: 'Updated Test Blueprint',
      metadata: { updated: true }
    });
    assert(result.data.success === true, 'Update failed');
    assert(result.data.result.content[0].text.includes('updated'), 'Update not confirmed');
  });
  
  // BP-005: Search blueprints
  await runTest('BP-005', 'Semantic search blueprints', async () => {
    const result = await callTool('blueprint-search', {
      query: 'test integration',
      limit: 5
    });
    assert(result.data.success === true, 'Search failed');
    assert(Array.isArray(result.data.result.blueprints), 'Blueprints not an array');
    assert(result.data.result.blueprints.length > 0, 'No blueprints found');
    assert(result.data.result.blueprints[0].similarity !== undefined, 'No similarity score');
  });
}

// === EXECUTION TESTS ===
async function testExecutions() {
  console.log('\n=== EXECUTION TESTS ===');
  
  // EX-001: Create execution
  await runTest('EX-001', 'Create execution with FK to blueprint', async () => {
    const result = await callTool('execution-create', {
      blueprint_id: testData.blueprintId,
      tide_number: 1,
      status: 'in_progress',
      summary: 'Test execution for integration tests'
    });
    
    assert(result.data.success === true, 'Create failed');
    assert(result.data.result.execution_id, 'No execution ID returned');
    testData.executionId = result.data.result.execution_id;
    
    // Test FK constraint
    const badFK = await callTool('execution-create', {
      blueprint_id: '00000000-0000-0000-0000-000000000000',
      tide_number: 1
    });
    assert(badFK.data.success === false, 'Should fail with bad FK');
  });
  
  // EX-002: Get execution
  await runTest('EX-002', 'Retrieve execution', async () => {
    // Get by ID
    const byId = await callTool('execution-get', { id: testData.executionId });
    assert(byId.data.success === true, 'Get by ID failed');
    assert(byId.data.result.execution.id === testData.executionId, 'Wrong execution returned');
    
    // Get by blueprint+tide
    const byTide = await callTool('execution-get', {
      blueprint_id: testData.blueprintId,
      tide_number: 1
    });
    assert(byTide.data.success === true, 'Get by tide failed');
    assert(byTide.data.result.execution.tide_number === 1, 'Wrong tide returned');
  });
  
  // EX-003: Update execution
  await runTest('EX-003', 'Update execution status', async () => {
    const result = await callTool('execution-update', {
      id: testData.executionId,
      status: 'completed',
      content: { test_complete: true }
    });
    assert(result.data.success === true, 'Update failed');
    assert(result.data.result.content[0].text.includes('updated'), 'Update not confirmed');
  });
  
  // EX-004: List executions
  await runTest('EX-004', 'List executions', async () => {
    const result = await callTool('execution-list', {
      blueprint_id: testData.blueprintId
    });
    assert(result.data.success === true, 'List failed');
    assert(Array.isArray(result.data.result.executions), 'Executions not an array');
    assert(result.data.result.executions.length > 0, 'No executions found');
  });
}

// === EVIDENCE TESTS ===
async function testEvidence() {
  console.log('\n=== EVIDENCE TESTS ===');
  
  // EV-001: Add evidence
  await runTest('EV-001', 'Add evidence to execution', async () => {
    const result = await callTool('evidence-add', {
      execution_id: testData.executionId,
      work_key: 'test_work',
      evidence_type: 'test_result',
      content: { test: 'passed' },
      artifacts: { log: 'test.log' }
    });
    assert(result.data.success === true, 'Add evidence failed');
    assert(result.data.result.evidence_id, 'No evidence ID returned');
  });
  
  // EV-002: List evidence
  await runTest('EV-002', 'List evidence for execution', async () => {
    const result = await callTool('evidence-list', {
      execution_id: testData.executionId
    });
    assert(result.data.success === true, 'List failed');
    assert(Array.isArray(result.data.result.evidence), 'Evidence not an array');
    assert(result.data.result.evidence.length > 0, 'No evidence found');
    assert(result.data.result.evidence[0].work_key === 'test_work', 'Wrong evidence returned');
  });
}

// === PATTERN TESTS ===
async function testPatterns() {
  console.log('\n=== PATTERN TESTS ===');
  
  // PT-001: Create pattern
  await runTest('PT-001', 'Create pattern with dual embeddings', async () => {
    const result = await callTool('pattern-create', {
      problem: 'How to test MCP integration endpoints?',
      solution: 'Use automated integration tests with assertions',
      applicability_score: 0.9
    });
    assert(result.data.success === true, 'Create failed');
    assert(result.data.result.pattern_id, 'No pattern ID returned');
    testData.patternId = result.data.result.pattern_id;
  });
  
  // PT-002: Get pattern
  await runTest('PT-002', 'Retrieve and increment usage', async () => {
    const result = await callTool('pattern-get', { id: testData.patternId });
    assert(result.data.success === true, 'Get failed');
    assert(result.data.result.pattern.id === testData.patternId, 'Wrong pattern returned');
    assert(result.data.result.pattern.usage_count >= 1, 'Usage not incremented');
  });
  
  // PT-003: List patterns
  await runTest('PT-003', 'List patterns by score', async () => {
    const result = await callTool('pattern-list', { limit: 10 });
    assert(result.data.success === true, 'List failed');
    assert(Array.isArray(result.data.result.patterns), 'Patterns not an array');
  });
  
  // PT-004: Search patterns
  await runTest('PT-004', 'Semantic search patterns', async () => {
    const result = await callTool('pattern-search', {
      query: 'testing integration',
      search_type: 'both',
      limit: 5
    });
    assert(result.data.success === true, 'Search failed');
    assert(Array.isArray(result.data.result.patterns), 'Patterns not an array');
    if (result.data.result.patterns.length > 0) {
      assert(result.data.result.patterns[0].similarity_score !== undefined, 'No similarity score');
    }
  });
}

// === UTILITY TESTS ===
async function testUtilities() {
  console.log('\n=== UTILITY TESTS ===');
  
  // UT-001: Health check
  await runTest('UT-001', 'Check system health', async () => {
    const result = await callTool('health-check');
    assert(result.data.success === true, 'Health check failed');
    assert(result.data.result.status.database === 'healthy', 'Database not healthy');
    assert(result.data.result.content[0].type === 'text', 'Invalid content type');
  });
  
  // UT-002: Semantic search
  await runTest('UT-002', 'Cross-entity semantic search', async () => {
    const result = await callTool('search-semantic', {
      query: 'test',
      entity_types: ['blueprints', 'patterns'],
      limit: 10
    });
    assert(result.data.success === true, 'Search failed');
    assert(result.data.result.total_found >= 0, 'Invalid result count');
  });
  
  // UT-003: Unknown tool
  await runTest('UT-003', 'Test unknown tool handling', async () => {
    const result = await callTool('unknown-tool', {});
    assert(result.data.success === false, 'Should fail for unknown tool');
    assert(result.data.error_code === 'TOOL_NOT_FOUND', 'Wrong error code');
  });
}

// === CLEANUP ===
async function cleanup() {
  console.log('\n=== CLEANUP ===');
  // Note: In production, we might want to delete test data
  // For now, we keep it for verification
  console.log('Test data preserved for verification');
  console.log(`Blueprint ID: ${testData.blueprintId}`);
  console.log(`Execution ID: ${testData.executionId}`);
  console.log(`Pattern ID: ${testData.patternId}`);
}

// === MAIN TEST RUNNER ===
async function runAllTests() {
  console.log('================================================');
  console.log('KG4EPIC v8 PHASE_1 Integration Tests');
  console.log('================================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`Starting tests at: ${new Date().toISOString()}`);
  
  try {
    // Check if API is running
    const health = await callTool('health-check');
    if (!health.data || !health.data.success) {
      console.error('❌ API is not responding. Please ensure Docker containers are running.');
      process.exit(1);
    }
    
    // Run all test suites
    await testBlueprints();
    await testExecutions();
    await testEvidence();
    await testPatterns();
    await testUtilities();
    await cleanup();
    
    // Print summary
    console.log('\n================================================');
    console.log('TEST SUMMARY');
    console.log('================================================');
    console.log(`Total Tests: ${passedTests + failedTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
    
    // Save results
    const fs = require('fs');
    const resultsFile = 'test/integration/test-results.json';
    fs.writeFileSync(resultsFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total: passedTests + failedTests,
        passed: passedTests,
        failed: failedTests,
        successRate: ((passedTests / (passedTests + failedTests)) * 100).toFixed(1) + '%'
      },
      results: testResults,
      testData: testData
    }, null, 2));
    console.log(`\nResults saved to: ${resultsFile}`);
    
    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();