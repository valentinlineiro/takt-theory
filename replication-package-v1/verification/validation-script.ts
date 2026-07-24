import * as fs from 'node:fs';
import * as path from 'node:path';

function validateReplication(): void {
  const outputDir = path.resolve('replication-package-v1/output');
  const expectedHashesFile = path.resolve('replication-package-v1/verification/expected-hashes.txt');

  if (!fs.existsSync(expectedHashesFile)) {
    console.error('❌ Error: expected-hashes.txt not found at:', expectedHashesFile);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    console.error('❌ Error: Output directory not found at:', outputDir);
    process.exit(1);
  }

  const hashLines = fs.readFileSync(expectedHashesFile, 'utf-8')
    .split('\n')
    .filter(line => line.trim() !== '' && !line.startsWith('#'));

  let allPassed = true;

  console.log('=== TAKT R1 Cryptographic Hash Verification ===\n');

  for (const line of hashLines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) continue;

    const [expectedHash, filename] = parts;
    const filePath = path.join(outputDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ [MISSING FILE] ${filename} not found in ${outputDir}`);
      allPassed = false;
      continue;
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const measuredHash = content.manifest?.datasetHash;

    if (measuredHash === expectedHash) {
      console.log(`✓ [PASS] ${filename}`);
      console.log(`   Hash: ${measuredHash}`);
    } else {
      console.error(`❌ [HASH MISMATCH] ${filename}`);
      console.error(`   Expected: ${expectedHash}`);
      console.error(`   Measured: ${measuredHash}`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n🎉 ALL CRYPTOGRAPHIC DATASET HASHES VERIFIED SUCCESSFULLY (PASS)');
    process.exit(0);
  } else {
    console.error('\n❌ REPLICATION HASH VERIFICATION FAILED');
    process.exit(1);
  }
}

validateReplication();
