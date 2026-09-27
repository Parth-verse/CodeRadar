// CodeRadar Architecture Graph & Relationship Service
// Builds execution flows, file dependencies, and tiered architectural mapping.

export function buildArchitectureGraph(files) {
  const fileNodes = [];
  const dependencyMap = {}; // filePath -> { imports: [], importedBy: [], layer: string }

  // 1. Initialize nodes and determine layer
  files.forEach(file => {
    let layer = "utilities";
    if (file.path.startsWith('src/components/')) layer = "Frontend Components";
    else if (file.path.startsWith('src/services/')) layer = "Business Services";
    else if (file.path.startsWith('src/routes/')) layer = "API Routes & Controllers";
    else if (file.path.startsWith('src/config/')) layer = "Configuration & SDKs";
    else if (file.path.startsWith('tests/')) layer = "Automated Test Suites";
    else if (file.path === 'package.json' || file.path === '.gitignore') layer = "Project Metadata";

    dependencyMap[file.path] = {
      path: file.path,
      layer,
      imports: [],
      importedBy: [],
      exports: [],
      linesOfCode: (file.content || '').split('\n').length
    };
  });

  // 2. Parse ES import statements and relative links
  files.forEach(file => {
    const currentPath = file.path;
    const content = file.content || '';
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const rawImport = match[1];
      // Resolve internal relative paths
      if (rawImport.startsWith('.')) {
        // Simple relative normalizer
        const resolved = resolveRelativePath(currentPath, rawImport);
        if (dependencyMap[resolved]) {
          dependencyMap[currentPath].imports.push(resolved);
          dependencyMap[resolved].importedBy.push(currentPath);
        } else {
          // Check with .js or .jsx extension
          const withJs = resolved + '.js';
          const withJsx = resolved + '.jsx';
          if (dependencyMap[withJs]) {
            dependencyMap[currentPath].imports.push(withJs);
            dependencyMap[withJs].importedBy.push(currentPath);
          } else if (dependencyMap[withJsx]) {
            dependencyMap[currentPath].imports.push(withJsx);
            dependencyMap[withJsx].importedBy.push(currentPath);
          }
        }
      } else {
        // External package import (e.g. 'axios', 'stripe', 'firebase')
        dependencyMap[currentPath].imports.push(`npm:${rawImport}`);
      }
    }
  });

  // 3. Define tiered architecture representation
  const layers = [
    {
      id: "presentation",
      name: "Frontend UI",
      description: "User interaction layer, React components, and stateful views",
      files: Object.values(dependencyMap).filter(d => d.layer === "Frontend Components")
    },
    {
      id: "services",
      name: "Business Services",
      description: "Core platform workflows, domain models, and transaction management",
      files: Object.values(dependencyMap).filter(d => d.layer === "Business Services")
    },
    {
      id: "api",
      name: "API & Endpoints",
      description: "Express HTTP handlers, REST controllers, and request validation",
      files: Object.values(dependencyMap).filter(d => d.layer === "API Routes & Controllers")
    },
    {
      id: "config",
      name: "Configuration & SDKs",
      description: "External client SDKs, Firebase, database connections, and environment drivers",
      files: Object.values(dependencyMap).filter(d => d.layer === "Configuration & SDKs")
    },
    {
      id: "tests",
      name: "Testing & Quality Gates",
      description: "Unit tests, integration specifications, and mock suites",
      files: Object.values(dependencyMap).filter(d => d.layer === "Automated Test Suites")
    }
  ];

  return {
    dependencyMap,
    layers,
    totalModules: files.length
  };
}

function resolveRelativePath(currentFilePath, relativeImport) {
  const parts = currentFilePath.split('/');
  parts.pop(); // remove current file name
  const relParts = relativeImport.split('/');

  for (const part of relParts) {
    if (part === '.') continue;
    if (part === '..') {
      parts.pop();
    } else {
      parts.push(part);
    }
  }
  return parts.join('/');
}
