"use client";

import * as fabric from "fabric";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: 500,
        height: 500,
        backgroundColor: "#ffffff",
      });
      console.log("Fabric canvas initialized:", fabricRef.current);
    }

    return () => {
      fabricRef.current?.dispose();
      console.log("Fabric canvas disposed");
    };
  }, []);

  const addCircle = () => {
    if (!fabricRef.current) return;

    const circle = new fabric.Circle({
      top: 50,
      left: 100,
      radius: 50,
      fill: "blue",
    });

    fabricRef.current.add(circle);
    fabricRef.current.renderAll();

    console.log(fabricRef.current.getObjects());
  };

  const addRectangle = () => {
    if (!fabricRef.current) return;

    const rectangle = new fabric.Rect({
      top: 50,
      left: 100,
      width: 100,
      height: 100,
      fill: "red",
    });

    fabricRef.current.add(rectangle);
    fabricRef.current.renderAll();

    console.log(fabricRef.current.getObjects());
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const imageElement = document.createElement("img");
      imageElement.src = url;
      imageElement.crossOrigin = "anonymous";

      imageElement.onload = () => {
        // Create a fabric.Image object from the loaded image element
        const fabricImg = new fabric.FabricImage(imageElement, {
          top: 50,
          left: 100,
          scaleX: 0.293,
          scaleY: 0.293,
        });

        fabricRef?.current?.add(fabricImg);
      };
    }
  };

  const handleDelete = () => {
    if (fabricRef.current) {
      const activeObject = fabricRef.current.getActiveObject();
      if (activeObject) {
        fabricRef.current.remove(activeObject);
      }
    }
  };

  const exportImage = () => {
    if (fabricRef.current) {
      const dataURL = fabricRef.current.toDataURL({
        format: "png", // or 'jpeg'
        quality: 0.9, // for jpeg
        multiplier: 1, // for higher resolution export
      });

      // Create a temporary link to download the image
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "fabricjs-export.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <canvas style={{ border: "2px solid red" }} ref={canvasRef} />
      <button onClick={addCircle}>Add Circle</button>
      <button onClick={addRectangle}>Add Rectangle</button>
      <button onClick={handleDelete}>Delete</button>
      <input type="file" accept="image/*" onChange={addImage} />
      <button onClick={exportImage}>Export</button>
    </>
  );
}
