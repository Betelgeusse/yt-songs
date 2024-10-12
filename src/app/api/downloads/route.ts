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

  const query = url?.split("/watch?");
  const params: any = Object.fromEntries(new URLSearchParams(query[1]));
  const videoId = params?.v;

  if (!videoId) {
    const message =
      "No se ha podido leer el video. Asegúrese de ingresar una URL correcta";
    return NextResponse.json({ message }, { status: 404 });
  }

  const result = await streamToBuffer(ytdl(url, { quality: "highestaudio" }));

  const info = await getInfo(videoId);

  return NextResponse.json(
    {
      message: `Descarga exitosa de: ${info?.videoDetails.title}`,
      info,
      file: result,
    },
    { status: 200 }
  );
}
async function streamToBuffer(stream: any) {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);

    stream.on("data", (chunk: any) => {
      buffer = Buffer.concat([buffer, chunk]);
    });

    stream.on("end", () => {
      resolve(buffer);
    });

    stream.on("error", (err: any) => {
      reject(err);
    });
  });
}

// To do it locally:
// const filePath = path.resolve(os.homedir(), "/Canciones");
// if (!fs.existsSync(filePath)) {
//   fs.mkdirSync(filePath, { recursive: true });
// }

// ytdl(url, { quality: "highestaudio" }).pipe(
//   fs.createWriteStream(path.resolve(`${filePath}/${title}.mp3`))
// );
