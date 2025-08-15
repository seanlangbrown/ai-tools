#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Download file from URL
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${path.basename(filePath)}...`);
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Get directory contents from GitHub API
function getDirectoryContents(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch directory contents: ${response.statusCode}`));
        return;
      }
      
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          reject(new Error('Failed to parse directory contents'));
        }
      });
    }).on('error', reject);
  });
}

async function setupDevContainers() {
  const devcontainerDir = '.devcontainer';
  
  // Create .devcontainer directory
  if (!fs.existsSync(devcontainerDir)) {
    fs.mkdirSync(devcontainerDir, { recursive: true });
    console.log(`Created ${devcontainerDir} directory`);
  } else {
    console.log(`${devcontainerDir} directory already exists`);
  }

  try {
    // Get directory contents from GitHub API
    console.log('Fetching .devcontainer directory contents...');
    const apiUrl = 'https://api.github.com/repos/anthropics/claude-code/contents/.devcontainer';
    const contents = await getDirectoryContents(apiUrl);
    
    // Filter to only regular files (not directories)
    const files = contents.filter(item => item.type === 'file');
    
    if (files.length === 0) {
      console.error('No files found in .devcontainer directory');
      process.exit(1);
    }
    
    console.log(`Found ${files.length} files to download`);

    // Download each file
    for (const file of files) {
      const filePath = path.join(devcontainerDir, file.name);
      try {
        await downloadFile(file.download_url, filePath);
        
        // Make shell scripts executable
        if (file.name.endsWith('.sh')) {
          fs.chmodSync(filePath, '755');
        }
        
        console.log(`✓ Downloaded ${file.name}`);
      } catch (error) {
        console.error(`✗ Failed to download ${file.name}:`, error.message);
        process.exit(1);
      }
    }

    console.log('\n✅ DevContainer setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Open this repository in VS Code');
    console.log('2. Install the "Dev Containers" extension if not already installed');
    console.log('3. Press Cmd+Shift+P (or Ctrl+Shift+P) and run "Dev Containers: Reopen in Container"');
    console.log('4. Wait for the container to build and initialize');
    
  } catch (error) {
    console.error('Failed to fetch directory contents:', error.message);
    console.error('Make sure you have internet connectivity and can access GitHub.');
    process.exit(1);
  }
}

// Run the setup
setupDevContainers().catch(error => {
  console.error('Setup failed:', error.message);
  process.exit(1);
});
