// import Image from "next/image";

export default function Home() {
  return (
    <div className="p-8 flex h-full justify-center items-center gap-4">
      <div className="border"></div>
      <div className="grid grid-cols-12 justify-center">
        <h1 className="text-3xl col-span-12 py-8">Descargar Canción</h1>
        <h1 className="col-span-12">Pasos:</h1>
        <h1 className="col-span-12">1. Copiar el enlace del video (Ctrl + C)</h1>
        <h1 className="col-span-2">2. Pegarlo aquí (Ctrl+V):</h1>
        <input type="text" className="col-span-9 border rounded-lg border-black"></input>
        <button className="col-span-1 my-4 border-4 rounded hover:bg-slate-50">Limpiar</button>
        <button className="col-span-12 my-4 border-4 rounded hover:bg-slate-50">3. Dar click aquí para descargar</button>
        <h1 className="col-span-12">4. La canción se descargará en la carpeta de C:/Canciones</h1>
      </div>
      <div className="border"></div>
    </div>

  );
}
