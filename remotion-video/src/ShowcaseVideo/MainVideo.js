import { AbsoluteFill, Sequence, useCurrentFrame, Img, interpolate, Easing } from 'remotion';
import { img_01_dashboard, img_02_add_modal, img_03_mock_response, img_04_hover_card, img_05_copy_url, img_06_dashboard_viewport } from './images.js';

function fadeIn(frame, duration = 15) {
  return interpolate(frame, [0, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

function SceneTransition({ frame, duration = 12 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0b0e14',
      opacity: interpolate(frame, [0, duration / 2, duration], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      zIndex: 50,
    }} />
  );
}

const OVERLAY = 'linear-gradient(135deg, rgba(11,14,20,0.75) 0%, rgba(11,14,20,0.5) 100%)';
const ACCENT = 'linear-gradient(135deg, #38bdf8, #818cf8)';
const FH = { fontFamily: '"Outfit", sans-serif' };
const FB = { fontFamily: '"Inter", sans-serif' };

function IntroScene({ frame }) {
  const o = fadeIn(frame, 25);
  const ty = interpolate(frame, [0, 25], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });
  const so = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const to = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p = interpolate(frame % 60, [0, 30, 60], [1, 1.04, 1], { easing: Easing.inOut(Easing.ease) });

  return (
    <AbsoluteFill style={{ background: '#0b0e14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(ellipse at 50% 50%, rgba(56,189,248,0.08) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 60%)' }} />
      </div>
      <div style={{ opacity: o, transform: `translateY(${ty}px)`, textAlign: 'center' }}>
        <div style={{ transform: `scale(${p})`, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <h1 style={{ ...FH, fontSize: 72, fontWeight: 700, color: '#f0f6fc', margin: 0, letterSpacing: '-0.02em' }}>
          API <span style={{ background: ACCENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Counter</span>
        </h1>
        <p style={{ ...FB, fontSize: 22, color: '#8b949e', margin: '12px 0 0', fontWeight: 300 }}>Mock API Server with Live Request Counting</p>
        <div style={{ opacity: to, marginTop: 36 }}>
          <div style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #30363d', background: 'rgba(22,27,34,0.6)' }}>
            <p style={{ ...FB, fontSize: 16, color: '#58a6ff', margin: 0, letterSpacing: '0.05em' }}>Mock • Count • Build</p>
          </div>
        </div>
      </div>
      {frame > 140 && <SceneTransition frame={frame - 140} />}
    </AbsoluteFill>
  );
}

function DashboardScene({ frame }) {
  return (
    <AbsoluteFill style={{ background: '#0b0e14' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: fadeIn(frame, 20) }}>
        <Img src={img_01_dashboard} style={{ width: '92%', borderRadius: 12, border: '1px solid #30363d', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
      </div>
      <div style={{
        position: 'absolute', inset: 0, background: OVERLAY,
        opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 80,
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ ...FH, fontSize: 44, color: '#f0f6fc', margin: 0, marginBottom: 10 }}>Complete Management Dashboard</h2>
          <p style={{ ...FB, fontSize: 18, color: '#8b949e', margin: 0 }}>View all endpoints, track usage, and manage configurations</p>
        </div>
      </div>
      {frame > 200 && <SceneTransition frame={frame - 200} />}
    </AbsoluteFill>
  );
}

function StatsScene({ frame }) {
  const io = fadeIn(frame, 20);
  const oo = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0b0e14' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: io, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Img src={img_06_dashboard_viewport} style={{ width: '95%', borderRadius: 12, border: '1px solid #30363d', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: OVERLAY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {oo > 0 && (
          <div style={{ opacity: oo, display: 'flex', gap: 40 }}>
            {[['Total APIs', '6'], ['Total Calls', '13']].map(([l, v], i) => (
              <div key={i} style={{ background: 'rgba(22,27,34,0.9)', border: '1px solid #30363d', borderRadius: 16, padding: '28px 44px', textAlign: 'center' }}>
                <p style={{ ...FB, fontSize: 13, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, marginBottom: 8 }}>{l}</p>
                <p style={{ ...FH, fontSize: 52, fontWeight: 700, margin: 0, background: ACCENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {frame > 200 && <SceneTransition frame={frame - 200} />}
    </AbsoluteFill>
  );
}

function AddEndpointScene({ frame }) {
  const io = fadeIn(frame, 20);
  const lo = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ly = interpolate(frame, [30, 50], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });

  return (
    <AbsoluteFill style={{ background: '#0b0e14' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: io }}>
        <Img src={img_02_add_modal} style={{ width: '80%', borderRadius: 12, border: '1px solid #30363d', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: OVERLAY, opacity: lo, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', transform: `translateY(${ly}px)` }}>
          <h2 style={{ ...FH, fontSize: 42, color: '#f0f6fc', margin: 0, marginBottom: 10 }}>Register Any API Path</h2>
          <p style={{ ...FB, fontSize: 18, color: '#8b949e', margin: 0 }}>Create endpoints on the fly — just type a path and submit</p>
        </div>
      </div>
      {frame > 190 && <SceneTransition frame={frame - 190} />}
    </AbsoluteFill>
  );
}

function MockResponseScene({ frame }) {
  const io = fadeIn(frame, 20);
  const lo = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0b0e14' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: io }}>
        <Img src={img_03_mock_response} style={{ height: 450, borderRadius: 12, border: '1px solid #30363d', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
      </div>
      <div style={{
        position: 'absolute', inset: 0, background: OVERLAY, opacity: lo,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 80,
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ ...FH, fontSize: 40, color: '#f0f6fc', margin: 0, marginBottom: 10 }}>Instant Mock Responses</h2>
          <p style={{ ...FB, fontSize: 18, color: '#8b949e', margin: 0 }}>Each request returns a JSON payload with endpoint name, count, and timestamp</p>
        </div>
      </div>
      {frame > 190 && <SceneTransition frame={frame - 190} />}
    </AbsoluteFill>
  );
}

function FeaturesScene({ frame }) {
  const io = fadeIn(frame, 20);
  const features = [
    { svg: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3', label: 'Copy URL', desc: 'One-click with visual feedback' },
    { svg: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15', label: 'Reset Counts', desc: 'Individual or bulk counter reset' },
    { svg: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2', label: 'Delete Endpoints', desc: 'Remove endpoints you no longer need' },
    { svg: 'M22 12h-4l-3 9L9 3l-3 9H2', label: 'Live Polling', desc: 'Dashboard refreshes every 2 seconds' },
  ];

  const fo = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0b0e14' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: io, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Img src={img_05_copy_url} style={{ width: '92%', borderRadius: 12, border: '1px solid #30363d', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,14,20,0.65) 0%, rgba(11,14,20,0.45) 100%)', opacity: fo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ ...FH, fontSize: 34, color: '#f0f6fc', margin: 0, marginBottom: 40 }}>Everything You Need</h2>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000 }}>
          {features.map((f, i) => {
            const co = interpolate(frame, [40 + i * 14, 55 + i * 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const cy = interpolate(frame, [40 + i * 14, 55 + i * 14], [25, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });
            return (
              <div key={i} style={{ opacity: co, transform: `translateY(${cy}px)`, background: 'rgba(22,27,34,0.92)', border: '1px solid #30363d', borderRadius: 14, padding: '24px 28px', width: 210, textAlign: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 14 }}>
                  <path d={f.svg} />
                </svg>
                <h3 style={{ ...FH, fontSize: 17, color: '#f0f6fc', margin: 0, marginBottom: 6 }}>{f.label}</h3>
                <p style={{ ...FB, fontSize: 13, color: '#8b949e', margin: 0 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      {frame > 280 && <SceneTransition frame={frame - 280} />}
    </AbsoluteFill>
  );
}

function OutroScene({ frame }) {
  const o = fadeIn(frame, 25);
  const ty = interpolate(frame, [0, 30], [25, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });

  const benefits = [
    ['Zero Configuration', 'Start mocking in seconds — no setup required'],
    ['Real-time Visibility', 'Watch API calls increment live on the dashboard'],
    ['Developer-First Tool', 'Built for frontend devs, testers, and QA engineers'],
    ['Portable & Lightweight', 'Run locally or deploy to Vercel in minutes'],
  ];

  return (
    <AbsoluteFill style={{ background: '#0b0e14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-30%', left: '-20%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 60%)' }} />
      </div>
      <div style={{ opacity: o, transform: `translateY(${ty}px)`, textAlign: 'center', marginBottom: 44 }}>
        <h2 style={{ ...FH, fontSize: 44, color: '#f0f6fc', margin: 0, marginBottom: 10 }}>Why API Counter?</h2>
        <p style={{ ...FB, fontSize: 17, color: '#8b949e', margin: 0 }}>The simplest way to create countable mock API endpoints</p>
      </div>
      <div style={{ opacity: o, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, maxWidth: 760 }}>
        {benefits.map(([t, d], i) => {
          const co = interpolate(frame, [20 + i * 10, 35 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const cx = interpolate(frame, [20 + i * 10, 35 + i * 10], [i % 2 === 0 ? -15 : 15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });
          return (
            <div key={i} style={{ opacity: co, transform: `translateX(${cx}px)`, background: 'rgba(22,27,34,0.88)', border: '1px solid #30363d', borderRadius: 12, padding: '22px 26px' }}>
              <div style={{ width: 24, height: 3, background: ACCENT, borderRadius: 2, marginBottom: 10 }} />
              <h3 style={{ ...FH, fontSize: 17, color: '#f0f6fc', margin: 0, marginBottom: 4 }}>{t}</h3>
              <p style={{ ...FB, fontSize: 14, color: '#8b949e', margin: 0 }}>{d}</p>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), marginTop: 44 }}>
        <div style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #30363d', background: 'rgba(22,27,34,0.6)' }}>
          <p style={{ ...FB, fontSize: 15, color: '#58a6ff', margin: 0 }}>npm start &mdash; and you're ready to mock</p>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function MainVideo() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#0b0e14' }}>
      <Sequence from={0} durationInFrames={165}>
        <IntroScene frame={frame} />
      </Sequence>
      <Sequence from={150} durationInFrames={230}>
        <DashboardScene frame={frame - 150} />
      </Sequence>
      <Sequence from={365} durationInFrames={230}>
        <StatsScene frame={frame - 365} />
      </Sequence>
      <Sequence from={580} durationInFrames={220}>
        <AddEndpointScene frame={frame - 580} />
      </Sequence>
      <Sequence from={785} durationInFrames={220}>
        <MockResponseScene frame={frame - 785} />
      </Sequence>
      <Sequence from={990} durationInFrames={340}>
        <FeaturesScene frame={frame - 990} />
      </Sequence>
      <Sequence from={1315} durationInFrames={230}>
        <OutroScene frame={frame - 1315} />
      </Sequence>
    </AbsoluteFill>
  );
}
