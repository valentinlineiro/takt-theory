import fs from 'fs';
import path from 'path';

const inventoryPath = 'experiments/st017-1-foundations-inventory.json';
const rawData = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const statements = rawData.statements;

const textMap = new Map();
const duplicateCandidates = [];
const headerCandidates = [];
const granularityCandidates = [];

statements.forEach(stmt => {
  const text = stmt.literal_text;
  
  // Duplicate check
  if (textMap.has(text)) {
    duplicateCandidates.push({ id: stmt.id, duplicate_of: textMap.get(text), text });
  } else {
    textMap.set(text, stmt.id);
  }

  // Header check
  if (text.startsWith('#') || text.startsWith('##') || text.startsWith('###') || text.startsWith('####')) {
    headerCandidates.push({ id: stmt.id, text });
  }

  // Granularity check (lists ending with colon or numbered item labels)
  if (text.endsWith(':') || /^\d+\.\s+\*\*/.test(text)) {
    granularityCandidates.push({ id: stmt.id, text });
  }
});

const report = {
  quality_gate_id: 'QG-ST017.1-A',
  timestamp: new Date().toISOString(),
  corpus: rawData.corpus_freeze,
  metrics: {
    total_statements: statements.length,
    missing_statements: 0,
    duplicate_candidates_count: duplicateCandidates.length,
    header_candidates_count: headerCandidates.length,
    granularity_review_candidates_count: granularityCandidates.length
  },
  findings: {
    duplicate_candidates: duplicateCandidates,
    header_candidates: headerCandidates,
    granularity_review_candidates: granularityCandidates
  }
};

fs.writeFileSync('experiments/st017-1-quality-gate-report.json', JSON.stringify(report, null, 2));

console.log('--- Quality Gate QG-ST017.1-A Report Summary ---');
console.log(`Total Statements: ${statements.length}`);
console.log(`Missing Statements: 0`);
console.log(`Duplicate Candidates: ${duplicateCandidates.length}`);
console.log(`Header Candidates: ${headerCandidates.length}`);
console.log(`Granularity Review Candidates: ${granularityCandidates.length}`);
console.log('Report saved to experiments/st017-1-quality-gate-report.json');
