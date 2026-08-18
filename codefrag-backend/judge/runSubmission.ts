import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import Docker from "dockerode";
import { PassThrough } from "node:stream";
import crypto from "node:crypto";
const LANGUAGE_CONFIG = {
  java: {
    image: 'eclipse-temurin:17',
    filename: 'Solution.java',
    compileCmd: 'javac /code/Solution.java',
    runCmd: 'java -cp /code Solution',
    memoryLimit: 512 * 1024 * 1024,
  },
  cpp: {
    image: 'gcc:latest',
    filename: 'Solution.cpp',
    compileCmd: 'g++ /code/Solution.cpp -o /code/Solution',
    runCmd: '/code/Solution',
    memoryLimit: 256 * 1024 * 1024,
  },
};

const docker = new Docker();

async function runSubmission(
  code: string,
  input: string,
  language: "cpp" | "java",
): Promise<string> {
  const tempDir = path.join(os.tmpdir(), crypto.randomUUID());

  const config = LANGUAGE_CONFIG[language];
  try {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(path.join(tempDir, config.filename), code);
    await fs.writeFile(path.join(tempDir, "input.txt"), input);

    const stream = new PassThrough();
    let output = "";
    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    await docker.run(
      config.image,
      [
        "bash",
        "-c",
        `${config.compileCmd} && ${config.runCmd} < /code/input.txt`,
      ],
      stream,
      {
        HostConfig: {
          Binds: [`${tempDir}:/code`],
          AutoRemove: true,
          Memory: config.memoryLimit,
          CpuQuota: 50000, // roughly half a CPU core (CpuPeriod defaults to 100000)
        },
        Tty: false,
      },
    );

    return output;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
runSubmission(
  `import java.util.Scanner;
   public class Solution {
     public static void main(String[] args) {
       Scanner sc = new Scanner(System.in);
       int a = sc.nextInt();
       int b = sc.nextInt();
       System.out.println(a + b);
     }
   }`,
  "3 5",
  "java",
).then((result) => console.log("JAVA RESULT:", result));
runSubmission(
  `#include <iostream>
  using namespace std;
  int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
    }`,
    "3 5",
    "cpp",
  ).then((result) => console.log("CPP RESULT:", result));
