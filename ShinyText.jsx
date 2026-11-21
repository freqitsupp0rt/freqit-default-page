/** Text with a light sweep moving across it (animation lives in .shiny-text in index.css). */
export default function ShinyText({ text, speedSeconds = 3, disabled = false, className = '' }) {
  const classes = ['shiny-text', disabled ? 'shiny-text--disabled' : '', className].filter(Boolean).join(' ');

  return (
    <span className={classes} style={{ '--shine-duration': `${speedSeconds}s` }}>
      {text}
    </span>
  );
}
