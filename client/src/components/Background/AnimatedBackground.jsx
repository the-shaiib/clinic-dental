import './AnimatedBackground.css';

function AnimatedBackground() {
  return (
    <div className="animated-background" aria-hidden="true">
      <span className="bg-gradient-layer bg-gradient-base"></span>
      <span className="bg-gradient-layer bg-gradient-overlay"></span>
      <span className="bg-matte-texture"></span>
      <span className="bg-glow glow-left"></span>
      <span className="bg-glow glow-right"></span>
      <span className="bg-glow glow-bottom"></span>
    </div>
  );
}

export default AnimatedBackground;
