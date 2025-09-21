export const metadata = { title: "Kambaz / Labs - Cocochoi", description: "A1 - Next.js implementation" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (<html lang="en"><body>{children}</body></html>);
}
