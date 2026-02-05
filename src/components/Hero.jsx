import heroImage from "../assets/images/hero.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Welcome to RilyBricoule</h1>
        <p>
          Trouvez rapidement un professionnel de confiance près de chez vous et
          réservez en toute simplicité.
        </p>

        <div className="hero-buttons">
          <button className="btn">Login</button>
          <button className="btn primary">Sign In</button>
        </div>
      </div>

      <div className="hero-image">
        <img src={heroImage} alt="RilyBricoule illustration" />
      </div>
    </section>
  );
}

export default Hero;
