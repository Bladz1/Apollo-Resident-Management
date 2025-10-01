const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, 'next', 'tsconfig.json');
const targetDir = path.join(projectRoot, 'node_modules', 'next');
const targetPath = path.join(targetDir, 'tsconfig.json');

if (!fs.existsSync(sourcePath)) {
  console.warn(`Source tsconfig not found at ${sourcePath}`);
  process.exit(0);
}

if (!fs.existsSync(targetDir)) {
  console.warn('next package not installed, skipping tsconfig copy.');
  process.exit(0);
}

try {
  fs.copyFileSync(sourcePath, targetPath);
  console.log('Copied next/tsconfig.json into node_modules for TypeScript extends support.');
} catch (error) {
  console.warn('Failed to copy next tsconfig:', error);
}
