import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const API_KEY = 'your_secure_api_key_here';

async function testSemanticSearch() {
  console.log('🧪 Testing Semantic Search with Real E5-large Embeddings\n');
  
  try {
    // 1. First, create some test works with embeddings
    console.log('1️⃣ Creating test works...');
    
    const testWorks = [
      {
        work_id: 'setup-nodejs-typescript',
        what: 'Setup Node.js project with TypeScript and Express',
        why: 'Need a robust backend API server with type safety',
        how: 'Initialize npm, install TypeScript, configure tsconfig, add Express'
      },
      {
        work_id: 'implement-authentication',
        what: 'Implement JWT authentication system',
        why: 'Secure API endpoints and manage user sessions',
        how: 'Use jsonwebtoken library, create auth middleware, store tokens securely'
      },
      {
        work_id: 'database-migration',
        what: 'Create database migration system for PostgreSQL',
        why: 'Manage schema changes across environments',
        how: 'Use migration scripts, version control schema, rollback support'
      },
      {
        work_id: 'docker-deployment',
        what: 'Configure Docker containers for microservices',
        why: 'Consistent deployment across different environments',
        how: 'Create Dockerfile, docker-compose.yml, network configuration'
      }
    ];
    
    for (const work of testWorks) {
      const response = await axios.post(
        `${API_URL}/work.save`,
        work,
        { headers: { 'X-API-Key': API_KEY } }
      );
      console.log(`  ✅ Created: ${work.work_id}`);
    }
    
    // Wait a bit for embeddings to be generated
    console.log('\n⏳ Waiting for embeddings generation...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. Test semantic search
    console.log('\n2️⃣ Testing semantic search...');
    
    const searchQueries = [
      { query: 'initialize nodejs application', expectedMatch: 'setup-nodejs-typescript' },
      { query: 'security and authentication', expectedMatch: 'implement-authentication' },
      { query: 'database schema management', expectedMatch: 'database-migration' },
      { query: 'container orchestration', expectedMatch: 'docker-deployment' }
    ];
    
    for (const test of searchQueries) {
      console.log(`\n  🔍 Query: "${test.query}"`);
      
      const searchResponse = await axios.post(
        `${API_URL}/search.semantic`,
        {
          query: test.query,
          entity_type: 'work',
          limit: 3,
          threshold: 0.5
        },
        { headers: { 'X-API-Key': API_KEY } }
      );
      
      if (searchResponse.data.success) {
        const results = searchResponse.data.results;
        console.log(`     Found ${results.length} results:`);
        
        results.forEach((result: any, index: number) => {
          const match = result.work_id === test.expectedMatch ? '✅' : '  ';
          console.log(`     ${match} ${index + 1}. ${result.work_id} (similarity: ${result.similarity.toFixed(3)})`);
        });
        
        if (results.length > 0 && results[0].work_id === test.expectedMatch) {
          console.log(`     ✅ Best match is correct!`);
        }
      } else {
        console.log(`     ❌ Search failed: ${searchResponse.data.error}`);
      }
    }
    
    // 3. Test hybrid search
    console.log('\n3️⃣ Testing hybrid search...');
    
    const hybridResponse = await axios.post(
      `${API_URL}/search.hybrid`,
      {
        query: 'typescript node setup',
        limit: 5
      },
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    if (hybridResponse.data.success) {
      console.log(`  Found ${hybridResponse.data.results.length} results:`);
      hybridResponse.data.results.forEach((result: any, index: number) => {
        console.log(`  ${index + 1}. ${result.work_id}`);
        console.log(`     Combined score: ${result.combined_score.toFixed(3)}`);
        console.log(`     Semantic: ${result.semantic_score?.toFixed(3) || 'N/A'}, Keyword: ${result.keyword_score?.toFixed(3) || 'N/A'}`);
      });
    }
    
    // 4. Check search health
    console.log('\n4️⃣ Checking search health...');
    const healthResponse = await axios.get(
      `${API_URL}/search.health`,
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    console.log('  Search service status:');
    console.log(`  • Embeddings service: ${healthResponse.data.embeddings_service}`);
    console.log(`  • Indexed works: ${healthResponse.data.indexed_works}`);
    console.log(`  • Ready: ${healthResponse.data.ready ? '✅' : '❌'}`);
    
    console.log('\n✅ Semantic search testing complete!');
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testSemanticSearch();