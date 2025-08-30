import { join } from 'node:path'
import { execa } from 'execa'
import { describe, expect, it } from 'vitest'

const cliPath = join(__dirname, '../dist/index.mjs')

describe('cLI', () => {
  it('shows help message', async () => {
    const { stdout } = await execa('node', [cliPath, '--help'])
    expect(stdout).toContain('claude-code-djd')
    expect(stdout).toContain('Usage:')
    expect(stdout).toContain('init [name]')
    expect(stdout).toContain('version')
  })

  it('shows version', async () => {
    const { stdout } = await execa('node', [cliPath, 'version'])
    expect(stdout).toContain('claude-code-djd v0.0.1')
  })

  it('initializes a project with default name', async () => {
    const { stdout } = await execa('node', [cliPath, 'init'])
    expect(stdout).toContain('🎉 Initializing new project: my-project')
    expect(stdout).toContain('📦 Using template: default')
    expect(stdout).toContain('✅ Project "my-project" has been initialized successfully!')
  })

  it('initializes a project with custom name', async () => {
    const { stdout } = await execa('node', [cliPath, 'init', 'custom-project'])
    expect(stdout).toContain('🎉 Initializing new project: custom-project')
    expect(stdout).toContain('✅ Project "custom-project" has been initialized successfully!')
  })

  it('initializes a project with custom template', async () => {
    const { stdout } = await execa('node', [cliPath, 'init', 'test-project', '--template', 'react'])
    expect(stdout).toContain('🎉 Initializing new project: test-project')
    expect(stdout).toContain('📦 Using template: react')
  })
})
