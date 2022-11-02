import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-w-screen min-h-screen flex flex-col">
      <Toaster
        toastOptions={{
          className: "alert alert-info",
        }}
      />
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

function Header() {
  const router = useRouter();
  return (
    <div className="p-4 w-full">
      <button className="btn btn-ghost" onClick={() => router.push("/")}>
        Home
      </button>
    </div>
  );
}
