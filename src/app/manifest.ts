import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Utilify - Free Online Productivity & Utility Tools",
    short_name: "Utilify",
    description: "A professional-grade, privacy-first suite of free online utilities: background remover, PDF operations, calculators, and formatters.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
