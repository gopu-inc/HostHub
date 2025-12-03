export const metadata = {
  title: 'HostHub',
  description: 'Réseau social pour développeurs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  );
}
