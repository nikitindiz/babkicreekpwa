#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PACKAGE_JSON_PATH = path.resolve(__dirname, '../package.json');
const CURRENT_VERSION_PATH = path.resolve(__dirname, '../src/currentVersion.ts');
const CHANGELOGS_DIR = path.resolve(__dirname, '../changelogs/next');
const CHANGELOG_INDEX_PATH = path.resolve(__dirname, '../src/changelog/index.ts');
const CHANGELOG_VERSIONS_DIR = path.resolve(__dirname, '../src/changelog/versions');

// Helper function to read and parse YAML file
const parseYamlFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content);
  } catch (error) {
    console.error(`Error parsing YAML file ${filePath}:`, error);
    return null;
  }
};

// Helper function to increment version (e.g., 0.0.10 -> 0.0.11)
const incrementVersion = (version) => {
  const parts = version.split('.');
  const lastPart = parseInt(parts[parts.length - 1], 10) + 1;
  parts[parts.length - 1] = lastPart.toString();
  return parts.join('.');
};

// Main function
const issueNextVersion = () => {
  // Read current version from package.json
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const currentVersion = packageJson.version;

  // Read current version from currentVersion.ts to double-check
  const versionFileContent = fs.readFileSync(CURRENT_VERSION_PATH, 'utf8');
  const versionMatch = versionFileContent.match(/['"]([0-9]+\.[0-9]+\.[0-9]+)['"]/);

  if (!versionMatch || versionMatch[1] !== currentVersion) {
    console.error('Version mismatch between package.json and currentVersion.ts');
    process.exit(1);
  }

  // Calculate the next version
  const nextVersion = incrementVersion(currentVersion);
  console.log(`Incrementing version from ${currentVersion} to ${nextVersion}`);

  // Check if changelogs/next directory exists
  if (!fs.existsSync(CHANGELOGS_DIR)) {
    console.error('Changelogs directory not found:', CHANGELOGS_DIR);
    process.exit(1);
  }

  // Scan for YAML files
  const files = fs
    .readdirSync(CHANGELOGS_DIR)
    .filter((file) => file.endsWith('.yaml') && file !== 'example.yaml');

  if (files.length === 0) {
    console.log('No changelog entries found. Terminating.');
    process.exit(0);
  }

  // Parse YAML files and collect changes
  const changes = [];
  for (const file of files) {
    const filePath = path.join(CHANGELOGS_DIR, file);
    const content = parseYamlFile(filePath);

    if (content && content.type && content.description) {
      changes.push({
        type: content.type,
        description: content.description,
      });
    }
  }

  // Create new version file in src/changelog/versions
  const versionFileName = `${nextVersion}.ts`;
  const versionFilePath = path.join(CHANGELOG_VERSIONS_DIR, versionFileName);

  const fileContent = `const changes = ${JSON.stringify(
    changes,
    null,
    2,
  )};\n\nexport default changes;\n`;
  fs.writeFileSync(versionFilePath, fileContent);
  console.log(`Created version file: ${versionFilePath}`);

  // Update changelog index.ts
  const indexContent = fs.readFileSync(CHANGELOG_INDEX_PATH, 'utf8');
  const lines = indexContent.split('\n');

  // Create new import line
  const importLine = `import * as v${nextVersion.replace(
    /\./g,
    '_',
  )} from './versions/${nextVersion}';`;

  // Find the last import line to insert after
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  // Insert the new import after the last existing import
  lines.splice(lastImportIndex + 1, 0, importLine);

  // Update the changeLog object
  let changeLogIndex = lines.findIndex((line) => line.includes('export const changeLog = {'));
  if (changeLogIndex !== -1) {
    lines[changeLogIndex + 1] = `  '${nextVersion}': v${nextVersion.replace(/\./g, '_')},${
      lines[changeLogIndex + 1].includes('//') ? ' ' + lines[changeLogIndex + 1].split('//')[1] : ''
    }`;
  }

  // Write the updated content back to the file
  fs.writeFileSync(CHANGELOG_INDEX_PATH, lines.join('\n'));
  console.log(`Updated changelog index at: ${CHANGELOG_INDEX_PATH}`);

  // Create new version folder in changelogs
  const newVersionDir = path.resolve(__dirname, `../changelogs/${nextVersion}`);
  if (!fs.existsSync(newVersionDir)) {
    fs.mkdirSync(newVersionDir, { recursive: true });
  }

  // Move processed YAML files to the new version folder
  for (const file of files) {
    const sourceFilePath = path.join(CHANGELOGS_DIR, file);
    const targetFilePath = path.join(newVersionDir, file);
    fs.copyFileSync(sourceFilePath, targetFilePath);
    fs.unlinkSync(sourceFilePath);
  }

  console.log(`Moved processed changelog files to: ${newVersionDir}`);

  // Update version in package.json
  packageJson.version = nextVersion;
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Updated version in package.json to: ${nextVersion}`);

  // Update version in currentVersion.ts
  const newVersionFileContent = `export const currentVersion = '${nextVersion}';\n`;
  fs.writeFileSync(CURRENT_VERSION_PATH, newVersionFileContent);
  console.log(`Updated version in currentVersion.ts to: ${nextVersion}`);

  console.log('Version upgrade completed successfully!');
};

// Execute the script
issueNextVersion();
