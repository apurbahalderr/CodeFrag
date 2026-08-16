import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import Docker from "dockerode";
import { PassThrough } from "node:stream";

const docker = new Docker();
async function runJavaSubmission(code: string, input: string): Promise<string> {
  const tempDir = path.join(os.tmpdir(), Date.now().toString());
  try {
    await fs.mkdir(tempDir, { recursive: true });
    const javaFilePath = path.join(tempDir, "Solution.java");
    await fs.writeFile(javaFilePath, code);
    console.log(`Java file created at: ${javaFilePath}`);
    const stream = new PassThrough();
    let output = "";

    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    await docker.run(
      "eclipse-temurin:17",
      ["bash", "-c", "javac /code/Solution.java && java -cp /code Solution"],
      stream,
      {
        HostConfig: { Binds: [`${tempDir}:/code`], AutoRemove: true },
        Tty: false,
      },
    );

    return output;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
