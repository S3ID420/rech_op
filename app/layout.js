import './globals.css';
import 'leaflet/dist/leaflet.css';
export const metadata = {
  title: 'Irrigation System Optimization',
  description: 'maximize the flow of water in an irrigation system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}