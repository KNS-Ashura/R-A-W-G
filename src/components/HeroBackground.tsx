type HeroBackgroundProps = {
  imageUrl: string
}

export function HeroBackground({ imageUrl }: HeroBackgroundProps) {
  return (
    <div className="rawg-hero-bg" aria-hidden>
      <img
        src={imageUrl}
        alt=""
        className="rawg-hero-bg__fill"
        loading="eager"
        decoding="async"
      />
      <img
        src={imageUrl}
        alt=""
        className="rawg-hero-bg__main"
        loading="eager"
        decoding="async"
      />
    </div>
  )
}
