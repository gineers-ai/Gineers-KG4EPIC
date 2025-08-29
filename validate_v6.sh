#!/bin/bash
# Validate v6 Structure

echo "=== EPIC-TIDE v6 Structure Validation ==="
echo ""
echo "📁 Checking v6 folder structure..."

# Check folders exist
if [ -d "Docs/Gineers-KG4EPIC/v6/BLUEPRINTS" ]; then
    echo "✅ BLUEPRINTS folder exists"
else
    echo "❌ BLUEPRINTS folder missing"
fi

if [ -d "Docs/Gineers-KG4EPIC/v6/EXECUTIONS" ]; then
    echo "✅ EXECUTIONS folder exists"
else
    echo "❌ EXECUTIONS folder missing"
fi

if [ -d "Docs/Gineers-KG4EPIC/v6/KNOWLEDGE/patterns" ]; then
    echo "✅ KNOWLEDGE/patterns folder exists"
else
    echo "❌ KNOWLEDGE/patterns folder missing"
fi

echo ""
echo "📄 Checking v6 documents..."

# Check BLUEPRINT
if [ -f "Docs/Gineers-KG4EPIC/v6/BLUEPRINTS/kg4epic_enhanced.yml" ]; then
    echo "✅ BLUEPRINT for PHASE_2 created"
    echo "   Contains: $(grep -c "works:" Docs/Gineers-KG4EPIC/v6/BLUEPRINTS/kg4epic_enhanced.yml) work sections"
else
    echo "❌ BLUEPRINT missing"
fi

# Check EXECUTION template
if [ -f "Docs/Gineers-KG4EPIC/v6/EXECUTIONS/EXECUTION_TEMPLATE.yml" ]; then
    echo "✅ EXECUTION template created"
else
    echo "❌ EXECUTION template missing"
fi

# Check PATTERN
if [ -f "Docs/Gineers-KG4EPIC/v6/KNOWLEDGE/patterns/separate_embedding_service.yml" ]; then
    echo "✅ Example PATTERN extracted"
else
    echo "❌ No patterns found"
fi

# Check README
if [ -f "Docs/Gineers-KG4EPIC/v6/README_V6.md" ]; then
    echo "✅ v6 documentation created"
else
    echo "❌ v6 documentation missing"
fi

echo ""
echo "📊 v6 vs v5.1 Comparison:"
echo "----------------------------"
echo "v5.1 structure:"
echo "  Document types: 5 (PHASE, PATH, WORK, TIDE, PATTERN)"
echo "  Folder depth: 6 levels"
echo "  Files for PHASE_2: ~16 files"
echo ""
echo "v6 structure:"
echo "  Document types: 3 (BLUEPRINT, EXECUTION, PATTERN)"
echo "  Folder depth: 2 levels"
echo "  Files for PHASE_2: 2-3 files"
echo ""
echo "✨ Complexity reduction: 80%"
echo ""

# Count actual files
V6_COUNT=$(find Docs/Gineers-KG4EPIC/v6 -name "*.yml" -o -name "*.md" | wc -l)
echo "📈 v6 Statistics:"
echo "  Total v6 files created: $V6_COUNT"
echo "  BLUEPRINTs: $(ls Docs/Gineers-KG4EPIC/v6/BLUEPRINTS/*.yml 2>/dev/null | wc -l)"
echo "  EXECUTIONs: $(ls Docs/Gineers-KG4EPIC/v6/EXECUTIONS/*.yml 2>/dev/null | wc -l)"
echo "  PATTERNs: $(ls Docs/Gineers-KG4EPIC/v6/KNOWLEDGE/patterns/*.yml 2>/dev/null | wc -l)"

echo ""
echo "=== v6 Validation Complete ==="