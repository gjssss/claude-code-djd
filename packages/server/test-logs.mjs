#!/usr/bin/env node

// Test script for Claude Code logs API
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Sample JSONL data based on the problem statement
const sampleLogs = `{"parentUuid":null,"isSidechain":false,"userType":"external","cwd":"/Users/gjssss/.claude/hooks","sessionId":"958555ae-c806-4d80-a008-e5f6e17322b9","version":"1.0.98","gitBranch":"","type":"user","message":{"role":"user","content":"hello"},"uuid":"920b3d49-efb2-4542-be47-3ba0c6dfcb59","timestamp":"2025-08-30T07:16:24.956Z"}
{"parentUuid":"920b3d49-efb2-4542-be47-3ba0c6dfcb59","isSidechain":false,"userType":"external","cwd":"/Users/gjssss/.claude/hooks","sessionId":"958555ae-c806-4d80-a008-e5f6e17322b9","version":"1.0.98","gitBranch":"","message":{"id":"msg_01HnFmNDPBxSQAcSqyrBpRNA","type":"message","role":"assistant","model":"claude-sonnet-4-20250514","content":[{"type":"text","text":"你好！我是 Claude Code，可以帮助您处理软件工程任务。有什么我可以为您做的吗？"}],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":3,"cache_creation_input_tokens":15495,"cache_read_input_tokens":0,"cache_creation":{"ephemeral_5m_input_tokens":15495,"ephemeral_1h_input_tokens":0},"output_tokens":1,"service_tier":"standard"}},"requestId":"req_011CSdV2tBwJJ4Leyo5ehpgk","type":"assistant","uuid":"8eef27a8-5e2a-4a16-b531-735d46da1e88","timestamp":"2025-08-30T07:16:28.537Z"}
{"parentUuid":"8eef27a8-5e2a-4a16-b531-735d46da1e88","isSidechain":false,"userType":"external","cwd":"/Users/gjssss/.claude/hooks","sessionId":"958555ae-c806-4d80-a008-e5f6e17322b9","version":"1.0.98","gitBranch":"","type":"system","content":"\\u001b[1mStop\\u001b[22m [bash ~/.claude/hooks/echo.sh] completed successfully","isMeta":false,"timestamp":"2025-08-30T07:16:28.615Z","uuid":"c2b1f22d-bf2a-4c3d-a7df-769caba341c5","toolUseID":"dcda1f58-9a93-4a00-ab61-a7b54980503c","level":"info"}`

// Save sample data to a file
console.log('Creating sample JSONL file...')
const sampleFile = join(__dirname, 'sample-logs.jsonl')
import { writeFileSync } from 'node:fs'
writeFileSync(sampleFile, sampleLogs)

console.log('Sample JSONL file created at:', sampleFile)
console.log('')
console.log('Test the API with:')
console.log('1. Start the server: pnpm run dev')
console.log('2. Upload logs: curl -X POST http://localhost:3000/api/logs/upload -H "Content-Type: text/plain" --data-binary @sample-logs.jsonl')
console.log('3. Retrieve logs: curl http://localhost:3000/api/logs')
console.log('4. Retrieve specific session: curl "http://localhost:3000/api/logs?sessionId=958555ae-c806-4d80-a008-e5f6e17322b9"')
console.log('')
console.log('Sample logs contain:')
console.log('- 1 user message')
console.log('- 1 assistant response')
console.log('- 1 system message')
console.log('- All from session: 958555ae-c806-4d80-a008-e5f6e17322b9')