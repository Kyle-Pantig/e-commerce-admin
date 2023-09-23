import HandleContextProvider from "@/components/HandleContext";
import "@/styles/globals.css";
import "@/styles/stats.css"
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <HandleContextProvider>
        <Component {...pageProps} />
      </HandleContextProvider>
    </SessionProvider>
  );
}
