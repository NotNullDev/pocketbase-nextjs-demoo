import { useEffect } from "react";
import toast from "react-hot-toast";
import { pocketBaseClient } from "../lib/pocketbase";

export default function SettingsPage() {
  useEffect(() => {
    (async function () {
      try {
        const resp = await pocketBaseClient.settings.getAll();
        console.log(resp);
        toast("ok!");
      } catch (e) {
        toast("error!");
      }
    })();
  }, []);

  return <div className="flex flex-col items-center"></div>;
}
