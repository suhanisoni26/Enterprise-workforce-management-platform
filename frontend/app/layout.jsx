import './globals.css';

export const metadata = {
  title: 'Nexora Workforce',
  description: 'Intelligent workforce operations for modern companies.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
