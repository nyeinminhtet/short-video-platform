import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "@/config/config";

const App = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <GoogleOAuthProvider clientId={`${config.googleId}`}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
};
export default App;
