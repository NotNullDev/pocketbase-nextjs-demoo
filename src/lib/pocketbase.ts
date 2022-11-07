import PocketBase from "pocketbase";

const serverUrl = process.env.POCKETBASE_URL ?? "http://localhost:8090";

export const pocketBaseClient = new PocketBase(serverUrl);
