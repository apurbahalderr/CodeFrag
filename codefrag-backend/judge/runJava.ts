import Docker from 'dockerode';
import { PassThrough } from 'node:stream';

const docker = new Docker();

async function runJavaHelloWorld(): Promise<string> {
  const stream = new PassThrough();
  let output = '';

  stream.on('data', (chunk) => {
    output += chunk.toString();
  });

  await docker.run(
    'eclipse-temurin:17',
    ['java', '-version'],
    stream,
    { Tty: false }
  );

  return output;
}
runJavaHelloWorld()
  .then((output) => console.log('OUTPUT:', output))
  .catch((err) => console.error('ERROR:', err));