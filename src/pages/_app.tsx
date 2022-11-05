import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-w-screen min-h-screen flex flex-col transition-all duration-1000">
      <Toaster
        position="top-right"
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
      <button className="btn btn-ghost" onClick={() => router.push("/files")}>
        Files
      </button>
      <button className="btn btn-ghost" onClick={() => router.push("/login")}>
        Login
      </button>
      <button className="btn btn-ghost" onClick={() => router.push("/logs")}>
        Logs
      </button>
      <button
        className="btn btn-ghost"
        onClick={() => router.push("/settings")}
      >
        Settings
      </button>
    </div>
  );
}
