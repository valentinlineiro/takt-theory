import fs from 'fs';
import path from 'path';

const specPath = 'docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md';
const content = fs.readFileSync(specPath, 'utf8');
const lines = content.split('\n');

const statements = [];
let idCounter = 1;

lines.forEach((line, index) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('```') || trimmed === '---') {
    return;
  }

  statements.push({
    id: `S-${String(idCounter).padStart(3, '0')}`,
    literal_text: trimmed,
    location: `${specPath}:L${index + 1}`,
    type_provisional: 'UNCLASSIFIED',
    dependencies: []
  });
  idCounter++;
});

const output = {
  corpus_freeze: {
    baseline: 'ST-016 v1.0.0',
    specification_file: specPath,
    total_lines_analyzed: lines.length,
    coverage: '100%'
  },
  metrics: {
    total_statements_extracted: statements.length,
    total_documents_analyzed: 1
  },
  statements: statements
};

fs.mkdirSync('experiments', { recursive: true });
fs.writeFileSync(
  'experiments/st017-1-foundations-inventory.json',
  JSON.stringify(output, null, 2)
);

console.log(`Fase A completada con granularidad completa por línea. Total statements: ${statements.length}`);
