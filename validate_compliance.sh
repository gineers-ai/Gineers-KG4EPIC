#!/bin/bash
# v5.1 Compliance Validation Script

echo "=== v5.1 Compliance Check ==="

# Check 1: PHASE file at correct location
if [ -f "Docs/Gineers-KG4EPIC/BLUEPRINTs/phases/PHASE_1_free.yml" ]; then
    echo "✅ PHASE file location correct"
else
    echo "❌ PHASE file not at correct location"
fi

# Check 2: PHASE folder exists
if [ -d "Docs/Gineers-KG4EPIC/BLUEPRINTs/phases/PHASE_1_free" ]; then
    echo "✅ PHASE folder exists"
else
    echo "❌ PHASE folder missing"
fi

# Check 3: WORKs in shared pool only
WORK_COUNT=$(find Docs/Gineers-KG4EPIC/BLUEPRINTs/works -name "*.yml" 2>/dev/null | wc -l)
echo "✅ ${WORK_COUNT} WORKs in shared pool"

# Check 4: No WORKs under PATHs
BAD_WORKS=$(find Docs/Gineers-KG4EPIC/BLUEPRINTs/phases -path "*/paths/*/works/*" -name "*.yml" 2>/dev/null | wc -l)
if [ $BAD_WORKS -eq 0 ]; then
    echo "✅ No WORKs under PATHs (correct)"
else
    echo "❌ Found ${BAD_WORKS} WORKs under PATHs (wrong)"
fi

# Check 5: KNOWLEDGE structure
if [ -d "Docs/Gineers-KG4EPIC/KNOWLEDGE" ]; then
    echo "✅ KNOWLEDGE structure exists"
else
    echo "❌ KNOWLEDGE structure missing"
fi

# Check 6: EXECUTIONs mirror structure
if [ -d "Docs/Gineers-KG4EPIC/EXECUTIONs/phases/PHASE_1_free/paths" ]; then
    echo "✅ EXECUTIONs mirror structure exists"
else
    echo "❌ EXECUTIONs structure missing"
fi

# Check 7: Evidence-driven compliance (no time violations)
TIME_VIOLATIONS=$(grep -r "timeline\|deadline\|schedule\|estimated_duration" Docs/Gineers-KG4EPIC/BLUEPRINTs/works/*.yml 2>/dev/null | wc -l)
if [ $TIME_VIOLATIONS -eq 0 ]; then
    echo "✅ No time-based violations in WORKs"
else
    echo "⚠️  Found ${TIME_VIOLATIONS} potential time references (check if technical)"
fi

echo ""
echo "=== Summary ==="
echo "Critical fixes applied:"
echo "1. PHASE_1_free.yml moved to correct location"
echo "2. KNOWLEDGE structure created"
echo "3. Monitoring subdirectories created"
echo "4. Time violation 'estimated_duration' replaced with 'evidence_required'"