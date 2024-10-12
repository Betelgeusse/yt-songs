// import Image from "next/image";
"use client"
import { useState } from "react";

export default function Home() {

  const [inputValue, setInputValue] = useState("");
  const [isDownloading, setDownloadingValue] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("En espera");

  const clearInput = () => {
    setInputValue("");
  }

  const downloadSong = async() => {
    if(inputValue.length === 0){
      setDownloadStatus("Ingrese la URL de la canción que desea descargar.")
      return;
    }
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
    console.log(data);
    setDownloadStatus(data?.message || 'Estatus desconocido')
    setDownloadingValue(false)
  }

  return (
    <div className="p-8 flex h-full justify-center items-center gap-4">
      <div className="border"></div>
      <div className="grid grid-cols-12 justify-center">
        <h1 className="text-3xl col-span-12 py-8">Descargar Canción</h1>
        <h1 className="col-span-12">Pasos:</h1>
        <h1 className="col-span-12">1. Copiar el enlace del video (Ctrl + C)</h1>
        <h1 className="col-span-2">2. Pegarlo aquí (Ctrl+V):</h1>
        <input 
          type="text" 
          className="col-span-9 border rounded-lg border-black"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}></input>
        <button 
          className="col-span-1 my-4 border-4 rounded hover:bg-slate-50"
          onClick={clearInput}>
            Limpiar
        </button>
        <button onClick={downloadSong} className="col-span-12 my-4 border-4 rounded hover:bg-slate-50">3. Dar click aquí para descargar</button>
        <h1 className="col-span-12">4. La canción se descargará en la carpeta de C:/Canciones</h1>
        <div className="col-span-12 py-8">
          <h1>Status: {downloadStatus}</h1>
          {isDownloading ? (
            <h1>Descargando canción...</h1>
          ) : (
            <h1>No se está descargando nada por el momento.</h1>
          )}
        </div>
      </div>
      <div className="border"></div>
    </div>

  );
}
