import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import path from 'path';

const isWindows = process.platform === 'win32';

interface RunCommandOptions extends SpawnOptions {
  silent?: boolean;
}

let isShuttingDown = false;
let appProcess: ChildProcess | null = null;

console.log('Starting development environment...\n');

const projectRoot = path.resolve(__dirname, '..');

function runCommand(
  command: string,
  args: string[],
  options: RunCommandOptions = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: projectRoot,
      shell: true,
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });

    let output = '';

    if (options.silent) {
      proc.stdout?.on('data', (data: Buffer) => {
        output += data.toString();
      });
      proc.stderr?.on('data', (data: Buffer) => {
        output += data.toString();
      });
    }

    proc.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    proc.on('error', (error: Error) => {
      reject(error);
    });
  });
}

async function startDocker() {
  console.log('Starting Docker containers...');
  try {
    await runCommand('docker compose', [
      '-f',
      'docker-compose.backend.yml',
      'up',
      '-d',
    ]);
    console.log('Docker containers started\n');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error('Failed to start Docker containers:', errorMessage);
    process.exit(1);
  }
}

function startApp() {
  console.log('Starting NestJS application...\n');
  console.log('─'.repeat(50));

  const command = isWindows ? 'pnpm.cmd' : 'pnpm';

  appProcess = spawn(command, ['run', 'dev:nest'], {
    cwd: projectRoot,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  appProcess.stderr?.on('data', (data: Buffer) => {
    process.stderr.write(data);
  });

  appProcess.stdout?.on('data', (data: Buffer) => {
    const output = data.toString();
    process.stdout.write(output);
  });

  appProcess.on('close', (code: number | null) => {
    if (!isShuttingDown) {
      console.log(`\nApplication exited with code ${code}`);
      void shutdown();
    }
  });

  appProcess.on('error', (error: Error) => {
    console.error('Failed to start application:', error.message);
    void shutdown();
  });
}

async function stopDocker(): Promise<void> {
  console.log('\nStopping Docker containers...');

  try {
    await runCommand('docker compose', [
      '-f',
      'docker-compose.local.yml',
      'down',
    ]);
    console.log('Docker containers stopped');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error stopping Docker containers:', errorMessage);
  }
}

async function shutdown(): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('\n\nShutting down...');

  if (appProcess && !appProcess.killed) {
    console.log('   Stopping application...');
    appProcess.kill('SIGTERM');

    // graceful shutdown
    await new Promise<void>((resolve) => setTimeout(resolve, 5000));

    if (!appProcess.killed) {
      appProcess.kill('SIGKILL');
    }
  }

  await stopDocker();

  console.log('\nGoodbye!\n');
  process.exit(0);
}

process.on('SIGINT', () => shutdown); // Ctrl+C
process.on('SIGTERM', () => shutdown); // Kill signal

if (!isWindows) {
  process.on('SIGHUP', () => shutdown); // Terminal closed
}

async function main(): Promise<void> {
  try {
    await startDocker();
    startApp();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to start development environment:', errorMessage);
    await stopDocker();
    process.exit(1);
  }
}

void main();
