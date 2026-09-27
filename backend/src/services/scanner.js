// CodeRadar Repository Scanner and File Filter
import axios from 'axios';
import AdmZip from 'adm-zip';

const IGNORED_DIRECTORIES = [
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  'coverage',
  '__pycache__',
  '.cache'
];

const ALLOWED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.json', '.yml', '.yaml', '.toml',
  '.py', '.go', '.rs', '.java', '.c', '.cpp',
  '.html', '.css', '.scss',
  '.md', '.txt', '.env.example'
];

export function isAllowedFile(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  
  // Check ignored directories
  for (const dir of IGNORED_DIRECTORIES) {
    if (normalized.includes(`/${dir}/`) || normalized.startsWith(`${dir}/`)) {
      return false;
    }
  }

  // Always allow special config files like .gitignore or package.json
  if (normalized.endsWith('.gitignore') || normalized.endsWith('package.json') || normalized.endsWith('Dockerfile')) {
    return true;
  }

  // Check extensions
  return ALLOWED_EXTENSIONS.some(ext => normalized.toLowerCase().endsWith(ext));
}

/**
 * Parses an uploaded ZIP buffer into repository files.
 */
export function parseZipBuffer(buffer) {
  const zip = new AdmZip(buffer);
  const zipEntries = zip.getEntries();
  const files = [];

  for (const entry of zipEntries) {
    if (entry.isDirectory) continue;
    
    // Normalize path and strip root folder name if all entries are nested under a root
    let entryPath = entry.entryName.replace(/\\/g, '/');
    if (isAllowedFile(entryPath)) {
      try {
        const content = entry.getData().toString('utf8');
        files.push({
          path: entryPath,
          content,
          size: entry.header.size
        });
      } catch (err) {
        // Skip unreadable binary entries
      }
    }
  }

  return files;
}

/**
 * Fetches repository files from public GitHub repository via GitHub REST API.
 */
export async function fetchGitHubRepository(owner, repo, githubToken) {
  const headers = {
    'User-Agent': 'CodeRadar-Platform'
  };
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  // 1. Get default branch
  const repoMetaRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  const defaultBranch = repoMetaRes.data.default_branch || 'main';

  // 2. Get git tree recursively
  const treeRes = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
    { headers }
  );

  const tree = treeRes.data.tree || [];
  const candidateFiles = tree
    .filter(item => item.type === 'blob' && isAllowedFile(item.path))
    .slice(0, 30); // limit to 30 files for fast hackathon scanning

  // 3. Fetch file contents
  const files = [];
  for (const item of candidateFiles) {
    try {
      const rawRes = await axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${item.path}`,
        { headers: { ...headers, Accept: 'text/plain' }, responseType: 'text' }
      );
      files.push({
        path: item.path,
        content: typeof rawRes.data === 'string' ? rawRes.data : JSON.stringify(rawRes.data)
      });
    } catch (e) {
      // Skip if individual file fetch fails
    }
  }

  return {
    name: `${owner}/${repo}`,
    branch: defaultBranch,
    files
  };
}
