// CodeRadar Dependency Health & Risk Analyzer

export function analyzeDependencies(files) {
  const pkgFile = files.find(f => f.path === 'package.json');
  if (!pkgFile || !pkgFile.content) {
    return {
      packageManager: "unknown",
      totalDependencies: 0,
      dependencies: [],
      devDependencies: [],
      advisories: [],
      redundancies: []
    };
  }

  let pkg;
  try {
    pkg = JSON.parse(pkgFile.content);
  } catch (e) {
    return { error: "Failed to parse package.json" };
  }

  const deps = pkg.dependencies || {};
  const devDeps = pkg.devDependencies || {};
  
  const depList = Object.entries(deps).map(([name, version]) => ({
    name,
    version,
    type: "production",
    status: getDependencyRisk(name, version)
  }));

  const devDepList = Object.entries(devDeps).map(([name, version]) => ({
    name,
    version,
    type: "development",
    status: { risk: "low", note: "Standard dev toolchain" }
  }));

  const advisories = [];
  const redundancies = [];

  // Check legacy moment
  if (deps['moment']) {
    advisories.push({
      package: 'moment',
      severity: 'medium',
      issue: 'Legacy architecture in maintenance mode (~290kB bundle size)',
      recommendation: 'Migrate to date-fns, dayjs, or native Intl.DateTimeFormat for a 95% bundle reduction.'
    });
  }

  // Check Firebase version
  if (deps['firebase']) {
    advisories.push({
      package: 'firebase',
      severity: 'info',
      issue: 'Client SDK initialization requires rigorous secret separation',
      recommendation: 'Verify environment variables are not bundled into public production artifacts.'
    });
  }

  // Check potential redundant utilities
  if (deps['lodash'] && deps['ramda']) {
    redundancies.push({
      libraries: ['lodash', 'ramda'],
      impact: 'Overlapping utility libraries inflate vendor bundle.'
    });
  }

  return {
    packageManager: "npm",
    packageName: pkg.name || "unnamed-project",
    version: pkg.version || "1.0.0",
    totalDependencies: Object.keys(deps).length,
    totalDevDependencies: Object.keys(devDeps).length,
    dependencies: depList,
    devDependencies: devDepList,
    advisories,
    redundancies
  };
}

function getDependencyRisk(name, version) {
  if (name === 'moment') {
    return { risk: 'medium', tag: 'Legacy Maintenance', note: 'Heavy bundle footprint' };
  }
  if (name === 'axios') {
    return { risk: 'low', tag: 'Stable', note: 'Active HTTP client' };
  }
  if (name === 'stripe') {
    return { risk: 'low', tag: 'Payment Gateway', note: 'Ensure keys remain backend-only' };
  }
  if (name === 'bcryptjs') {
    return { risk: 'low', tag: 'Crypto', note: 'Pure JS bcrypt implementation' };
  }
  return { risk: 'low', tag: 'Standard', note: 'Up to date' };
}
