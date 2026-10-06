import { useEffect, useState } from 'react';
import { API, LINKS } from './constants';
import { EMPTY, readMarket, usd, type Metrics } from './market';

export function Live() {
  const [metrics, setMetrics] = useState<Metrics>(EMPTY);
  const [status, setStatus] = useState('Loading market data…');
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    let disposed = false;
    let active: AbortController | undefined;
    async function refresh() {
      active?.abort();
      const controller = new AbortController();
      active = controller;
      const timeout = window.setTimeout(() => controller.abort(), 10_000);
      try {
        const response = await fetch(API, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
        if (!response.ok) throw new Error('Market data unavailable');
        const next = readMarket(await response.json());
        if (disposed) return;
        setMetrics(next ?? EMPTY);
        setStatus(next ? 'Updates every 60 s · USD' : 'No IMD pair available yet. Retrying every 60 s.');
      } catch {
        if (disposed) return;
        setMetrics(EMPTY);
        setStatus('Data unavailable. Retrying every 60 s.');
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void refresh();
    const interval = window.setInterval(() => void refresh(), 60_000);
    return () => { disposed = true; active?.abort(); window.clearInterval(interval); };
  }, [paused]);

  return <section className="live-section" aria-labelledby="live-title">
    <div className="section-top">
      <h2 id="live-title"><span className="section-number" aria-hidden="true">01 /</span> Live</h2>
      <a className="source-link" href={LINKS.chart}>from DEX Screener <span aria-hidden="true">↗</span></a>
    </div>
    <dl className="metrics">
      {([
        ['Price (USD)', metrics.price, true],
        ['Market cap', metrics.marketCap, false],
        ['Liquidity', metrics.liquidity, false],
        ['24 h volume', metrics.volume, false],
      ] as const).map(([label, value, price]) => <div className="metric" key={label}>
        <dt>{label}</dt><dd>{usd(value, price)}</dd>
      </div>)}
    </dl>
    <div className="live-meta">
      <p role="status">{paused ? 'Updates paused. Figures may be out of date.' : status}</p>
      <button className="text-button" type="button" onClick={() => setPaused(!paused)}>{paused ? 'Resume updates' : 'Pause updates'}</button>
    </div>
    <noscript>Live figures need JavaScript. Use the DEX Screener link to view them.</noscript>
  </section>;
}
