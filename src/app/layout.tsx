import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// Una sola familia: anchura condensada en cintas y etiquetas, normal para leer.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "JobTracker",
  description: "Evalúa y haz seguimiento de tus ofertas de empleo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
