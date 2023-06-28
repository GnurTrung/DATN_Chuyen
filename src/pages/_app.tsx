import "antd/dist/reset.css";
import "@/styles/custom.scss";
import "@/styles/globals.css";
import cx from "classnames";
import type { AppProps } from "next/app";
import { Public_Sans } from "next/font/google";
import { VenomProvider } from "../contexts/useVenomConnect";
import Footer from "@/components/footer";
import Header from "@/components/header";
import LeftSideMenu from "@/components/side-menu/LeftSideMenu";
import RightSideMenu from "@/components/side-menu/RightSideMenu";
import MobileSideMenu from "@/components/side-menu/MobileSideMenu";
import { Toaster } from "react-hot-toast";
import Meta from "@/layout/Meta";
import Script from "next/script";
import ApplicationProvider from "@/contexts/useApplication";
import { WalletKitProvider } from "@mysten/wallet-kit";

const public_sans = Public_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletKitProvider>
      <VenomProvider>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-M7D54BBLR2"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-M7D54BBLR2', {
        page_path: window.location.pathname,
        });
        `,
          }}
        />
        <ApplicationProvider>
          <main
            className={cx(
              public_sans.className,
              "min-h-screen flex flex-col justify-between w-full"
            )}
          >
            <Meta
              title="ChuyenDT"
              description="ChuyenDT | The best marketplace on Sui Network"
            />
            <Header />
            <div className="flex items-start justify-between flex-1 px-2 sm:layout pt-4">
              <MobileSideMenu />
              <LeftSideMenu />
              <div className="px-2 sm:px-8 flex-1 w-0">
                <Toaster />
                <Component {...pageProps} />
              </div>
              {<RightSideMenu />}
            </div>
            <Footer />
          </main>
        </ApplicationProvider>
      </VenomProvider>
    </WalletKitProvider>
  );
}
