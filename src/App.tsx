import { useRef, useState } from 'react';
import { CLAIM, CONTRACT, LINKS } from './constants';
import { Live } from './Live';

function Arrow() { return <span aria-hidden="true">↗</span>; }

function CopyContract() {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const address = useRef<HTMLElement>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
      setMessage('Contract address copied.');
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      if (address.current) {
        range.selectNodeContents(address.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setCopied(false);
      setMessage('Copy unavailable. Select and copy the full address above.');
    }
  }
  return <div className="contract-block">
    <p className="eyebrow" id="contract-label">Token contract</p>
    <div className="contract-row">
      <code ref={address} aria-labelledby="contract-label" dir="ltr">{CONTRACT}</code>
      <button className="copy-button" type="button" onClick={() => void copy()} aria-label={copied ? 'Copy contract address again' : 'Copy contract address'}>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M12 4V3H3v9h1"/></svg>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
    <p className="copy-status" role="status">{message}</p>
  </div>;
}

export function App() {
  const [motionPaused, setMotionPaused] = useState(false);
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header shell">
      <a className="wordmark" href="#main" aria-label="Daemon home"><span aria-hidden="true">&gt;_</span> daemon</a>
      <span className="network"><span className="network-dot" aria-hidden="true"/>Ethereum mainnet</span>
    </header>
    <main id="main" className="shell" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-label">IMD swarm <span aria-hidden="true">/</span> Launch No. 745</p>
          <h1 id="hero-title">DAEMON<span className={`cursor ${motionPaused ? 'is-paused' : ''}`} aria-hidden="true"/></h1>
          <p className="tagline">Never stop the daemon.</p>
          <p className="hero-description">A community token for the people who keep the IMD swarm running.</p>
          <CopyContract />
          <div className="hero-actions">
            <a className="button button-primary" href={LINKS.buy}>Buy on Uniswap <Arrow /></a>
            <a className="button" href={LINKS.chart}>Chart <Arrow /></a>
            <a className="button" href={LINKS.etherscan}>Etherscan <Arrow /></a>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-frame">
            <div className="art-corner top-left"/><div className="art-corner top-right"/>
            <img src="./assets/daemon.png" width="1024" height="1024" alt="Daemon, a horned terminal with green eyes." fetchPriority="high" />
            <div className="art-corner bottom-left"/><div className="art-corner bottom-right"/>
          </div>
          <p className="art-caption"><span aria-hidden="true">[</span> Made by the IMD swarm <span aria-hidden="true">]</span></p>
        </div>
      </section>
      <Live />
      <section className="content-section token-section" aria-labelledby="token-title">
        <div className="section-intro">
          <h2 id="token-title"><span className="section-number" aria-hidden="true">02 /</span> The token</h2>
          <a className="inline-link" href={LINKS.source}>View source code <Arrow /></a>
        </div>
        <div className="token-content">
          <ul className="token-facts">
            <li><span className="fact-label">Identity</span><span>Daemon <span className="muted">/</span> DAEMON <span className="muted">/</span> Ethereum mainnet</span></li>
            <li><span className="fact-label">Supply</span><span><strong>1,000,000,000</strong> <span className="muted">/ fixed</span></span></li>
            <li><span className="fact-label">Rules</span><span>No fees, no minting after launch, no owner powers, no transfer rules.</span></li>
          </ul>
          <div className="allocation">
            <h3>Launched through the IMD swarm <span className="muted">/ No. 745</span></h3>
            <div className="allocation-bar" aria-hidden="true"><span/><span/><span/></div>
            <ul className="allocation-list">
              <li><strong>88%</strong><p>of the supply opened a Uniswap v4 pool paired with IMD at a 500 IMD market cap.</p></li>
              <li><strong>10%</strong><p>went to the swarm agents that built and audited it.<span className="claim">Claimable from <a href={`https://etherscan.io/address/${CLAIM}`}><code>{CLAIM}</code> <Arrow /></a></span></p></li>
              <li><strong>2%</strong><p>to the launching wallet.</p></li>
            </ul>
          </div>
        </div>
      </section>
      <section className="content-section swarm-section" aria-labelledby="swarm-title">
        <div className="section-top"><h2 id="swarm-title"><span className="section-number" aria-hidden="true">03 /</span> Made by the swarm</h2></div>
        <p className="section-description">The token, its logo and this page were all made by the IMD swarm.</p>
        <div className="swarm-cards">
          <a className="swarm-card" href={LINKS.tokenJob}><span className="card-icon" aria-hidden="true">&lt;/&gt;</span><h3>Token</h3><span className="card-link">View token job <Arrow /></span></a>
          <a className="swarm-card" href={LINKS.logoJob}><span className="card-icon" aria-hidden="true">[*]</span><h3>Logo</h3><span className="card-link">View logo job <Arrow /></span></a>
          <div className="swarm-card static-card"><span className="card-icon" aria-hidden="true">&gt;_</span><h3>This page</h3><p>built and pinned to IPFS by the swarm</p></div>
        </div>
      </section>
      <section className="content-section node-section" aria-labelledby="node-title">
        <h2 id="node-title"><span className="section-number" aria-hidden="true">04 /</span> Run a node</h2>
        <div><p>The IMD swarm is run by identity.md NFT holders on their own machines.</p><div className="node-links"><a className="inline-link" href="https://imd.fun">imd.fun <Arrow /></a><a className="inline-link" href="https://explorer.imd.fun">Swarm explorer <Arrow /></a></div></div>
      </section>
    </main>
    <footer className="site-footer shell">
      <div className="footer-mark" aria-hidden="true">&gt;_</div>
      <p>Community token. No team, no roadmap, no promises. Not affiliated with the IMD developer. Nothing here is financial advice.</p>
      <button className="text-button motion-button" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? 'Resume cursor' : 'Pause cursor'}</button>
    </footer>
  </>;
}
