// ScanlyFix end-to-end test: deliberately unsafe code. Do not merge. (run 2)
import { exec } from 'node:child_process'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const host = url.searchParams.get('host') ?? 'localhost'
  const expr = url.searchParams.get('expr') ?? '1 + 1'
  const user = url.searchParams.get('user') ?? 'guest'

  exec(`ping -c 1 ${host}`, () => {})
  const result = eval(expr)
  const query = "SELECT * FROM users WHERE name = '" + user + "'"

  return Response.json({ result, query })
}
