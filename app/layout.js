import "./globals.css";
import Script from "next/script";
import ScaleInit from "@/components/ScaleInit";

export const metadata = {
  title: "Portfolio",
  description: "Personal portfolio home",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="apply-scale" strategy="beforeInteractive">{`
          (function() {
            function applyScale() {
              var baseWidth = 1485;
              var scale = window.innerWidth < 768 ? 1 : window.innerWidth / baseWidth;
              document.documentElement.style.zoom = scale;
              var realVh = (window.innerHeight / scale) * 0.01;
              document.documentElement.style.setProperty('--real-vh', realVh + 'px');
            }
            applyScale();
            window.addEventListener('resize', applyScale);
          })();
        `}</Script>
      </head>
      <body className="app-body" suppressHydrationWarning>
        <ScaleInit />
        {children}
      </body>
    </html>
  );
}