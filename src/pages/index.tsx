import { useEffect, useRef, useState } from "react";
import { pocketBaseClient } from "../lib/pocketbase";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    pocketBaseClient.realtime.subscribe("messages", (e) => {
      console.log(e);
      setMessages((old) => [...old, e.record.content]);
    });

    (async function () {
      try {
        const initMessages = await pocketBaseClient.records.getFullList(
          "messages"
        );
        const msgs = initMessages.map((m) => m.content);
        console.log(msgs);
        setMessages(msgs);
      } catch (e) {
        console.log(e);
      }
    })();

    return () => {
      pocketBaseClient.realtime.unsubscribe("messages");
    };
  }, []);

  useEffect(() => {
    document.querySelector("#last")?.scrollIntoView();
  });

  return (
    <div className="flex-1 flex items-start mt-20 justify-center gap-3">
      <div className="flex flex-col gap-4">
        <div>Messages:</div>
        <div className="flex flex-col w-[500px] h-[200px] overflow-y-auto bg-gradient-to-bl from-violet-500 to-orange-700 rounded-xl">
          {messages.map((m) => {
            return (
              <div className="w-1/2 bg-base-200 m-3 rounded-xl p-2 shadow-md">
                {m}
              </div>
            );
          })}
          <div id="last"></div>
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
