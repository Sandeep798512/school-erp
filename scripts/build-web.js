const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🚀 Building Enterprise School ERP Web Application...');
console.log('====================================================');

try {
  // 1. Run vite build in apps/web
  execSync('npm run build --workspace=apps/web', { stdio: 'inherit' });

  // 2. Ensure both apps/web/dist and root dist exist and are synced
  const webDist = path.join(__dirname, '..', 'apps', 'web', 'dist');
  const rootDist = path.join(__dirname, '..', 'dist');

  if (fs.existsSync(webDist)) {
    if (!fs.existsSync(rootDist)) {
      fs.mkdirSync(rootDist, { recursive: true });
    }
    fs.cpSync(webDist, rootDist, { recursive: true });

    // Also ensure _redirects is present in both
    const redirectsSrc = path.join(__dirname, '..', 'apps', 'web', 'public', '_redirects');
    if (fs.existsSync(redirectsSrc)) {
      fs.copyFileSync(redirectsSrc, path.join(rootDist, '_redirects'));
      fs.copyFileSync(redirectsSrc, path.join(webDist, '_redirects'));
    }

    console.log('====================================================');
    console.log('✅ Deployment assets ready in both /dist and /apps/web/dist!');
    console.log('====================================================');
  } else {
    throw new Error('apps/web/dist directory was not created');
  }
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
