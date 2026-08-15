import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

async function runJavaSubmission(code: string, input: string): Promise<string>{
  const tempDir = path.join(os.tmpdir(), randomUUID());
  await fs.mkdir(tempDir, { recursive: true });
  const javaFilePath = path.join(tempDir, 'Solution.java');
  await fs.writeFile(javaFilePath, code);
  console.log(`Java file created at: ${javaFilePath}`);

  return javaFilePath;
}