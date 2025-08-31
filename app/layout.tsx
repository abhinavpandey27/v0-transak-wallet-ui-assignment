import type React from "react"
import type { Metadata } from "next"
import {
  Instrument_Sans,
  Inter,
  IBM_Plex_Sans,
  Manrope,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Be_Vietnam_Pro,
} from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { BrandingProvider } from "@/contexts/BrandingContext"
import { SpeedInsights } from "@vercel/speed-insights/next"

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-instrument-sans",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
})

export const metadata: Metadata = {
  title: "Transak Wallet UI",
  description: "A comprehensive crypto wallet interface with customizable fonts",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVariables = [
    instrumentSans.variable,
    inter.variable,
    ibmPlexSans.variable,
    manrope.variable,
    plusJakartaSans.variable,
    spaceGrotesk.variable,
    beVietnamPro.variable,
  ].join(" ")

  return (
    <html lang="en" className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <body>
        {/* Initialize brand CSS vars early to avoid FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              try {
                var raw = localStorage.getItem('branding-config');
                if (!raw) return;
                var cfg = JSON.parse(raw);
                var hex = (cfg && cfg.brandHex) || '#2563eb';
                function norm(h){h=String(h||'').trim();return /^#?[0-9a-fA-F]{6}$/.test(h)?(h[0]==='#'?h:'#'+h):'#2563eb'}
                function h2r(h){h=norm(h).slice(1);return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}}
                function rl(c){var s=[c.r,c.g,c.b].map(function(v){v/=255;return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4)});return 0.2126*s[0]+0.7152*s[1]+0.0722*s[2]}
                function cr(a,b){var L1=rl(a),L2=rl(b);var lighter=Math.max(L1,L2),darker=Math.min(L1,L2);return (lighter+0.05)/(darker+0.05)}
                function r2h(c){return '#'+[c.r,c.g,c.b].map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return v.toString(16).padStart(2,'0')}).join('')}
                function adj(rgb,d){function r2hsl(r,g,b){r/=255;g/=255;b/=255;var max=Math.max(r,g,b),min=Math.min(r,g,b);var h=0,s=0,l=(max+min)/2; if(max!==min){var d=max-min; s=l>0.5? d/(2-max-min): d/(max+min); switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break} h/=6} return {h:h,s:s,l:l}}; function hsl2rgb(h,s,l){if(s===0){var v=Math.round(l*255);return{r:v,g:v,b:v}} function hue2rgb(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p}; var q=l<0.5? l*(1+s): l+s-l*s; var p=2*l-q; var r=hue2rgb(p,q,h+1/3), g=hue2rgb(p,q,h), b=hue2rgb(p,q,h-1/3); return {r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)}}; var h=r2hsl(rgb.r,rgb.g,rgb.b); var l2=Math.max(0,Math.min(1,h.l + d/100)); return hsl2rgb(h.h,h.s,l2)}
                var rgb = h2r(hex); var black={r:0,g:0,b:0}, white={r:255,g:255,b:255}; var fg = cr(rgb,black) >= cr(rgb,white) ? '#000000' : '#ffffff';
                var target = fg==='#000000'? black: white; var bg = {r:rgb.r,g:rgb.g,b:rgb.b}; var i=0; while(cr(bg,target)<4.5 && i<20){ var d = fg==='#000000' ? -3 : 3; bg = adj(bg,d); i++ }
                var root = document.documentElement; var finalHex = r2h(bg); root.style.setProperty('--brand', finalHex); root.style.setProperty('--brand-foreground', fg); root.style.setProperty('--primary', finalHex); root.style.setProperty('--primary-foreground', fg);
                var hov=adj(bg,-8); var act=adj(bg,-14); root.style.setProperty('--brand-hover', r2h(hov)); root.style.setProperty('--brand-active', r2h(act)); root.style.setProperty('--brand-ring', 'rgba('+bg.r+','+bg.g+','+bg.b+',0.4)');
              } catch(e){}
            })();
          `,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
          <BrandingProvider>
            <AuthProvider>{children}</AuthProvider>
          </BrandingProvider>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
