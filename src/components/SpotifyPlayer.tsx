const SpotifyPlayer = () => {
  // Replace with actual Elegia L.C. Spotify embed when available
  const spotifyEmbedUrl = "https://open.spotify.com/embed/artist/2li90ydgYRoA5saOmkw0wR"; // Placeholder

  return (
    <section id="musica" className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-tight">
            Nossa Música
          </h2>
          <div className="h-1 w-32 bg-primary mx-auto mb-12" />
          
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Ouça nosso som no Spotify
          </p>

          <div className="rounded-sm overflow-hidden shadow-2xl border border-border">
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Elegia L.C. on Spotify"
              className="w-full"
            />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Disponível também em todas as plataformas digitais
          </p>
        </div>
      </div>
    </section>
  );
};

export default SpotifyPlayer;
