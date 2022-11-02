import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { pocketBaseClient } from "../lib/pocketbase";

type FileType = {
  name: string;
  url: string;
};

export default function FileUploadPage() {
  const [files, setFiles] = useState<FileType[]>([]);
  const fileNameInputRef = useRef<HTMLInputElement>();
  const fileInputRef = useRef<HTMLInputElement>();

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

  const subscribeToFiles = () => {
    pocketBaseClient.realtime.subscribe("files", (e) => {
      setFiles((old) => [
        ...old,
        {
          name: e.record.name,
          url:
            "http://localhost:" +
            process.env.NEXT_PUBLIC_POCKETBASE_PORT +
            "/api/files/files/" +
            e.record.id +
            "/" +
            e.record.field,
        },
      ]);
    });
  };

  useEffect(() => {
    subscribeToFiles();
  }, []);

  function uploadFile() {
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
  }

  return (
    <>
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
    </>
  );
}
