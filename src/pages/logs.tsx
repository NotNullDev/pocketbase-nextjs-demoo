import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { pocketBaseClient } from "../lib/pocketbase";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  async function fetchLogs() {
    try {
      if (!pocketBaseClient.authStore.model) {
        return;
      }
      const resp = await pocketBaseClient.logs.getRequestsList(1, 50000, {
        sort: "-created",
      });
      setLogs(resp.items);
    } catch (e) {
      toast("error during receiving logs");
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    document.querySelector("#last")?.scrollIntoView();
  });

  if (!pocketBaseClient.authStore.model) {
    return <div>You must be logged in!</div>;
  }

  return (
    <div className="flex flex-col items-center mt-5 gap-3">
      <h1>Logs:</h1>
      <button onClick={() => fetchLogs()} className="btn btn-primary">
        refresh
      </button>
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
        <div id="last"></div>
      </section>
    </div>
  );
}

export function LogEntity() {}
