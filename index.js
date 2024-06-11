#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const defaultProjectName = 'my-new-project';
const projectName = process.argv[2] || defaultProjectName;

const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
  console.error(`The directory ${projectName} already exists in the current directory. Please choose a different project name.`);
  process.exit(1);
}

fs.mkdirSync(projectPath);

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const templateDir = path.join(__dirname, 'template');
copyRecursiveSync(templateDir, projectPath);

console.log(`Project ${projectName} created successfully!`);

process.chdir(projectPath);

// Install dependencies
execSync('npm install', { stdio: 'inherit' });

console.log('All dependencies installed.');
console.log('To get started:');
console.log(`  cd ${projectName}`);
console.log('  npm run dev');
