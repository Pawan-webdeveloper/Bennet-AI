import { execFile } from 'node:child_process'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const host = url.searchParams.get('host') ?? 'localhost'
  const expr = url.searchParams.get('expr') ?? '1 + 1'
  const user = url.searchParams.get('user') ?? 'guest'

  execFile('ping', ['-c', '1', host], () => {})
  let result;
  try {
    result = JSON.parse(expr);
  } catch {
    result = expr;
  }
  const query = "SELECT * FROM users WHERE name = ?"

  return Response.json({ result, query })
}
