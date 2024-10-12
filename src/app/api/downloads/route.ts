import path from "path";
import os from "os";
import fs from "fs";
import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import ytdl, { getInfo } from "@distube/ytdl-core";

export async function POST(req: Request, res: NextApiResponse<any>) {
  const body = await req.json();
  const url = body?.url;
  if (!url) {
    return NextResponse.json(
      { message: "Ingrese una URL de la canción que desea descargar" },
      { status: 404 }
    );
  }

  const query = (url as string)?.split("/watch?");
  const params: any = Object.fromEntries(new URLSearchParams(query[1]));
  const videoId = params?.v;
  if (!videoId) {
    return NextResponse.json(
      {
        message:
          "No se ha podido leer el video. Asegúrese de que la url contiene los caracteres watch?. Por ejemplo: https://www.youtube.com/watch?v=dIbeazAlxM4",
      },
      { status: 404 }
    );
  }

  const info = await getInfo(videoId);
  const video = { videoId, title: info?.videoDetails?.title };

  const filePath = path.resolve(os.homedir(), "/Canciones");
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  const title = video.title
    .replace(/[\|&;\$%@"<>\(\)\+,/]/g, "")
    .normalize("NFC");

  ytdl(url, { quality: "highestaudio" }).pipe(
    fs.createWriteStream(path.resolve(`${filePath}/${title}.mp3`))
  );
  return NextResponse.json(
    { message: `Descarga exitosa de: ${title}` },
    { status: 200 }
  );
}
