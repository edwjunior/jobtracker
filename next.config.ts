import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Los PDFs del perfil se suben con una Server Action (límite por defecto: 1 MB).
    // Tope de 5 MB por PDF + margen del multipart; la validación exacta está en la acción.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
