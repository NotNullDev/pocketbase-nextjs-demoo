import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { pocketBaseClient } from "../lib/pocketbase";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    (async function () {
      try {
        const resp = await pocketBaseClient.logs.getRequestsList(1, 20);
        setLogs(resp.items);
        console.log(resp.items);
        pocketBaseClient.realtime.subscribe("logs", (data) => {
          toast(JSON.stringify(data.record, undefined, 2));
        });
        toast("wtf");
      } catch (e) {
        toast("error during receiving logs");
      }
    })();
  }, []);

  return (
    <div className="flex flex-col items-center mt-5 gap-3">
      <h1>Logs:</h1>
      <section className="bg-base-200 w-[80vw] h-[70vh] p-4 rounded-xl overflow-auto">
        {logs &&
          logs.map((log) => {
            return (
              <div className="whitespace-pre">
                {JSON.stringify(log, null, 2)}
              </div>
            );
          })}
        {!logs && <div>loading...</div>}
      </section>
    </div>
  );
}

export function LogEntity() {}
