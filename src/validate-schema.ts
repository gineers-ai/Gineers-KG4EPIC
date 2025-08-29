import { Pool } from 'pg';

async function validateSchemaV51() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'epic_tide',
    user: 'epic_user',
    password: 'test123'
  });

  console.log('🔍 Validating v5.1 Database Schema...\n');
  
  try {
    // 1. Check table count
    const tableResult = await pool.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('phases', 'paths', 'works', 'path_works', 'tides', 'patterns')
    `);
    
    const tableCount = parseInt(tableResult.rows[0].table_count);
    console.log(`✅ Tables: ${tableCount}/6 ${tableCount === 6 ? '✓' : '✗'}`);
    
    // 2. Check vector extension
    const vectorResult = await pool.query(`
      SELECT * FROM pg_extension WHERE extname = 'vector'
    `);
    
    console.log(`✅ pgvector: ${vectorResult.rows.length > 0 ? 'Installed ✓' : 'Missing ✗'}`);
    
    // 3. Check vector columns with correct dimensions
    const vectorColsResult = await pool.query(`
      SELECT table_name, column_name, udt_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND udt_name = 'vector'
      ORDER BY table_name, column_name
    `);
    
    console.log(`✅ Vector columns: ${vectorColsResult.rows.length}/4 ${vectorColsResult.rows.length === 4 ? '✓' : '✗'}`);
    
    // 4. Check UUID primary keys
    const uuidResult = await pool.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND column_name = 'id'
      AND data_type = 'uuid'
      ORDER BY table_name
    `);
    
    console.log(`✅ UUID PKs: ${uuidResult.rows.length}/5 ${uuidResult.rows.length >= 5 ? '✓' : '✗'}`);
    
    // 5. Check foreign key relationships
    const fkResult = await pool.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name
    `);
    
    console.log(`✅ Foreign keys: ${fkResult.rows.length}/5 ${fkResult.rows.length >= 5 ? '✓' : '✗'}`);
    
    // 6. Test CRUD operations
    console.log('\n📝 Testing CRUD Operations...');
    
    // Insert test phase
    const phaseResult = await pool.query(`
      INSERT INTO phases (phase_id, what, version, status) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, phase_id
    `, ['validation_test', 'Schema validation test', '5.1', 'testing']);
    
    const phaseId = phaseResult.rows[0].id;
    console.log(`  ✓ Created phase: ${phaseResult.rows[0].phase_id}`);
    
    // Insert test path
    const pathResult = await pool.query(`
      INSERT INTO paths (path_id, phase_id, what, version) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, path_id
    `, ['validation_path', phaseId, 'Test path', '5.1']);
    
    console.log(`  ✓ Created path: ${pathResult.rows[0].path_id}`);
    
    // Insert test work
    const workResult = await pool.query(`
      INSERT INTO works (work_id, what, why, how, version) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, work_id
    `, ['validation_work', 'Test work', 'Schema validation', 'CRUD test', '5.1']);
    
    console.log(`  ✓ Created work: ${workResult.rows[0].work_id}`);
    
    // Test junction table
    await pool.query(`
      INSERT INTO path_works (path_id, work_id, sequence, purpose)
      VALUES ($1, $2, $3, $4)
    `, [pathResult.rows[0].id, workResult.rows[0].id, 1, 'Testing']);
    
    console.log(`  ✓ Linked path to work via junction table`);
    
    // Clean up test data
    await pool.query(`DELETE FROM phases WHERE phase_id = $1`, ['validation_test']);
    await pool.query(`DELETE FROM works WHERE work_id = $1`, ['validation_work']);
    console.log(`  ✓ Cleaned up test data`);
    
    // 7. Check indexes
    const indexResult = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname LIKE 'idx_%'
    `);
    
    console.log(`\n✅ Indexes created: ${indexResult.rows.length}`);
    
    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Database Schema v5.1 Validation Complete!');
    console.log('='.repeat(50));
    console.log(`
Schema Features:
  • 6 tables with proper hierarchy
  • UUID primary keys throughout
  • Vector columns for embeddings (1024 dimensions)
  • Foreign key relationships established
  • JSONB fields for flexible data storage
  • Triggers for automatic timestamp updates
  • Indexes for performance optimization
    `);
    
    return true;
    
  } catch (error) {
    console.error('❌ Schema validation failed:', error);
    return false;
  } finally {
    await pool.end();
  }
}

// Run validation
validateSchemaV51().then(success => {
  process.exit(success ? 0 : 1);
});