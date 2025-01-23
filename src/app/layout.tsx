import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ABR TUTORS - Expert Math Tutoring",
  description:
    "Expert math tutoring services in Port Elizabeth. Book your session today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
