export const metadata = {
  title: "WCTL Liens AI",
  description: "West Coast Trial Lawyers — Liens Command Center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0c0e14" }}>
        {children}
      </body>
    </html>
  );
}
