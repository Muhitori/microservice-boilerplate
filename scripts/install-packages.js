const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the root directory
const rootDir = path.resolve(__dirname, '..');

// Define directories to process
const directories = [
  'services/api-gateway',
  'services/logger-service',
  'services/product-service',
  'services/user-service'
];

console.log('Starting package installation for all services...');

// Process each directory
directories.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  
  // Check if package.json exists
  if (fs.existsSync(path.join(fullPath, 'package.json'))) {
    console.log(`\nInstalling packages for ${dir}...`);
    try {
      // Run npm install in the directory
      execSync('npm install', {
        cwd: fullPath,
        stdio: 'inherit'
      });
      console.log(`Successfully installed packages for ${dir}`);
    } catch (error) {
      console.error(`Error installing packages for ${dir}:`, error.message);
      process.exit(1);
    }
  } else {
    console.warn(`No package.json found in ${dir}, skipping...`);
  }
});

console.log('\nAll packages have been installed successfully!');