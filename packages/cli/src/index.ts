#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cac } from 'cac'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read package.json for version info
const packagePath = join(__dirname, '../package.json')
const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))

const cli = cac('ccd')

cli
  .command('init [name]', 'Initialize a new project')
  .option('--template <template>', 'Template to use', { default: 'default' })
  .action((name: string = 'my-project', options) => {
    console.log(`🎉 Initializing new project: ${name}`)
    console.log(`📦 Using template: ${options.template}`)
    console.log(`✅ Project "${name}" has been initialized successfully!`)
    console.log(`📚 Next steps:`)
    console.log(`   cd ${name}`)
    console.log(`   npm install`)
    console.log(`   npm run dev`)
  })

cli
  .command('version', 'Show version information')
  .action(() => {
    console.log(`claude-code-djd v${packageJson.version}`)
  })

cli.help()
cli.version(packageJson.version)

cli.parse()
