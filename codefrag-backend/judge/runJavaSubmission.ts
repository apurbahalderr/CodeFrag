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
    await fs.writeFile(path.join(tempDir, "Solution.java"), code);
    await fs.writeFile(path.join(tempDir, "input.txt"), input);

    const stream = new PassThrough();
    let output = "";
    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    await docker.run(
      "eclipse-temurin:17",
      ["bash", "-c", "javac /code/Solution.java && java -cp /code Solution < /code/input.txt"],
      stream,
      {
        HostConfig: { Binds: [`${tempDir}:/code`], AutoRemove: true },
        Tty: false,
      }
    );

    return output;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

runJavaSubmission(
  `import java.util.Scanner;
   public class Solution {
     public static void main(String[] args) {
       Scanner sc = new Scanner(System.in);
       int a = sc.nextInt();
       int b = sc.nextInt();
       System.out.println(a + b);
     }
   }`,
  "3 5"
).then((result) => console.log("RESULT:", result));