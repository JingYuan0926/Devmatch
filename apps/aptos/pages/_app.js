import "../styles/globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { WalletProvider } from "../components/WalletProvider";
import { AutoConnectProvider } from "../components/AutoConnectProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] })

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AutoConnectProvider>
        <WalletProvider>
          <Component {...pageProps} />
        </WalletProvider>
      </AutoConnectProvider>
    </ThemeProvider>
  );
}

export default MyApp;