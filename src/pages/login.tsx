import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { pocketBaseClient } from "../lib/pocketbase";
import { useUserStore } from "../lib/userStore";

export default function LoginPage() {
  const currentUser = useUserStore((state) => state.user);
  const setCurrentUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);

  const router = useRouter();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

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
    <div className="flex flex-1 bg-violet-500 items-start justify-center p-4 gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
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
            onClick={async () => {
              logout();
            }}
          >
            Logout
          </button>
        </div>
        <form className="flex flex-col gap-2 mt-4 p-3 bg-primary rounded-xl">
          <input
            className={"input"}
            placeholder="email"
            ref={usernameInputRef}
          />
          <input
            className={"input"}
            placeholder="password"
            ref={passwordInputRef}
          />
          <button
            className="btn btn-glass"
            onClick={async (e) => {
              e.preventDefault();

              toast("auth started");
              try {
                const resp = await pocketBaseClient.admins.authViaEmail(
                  usernameInputRef.current?.value ?? "",
                  passwordInputRef.current?.value ?? ""
                );
              } catch (e) {
                toast("auth failed, trying to create account");
                console.log(e);
                try {
                  const resp1 = await pocketBaseClient.admins.create({
                    email: usernameInputRef.current?.value,
                    password: passwordInputRef.current?.value,
                    passwordConfirm: passwordInputRef.current?.value,
                  });
                } catch (e1) {
                  toast("account creation failed");
                  console.log(e1);
                }
              }
              toast("auth ok");
            }}
          >
            Login
          </button>
        </form>

        <div>
          {currentUser && (
            <div>
              <h2>User info:</h2>
              <div>ID: {currentUser.id}</div>
              <div>Email: {currentUser.email}</div>
              <div>Created at: {currentUser.created}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
