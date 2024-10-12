"use client"
import { normalizeStr } from "@core/utilities/normalize";
import { useState } from "react";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function Home() {

  const [inputValue, setInputValue] = useState("");
  const [isDownloading, setDownloadingValue] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("En espera");
  const [isError, setError] = useState(false);
  const [userCanDownload, setUserCanDownloadStatus] = useState(true);


  const clearInput = () => {
    setUserCanDownloadStatus(true);
    setInputValue("");
  }

  const downloadSong = async () => {
    if (inputValue.length === 0) {
      setDownloadStatus("Ingrese la URL de la canción que desea descargar.")
      setError(true);
      return;
    }
    setError(false);

    NProgress.start()
    setDownloadingValue(true)
    setDownloadStatus("Descargando canción.")
    const response = await fetch('/api/downloads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: inputValue
      })
    });
    const data = await response.json();
    setDownloadStatus(data?.message || 'Estatus desconocido')
    setDownloadingValue(false)

    if (data?.file?.data) {
      const uint8Array = new Uint8Array(data.file.data);
      const fileBlob = new Blob([uint8Array], { type: data.mime });
      const objectUrl = URL.createObjectURL(fileBlob);
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = objectUrl;
      const title = normalizeStr(data?.info?.videoDetails?.title)
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(objectUrl);
    } else {
      setDownloadStatus(data?.message || "Ha ocurrido un error desconocido.")
      setError(true);
    }
    NProgress.done();
    setUserCanDownloadStatus(false);
    return;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl col-span-12 mb-4">Descargar Canción de Youtube (.mp3)</h1>
      <div className="p-8 border-8 border-gray-200 rounded-2xl h-full justify-center items-center gap-4 shadow-blue-100 shadow-lg">
        <div className="grid grid-cols-12 justify-center">
          <h1 className="col-span-12">Pasos:</h1>
          <h1 className="col-span-12">1. Copiar el enlace del video (Ctrl + C)</h1>
          <h1 className="col-span-2 flex flex-row self-center">2. Pegarlo aquí (Ctrl+V):</h1>
          <input
            type="text"
            className="col-span-9 border rounded-lg border-black px-4"
            value={inputValue}
            disabled={!userCanDownload}
            placeholder="https://www.youtube.com/watch?v=dIbeazAlxM4 <--- Pega tu URL en este campo"
            onChange={(e) => setInputValue(e.target.value)}></input>
          <button
            className="col-span-1 my-4 border-4 rounded hover:bg-slate-50"
            onClick={clearInput}>
            <p className="text-sm">Limpiar</p>
          </button>
          {
            userCanDownload ?
              <button onClick={downloadSong} className="col-span-12 my-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-4 border-2 border-blue-500 hover:border-transparent rounded">
                3. Click aquí para descargar
              </button>
              :
              <div className="col-span-12 grid grid-cols-12 gap-2">
                <button onClick={downloadSong} className="col-span-6 my-4 w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-4 border-2 border-blue-500 hover:border-transparent rounded">
                  Descargar de nuevo
                </button>
                <button onClick={clearInput} className="col-span-6 my-4 w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-4 border-2 border-blue-500 hover:border-transparent rounded">
                  Descargar otra canción
                </button>
              </div>
          }

          <div className="col-span-12">
            <h1>
              Status:
              {isError ? <p className="text-red-500">{downloadStatus}</p> : <p>{downloadStatus}</p>}
            </h1>
            {isDownloading ? (
              <h1>En unos momentos se descargará la canción.</h1>
            ) : (
              <h1>No se está descargando nada por el momento.</h1>
            )}

          </div>
        </div>
      </div>
      <p className="text-md col-span-12 mb-4">Contacto: betelgeussesoftware@gmail.com</p>

    </div>


  );
}
