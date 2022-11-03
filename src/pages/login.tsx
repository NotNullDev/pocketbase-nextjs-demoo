import { useRouter } from "next/router";
import { Admin, User } from "pocketbase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { pocketBaseClient } from "../lib/pocketbase";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | Admin | undefined>();

  useEffect(() => {
    if (pocketBaseClient.authStore.model) {
      setUser(pocketBaseClient.authStore.model);
    }
  }, []);

  const { code } = router.query;

  useEffect(() => {
    (async function () {
      if (!code) {
        return;
      }

      const provider = JSON.parse(localStorage.getItem("google") ?? "{}");
      if (!provider) {
        toast("verification code is missing!");
        return;
      }
      console.log(provider);

      try {
        const response = await pocketBaseClient.users.authViaOAuth2(
          "google",
          code as string,
          provider.codeVerifier,
          "http://localhost:3000/login"
        );
        console.log(response);
      } catch (e) {
        console.log(e);
      }
      toast("ok!");
    })();
  }, [code]);

  return (
    <div className="flex flex-1 bg-violet-500 items-start justify-center p-4">
      <div>
        <button
          className="btn btn-secondary"
          onClick={async () => {
            try {
              const authMethods =
                await pocketBaseClient.users.listAuthMethods();

              const googleProvider = authMethods.authProviders.find(
                (p) => p.name === "google"
              );
              if (!googleProvider) {
                toast("google auth not available!");
                return;
              }

              localStorage.setItem("google", JSON.stringify(googleProvider));

              window.location.href =
                googleProvider.authUrl + "http://localhost:3000/login";
            } catch (e) {
              console.log("Something went wrong...");
              console.error(e);
              toast("login error! " + e);
            }
          }}
        >
          Login with Google
        </button>
        <button
          className="btn btn-error"
          onClick={() => {
            pocketBaseClient.authStore.clear();
          }}
        >
          Logout
        </button>
        <div>
          {user && (
            <div>
              <h2>User info:</h2>
              <div>ID: {user.id}</div>
              <div>Email: {user.email}</div>
              <div>Created at: {user.created}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
