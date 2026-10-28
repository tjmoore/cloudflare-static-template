import { access, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { RobotsGenerator } from './robotsGenerator.js';
import { SitemapGenerator } from './sitemapGenerator.js';

const manifestPath = path.resolve('dist', 'generated-files.json');

/**
 * Logs a message to the console.
 * @param msg Message to log.
 */
const log = (msg: string): void => console.log(`[generate] ${msg}`);

/**
 * Checks whether a file exists.
 * @param file Path to check.
 */
async function exists(file: string): Promise<boolean> {
  return access(file).then(() => true, () => false);
}

/**
 * Generates sitemap.xml and robots.txt in the site directory, recording newly created files
 * so they can be removed after deployment.
 */
async function generate(): Promise<void> {
  const siteDir = process.env.SITE_DIR || './public';
  const siteUrl = process.env.SITE_URL || '';
  const targets = [SitemapGenerator.fileName, RobotsGenerator.fileName].map((f) => path.join(siteDir, f));
  const existedBefore = await Promise.all(targets.map(exists));

  await new SitemapGenerator(siteDir, siteUrl, log, {
    changeFreq: process.env.SITEMAP_CHANGEFREQ_DEFAULT,
    priority: process.env.SITEMAP_PRIORITY_DEFAULT,
  }).generate();
  await new RobotsGenerator(siteDir, siteUrl, log).generate();

  const created: string[] = [];
  for (const [i, target] of targets.entries()) {
    if (!existedBefore[i] && (await exists(target))) created.push(path.resolve(target));
  }
  await writeFile(manifestPath, JSON.stringify(created), 'utf8');
}

/**
 * Removes files recorded as newly created by the last generate run.
 */
async function cleanup(): Promise<void> {
  if (process.env.CLEANUP_GENERATED_FILES?.toLowerCase() !== 'true') return;
  const raw = await readFile(manifestPath, 'utf8').catch(() => '[]');
  for (const file of JSON.parse(raw) as string[]) {
    await rm(file, { force: true });
    log(`Removed ${file}`);
  }
  await rm(manifestPath, { force: true });
}

try {
  process.loadEnvFile();
} catch {
  // .env is optional
}

await (process.argv.includes('--cleanup') ? cleanup() : generate());
