import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Le quiz du Day 3 a été scindé en deux arènes : la révision du Day 1 et
      // le vocabulaire. Les anciens liens et favoris arrivaient sur un 404.
      { source: "/day3/quiz", destination: "/day3/quiz-vocabulary", permanent: true },
      { source: "/day3/quiz/join", destination: "/day3/join", permanent: true },
      // Le module a été renommé avant d'être publié, mais le lien a pu circuler.
      { source: "/day3/recap", destination: "/day3/briefing", permanent: true },
    ];
  },
};

export default nextConfig;
