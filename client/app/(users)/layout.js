import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Script from 'next/script';

import { ToastContainer } from 'react-toastify';
import { getPixelCode } from '../lib/getPixelCode';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function RootLayout({ children }) {
  const pixel = await getPixelCode();
  const pixelCode = pixel?.code;

  return (
    <html lang="en">
      <head>
        {pixelCode && (
          <Script
            id="meta-pixel"
            strategy="beforeInteractive" // server-side render
            dangerouslySetInnerHTML={{ __html: pixelCode }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8">
          {children}

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>
      </body>
    </html>
  );
}
