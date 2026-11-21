/** Slow-moving blurred colour blobs behind the page (pure CSS, see .aurora in index.css). */
export default function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__blob aurora__blob--orange" />
      <span className="aurora__blob aurora__blob--violet" />
      <span className="aurora__blob aurora__blob--cyan" />
    </div>
  );
}
