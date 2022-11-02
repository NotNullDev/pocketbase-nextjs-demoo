import { useEffect, useRef, useState } from "react";
import { pocketBaseClient } from "../lib/pocketbase";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    pocketBaseClient.realtime.subscribe("messages", (e) => {
      console.log(e);
      setMessages((old) => [...old, e.record.content]);
    });

    return () => {
      pocketBaseClient.realtime.unsubscribe("messages");
    };
  }, []);



  return (
    <div className="flex-1 flex items-start mt-20 justify-center gap-3">
      <div className="flex flex-col gap-4">
        <div>Messages:</div>
        <div className="flex flex-col w-[500px] h-[200px] overflow-y-auto border rounded border-fuchsia-400">
          {messages.map((m) => {
            return <div>{m}</div>;
          })}
        </div>
        <form key={messages.length}>
          <input ref={inputRef} className="input input-bordered" />
          <button
            className="btn btn-ghost"
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              try {
                const record = await pocketBaseClient.records.create(
                  "messages",
                  {
                    content: inputRef.current?.value ?? "ERROR",
                  }
                );
              } catch (e) {
                console.log(e);
              }
              console.log("aa!");
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
