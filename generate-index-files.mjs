import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Corrección para __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsPath = path.join(__dirname, 'src', 'components'); // si está en src/components


const dirents = await fs.promises.readdir(componentsPath, { withFileTypes: true });

for (const dirent of dirents) {
  if (!dirent.isDirectory()) continue;

  const folderName = dirent.name;
  const componentDir = path.join(componentsPath, folderName);
  const componentFile = path.join(componentDir, `${folderName}.tsx`);
  const indexFile = path.join(componentDir, 'index.tsx');

  const fileExists = await fs.promises.stat(componentFile).then(() => true).catch(() => false);
  if (!fileExists) {
    console.warn(`⚠️  Saltado: no se encontró ${folderName}.tsx`);
    continue;
  }

  const indexExists = await fs.promises.stat(indexFile).then(() => true).catch(() => false);
  if (indexExists) {
    console.log(`✅ Ya existe: ${path.relative(__dirname, indexFile)}`);
    continue;
  }

  const exportLine = `export { default } from './${folderName}';\n`;
  await fs.promises.writeFile(indexFile, exportLine);
  console.log(`✨ Generado: ${path.relative(__dirname, indexFile)}`);
}
