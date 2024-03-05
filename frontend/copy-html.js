const fs = require('fs');
const path = require('path');

const srcHtmlPath = path.join(__dirname, 'src', 'index.html');
const distHtmlPath = path.join(__dirname, 'dist', 'index.html');

// Read the source HTML file
const htmlContent = fs.readFileSync(srcHtmlPath, 'utf8');

// Modify the HTML content to update CSS and JS paths
const updatedHtmlContent = htmlContent.replace(
  'href="/dist/bundle.css"',
  'href="./bundle.css"'
).replace(
  'src="/dist/bundle.js"',
  'src="./bundle.js"'
);

// Write the modified HTML content to the dist folder
fs.writeFileSync(distHtmlPath, updatedHtmlContent, 'utf8');

console.log('index.html copied and paths updated.');
