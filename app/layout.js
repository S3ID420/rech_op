import './globals.css';

export const metadata = {
  title: 'Network Flow Solver',
  description: 'Max Flow Problem Solver with React Flow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}