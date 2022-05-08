import { Auth, Storage } from "aws-amplify";

export async function uploadImageS3(key, file) {
  try {
    await Storage.put(key, file);
  } catch (e) {
    console.log("ERROR::", e);
  }
}

export async function getS3Image(key) {
  return await Storage.get(key);
}

export async function deleteS3Image(key) {
  await Storage.remove(key);
}
