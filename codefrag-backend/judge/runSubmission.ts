import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import Docker from "dockerode";
import { PassThrough } from "node:stream";
import crypto from "node:crypto";
const LANGUAGE_CONFIG = {
  java: {
    image: "eclipse-temurin:17",
    filename: "Solution.java",
    compileCmd: "javac /code/Solution.java",
    runCmd: "java -cp /code Solution",
    memoryLimit: 512 * 1024 * 1024,
  },
  cpp: {
    image: "gcc:latest",
    filename: "Solution.cpp",
    compileCmd: "g++ /code/Solution.cpp -o /code/Solution",
    runCmd: "/code/Solution",
    memoryLimit: 256 * 1024 * 1024,
  },
};

const docker = new Docker();

export async function runSubmission(
  code: string,
  input: string,
  language: "cpp" | "java",
): Promise<string> {
  const tempDir = path.join(os.tmpdir(), crypto.randomUUID());
  try {
    const config = LANGUAGE_CONFIG[language];
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(path.join(tempDir, config.filename), code);
    await fs.writeFile(path.join(tempDir, "input.txt"), input);

    const container = await docker.createContainer({
      Image: config.image,
      Cmd: [
        "bash",
        "-c",
        `${config.compileCmd} && ${config.runCmd} < /code/input.txt`,
      ],
      Tty: false,
      HostConfig: {
        Binds: [`${tempDir}:/code`],
        AutoRemove: true,
        Memory: config.memoryLimit,
        CpuQuota: 50000,
      },
    });
    const outputStream = new PassThrough();
    let output = "";
    outputStream.on("data", (chunk) => {
      output += chunk.toString();
    });
    const attachStream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });
    docker.modem.demuxStream(attachStream, outputStream, outputStream);

    await container.start();

    const TIMEOUT_MS = 10000;
    let timedOut = false;

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        timedOut = true;
        reject(new Error("TIMEOUT"));
      }, TIMEOUT_MS);
    });
    try {
      await Promise.race([container.wait(), timeoutPromise]);
      return output;
    } catch (err) {
      if (timedOut) {
        await container.kill().catch(() => {});
      }
      throw err;
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
