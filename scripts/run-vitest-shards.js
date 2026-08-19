const { spawnSync } = require('node:child_process')
const path = require('node:path')

const parseShardValue = (value, fallback) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const totalShards = parseShardValue(process.env.VITEST_TOTAL_SHARDS, 16)
const startShard = parseShardValue(process.env.VITEST_START_SHARD, 1)
const endShard = parseShardValue(process.env.VITEST_END_SHARD, totalShards)
const rootDir = path.resolve(__dirname, '..')
const executable = path.join(
  rootDir,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'vitest.cmd' : 'vitest',
)

for (let shard = startShard; shard <= endShard; shard += 1) {
  console.log(`Running Vitest shard ${shard}/${totalShards}`)

  const result = spawnSync(
    executable,
    [
      'run',
      `--shard=${shard}/${totalShards}`,
      '--pool=threads',
      '--maxWorkers=1',
      '--no-file-parallelism',
      '--silent=passed-only',
    ],
    {
      cwd: rootDir,
      env: {
        ...process.env,
        NODE_OPTIONS: process.env.NODE_OPTIONS ?? '--max-old-space-size=12288',
      },
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
  )

  if (result.error) {
    console.error(result.error)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
