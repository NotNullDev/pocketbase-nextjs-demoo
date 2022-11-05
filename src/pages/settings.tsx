import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { pocketBaseClient } from "../lib/pocketbase";

export default function SettingsPage() {
  const [settings, setSeeings] = useState<any>();
  useEffect(() => {
    (async function () {
      try {
        const resp = await pocketBaseClient.settings.getAll();
        console.log(resp);
        toast("ok!");
        setSeeings(resp);
      } catch (e) {
        toast("error!");
      }
    })();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[80vw] h-[70vh] bg-base-200 whitespace-pre overflow-auto">
        {settings && JSON.stringify(settings, null, 2)}
      </div>
    </div>
  );
}
