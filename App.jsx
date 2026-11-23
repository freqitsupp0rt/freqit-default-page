import Aurora from './Aurora.jsx';
import FuzzyText from './FuzzyText.jsx';
import Particles from './Particles.jsx';
import ShinyText from './ShinyText.jsx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js';

const COMPANY_NAME = 'FREQ IT SOLUTIONS';
const COMPANY_URL = 'https://freqitsolutions.net';

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const requestedHost = window.location.host;

  return (
    <main className="page">
      <Aurora />
       <Particles rgb="148, 163, 184" paused={reducedMotion} />

      <section className="content">
        <p className="badge reveal" style={{ '--delay': '0ms' }}>
          <span className="badge__dot" aria-hidden="true" />
          Error 404
        </p>

        <div className="reveal" style={{ '--delay': '120ms' }}>
          <FuzzyText text="404" paused={reducedMotion} />
        </div>

        <h1 className="title reveal" style={{ '--delay': '240ms' }}>
          <ShinyText text="Nothing lives here" disabled={reducedMotion} />
        </h1>

        <p className="subtitle reveal" style={{ '--delay': '360ms' }}>
          There is no website at <span className="host">{requestedHost}</span>.
          <br />
          Check the address, or head over to our main site.
        </p>

        <a className="button reveal" style={{ '--delay': '480ms' }} href={COMPANY_URL} rel="noopener">
          Visit {COMPANY_NAME}
          <span className="button__arrow" aria-hidden="true">→</span>
        </a>
      </section>

      <footer className="footer reveal" style={{ '--delay': '600ms' }}>
        © {new Date().getFullYear()} {COMPANY_NAME}
      </footer>
    </main>
  );
}
