import { NextResponse } from 'next/server';

/** Health checks are never cached or prerendered. */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = 'no-store, no-cache, must-revalidate, max-age=0';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'insureflow',
      version: process.env.npm_package_version ?? '0.1.0',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': NO_STORE,
        Pragma: 'no-cache',
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
  );
}

export function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: { 'Cache-Control': NO_STORE },
  });
}
