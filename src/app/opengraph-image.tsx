import { ImageResponse } from 'next/og';
import { BRAND_CONFIG } from '@/config/brand';

export const alt = 'Yoursthing — Everyday Tools. Simplified for you.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0b101d 0%, #121829 60%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
          padding: '40px',
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
          }}
        />

        {/* Logo Geometric Y Mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <svg
            width="90"
            height="90"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ogGrad1" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#121829" stroke="url(#ogGrad1)" strokeWidth="6" />
            <path
              d="M 28 30 L 48 56 L 48 76"
              stroke="url(#ogGrad1)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 72 30 L 48 56"
              stroke="url(#ogGrad1)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="22" r="5.5" fill="#F59E0B" />
          </svg>
        </div>

        {/* Brand Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '-1px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#ffffff' }}>Yours</span>
          <span
            style={{
              background: 'linear-gradient(to right, #38bdf8, #818cf8)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            thing
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#94a3b8',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          {BRAND_CONFIG.tagline}
        </div>

        {/* Highlights Pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            100% Free & Private
          </div>
          <div
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#c4b5fd',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            Client-Side Processing
          </div>
          <div
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#6ee7b7',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            18+ Utilities
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
