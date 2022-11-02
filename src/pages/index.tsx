import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { pocketBaseClient } from "../lib/pocketbase";

type FileType = {
  name: string;
  url: string;
};

export default function Home() {
  const inputRef = useRef<HTMLInputElement>();
  const fileInputRef = useRef<HTMLInputElement>();
  const fileNameInputRef = useRef<HTMLInputElement>();
  const [messages, setMessages] = useState<string[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);

  useEffect(() => {
    pocketBaseClient.realtime.subscribe("messages", (e) => {
      console.log(e);
      setMessages((old) => [...old, e.record.content]);
    });

    pocketBaseClient.realtime.subscribe("files", (e) => {
      console.log(e);
      toast("new file!" + " name: " + e.record.name);
      setFiles((old) => [
        ...old,
        {
          name: e.record.name,
          url:
            "http://localhost:8090/api/files/files/" +
            e.record.id +
            "/" +
            e.record.field,
        },
      ]);
    });

    return () => {
      pocketBaseClient.realtime.unsubscribe("messages");
      pocketBaseClient.realtime.unsubscribe("files");
    };
  }, []);

  const uploadFile = () => {
    if (!fileInputRef.current) {
      toast("error: file input ref is not defined!");
      return;
    }
    if (!fileInputRef.current.files) {
      toast("error! no files detected");
      return;
    }

    if (
      !fileNameInputRef.current?.value ||
      fileNameInputRef.current?.value.trim() === ""
    ) {
      toast("file name can not be empty!");
      return;
    }

    const data = new FormData();

    for (let f of fileInputRef.current.files) {
      data.append("field", f);
    }

    data.append("name", fileNameInputRef.current?.value ?? "not provided");

    try {
      pocketBaseClient.records.create("files", data);
    } catch (e) {
      console.log(e);
      toast("could not upload file!");
    }
  };

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.addEventListener("change", uploadFile);
    }
    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.removeEventListener("change", uploadFile);
      }
    };
  }, [fileInputRef.current]);

  return (
    <div className="flex-1 flex items-start mt-20 justify-center gap-3">
      <div className="flex flex-col gap-4">
        <div>Messages:</div>
        <div className="flex flex-col w-[500px] h-[200px] overflow-y-auto border rounded border-fuchsia-400">
          {messages.map((m) => {
            return <div>{m}</div>;
          })}
        </div>
        <form>
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
        <div>File upload</div>
        <div className="flex gap-2 items-center">
          <label>Filename: </label>
          <input
            type="text"
            className="input input-bordered"
            ref={fileNameInputRef}
          />
        </div>
        <input
          type="file"
          className="file-input file-input-bordered"
          ref={fileInputRef}
        />
        <div>
          <div>Uploaded files:</div>
          <div className="border w-[500px] h-[300px]">
            {files.map((f) => {
              return (
                <div>
                  <div>{f.name}</div>
                  <a download href={f.url} className="btn btn-ghost">
                    DOWNLOAD
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
