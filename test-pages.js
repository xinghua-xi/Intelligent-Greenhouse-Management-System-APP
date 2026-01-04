// 测试页面导入
console.log('Testing page imports...');

try {
  const Overview = require('./src/pages/Overview');
  console.log('✓ Overview imported successfully');
} catch (e) {
  console.error('✗ Overview import failed:', e.message);
}

try {
  const Smart = require('./src/pages/Smart');
  console.log('✓ Smart imported successfully');
} catch (e) {
  console.error('✗ Smart import failed:', e.message);
}

try {
  const Alerts = require('./src/pages/Alerts');
  console.log('✓ Alerts imported successfully');
} catch (e) {
  console.error('✗ Alerts import failed:', e.message);
}

try {
  const OverviewStandard = require('./src/pages/OverviewStandard');
  console.log('✓ OverviewStandard imported successfully');
} catch (e) {
  console.error('✗ OverviewStandard import failed:', e.message);
}

try {
  const OverviewMinimal = require('./src/pages/OverviewMinimal');
  console.log('✓ OverviewMinimal imported successfully');
} catch (e) {
  console.error('✗ OverviewMinimal import failed:', e.message);
}

try {
  const OverviewExpert = require('./src/pages/OverviewExpert');
  console.log('✓ OverviewExpert imported successfully');
} catch (e) {
  console.error('✗ OverviewExpert import failed:', e.message);
}
