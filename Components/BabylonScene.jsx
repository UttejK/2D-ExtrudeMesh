"use client";
import { useEffect, useRef } from "react";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PolygonMeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
  VertexData,
} from "@babylonjs/core";

const BabylonScene = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    // Create the Babylon.js scene
    const engine = new Engine(sceneRef.current, true);
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera(
      "camera",
      0,
      0,
      10,
      Vector3.Zero(),
      scene
    );
    camera.position = new Vector3(0, 10, -10);
    camera.attachControl(sceneRef.current, true);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene
    );
    const groundmat = new StandardMaterial("groundMat", scene);
    groundmat.diffuseColor = new Color3(0.1, 0.1, 0.1);
    ground.material = groundmat;

    const customMesh = new Mesh("Custom", scene);
    const vertexData = new VertexData();
    const mat = new StandardMaterial("mat", scene);
    mat.emissiveColor = Color3.Green();
    mat.backFaceCulling = false;
    mat.twoSidedLighting = true;
    customMesh.material = mat;

    const bufferMeshes = [];
    const positions = [];
    const indices = [];
    let i = 0;

    scene.onPointerDown = (evt) => {
      // pick mesh at the pointer position
      const hit = scene.pick(scene.pointerX, scene.pointerY);
      // the evt.button will be zero for left mouse button, and 2 for right mouse button
      // console.log(evt.button);

      if (hit.faceId != -1) {
        const initialPos = hit.pickedPoint;

        if (evt.button == 0) {
          const Mesh = MeshBuilder.CreateSphere(
            "PlaceHolder",
            { diameter: 0.15 },
            scene
          );
          try {
            Mesh.position = hit.pickedPoint;
            bufferMeshes.push(Mesh);
            positions.push(Mesh.position._x);
            positions.push(Mesh.position._y);
            positions.push(Mesh.position._z);
            indices.push(i);
            indices.push(i + 1);
            indices.push(i + 2);
            // indices.push(i);
            // indices.push(i + 2);
            // indices.push(i + 3);
            // indices[positions.length] = 0;
            i += 1;
          } catch (error) {
            console.error(error);
          }
        }
        // positions[positions.length] = initialPos._x;
        // positions[positions.length + 1] = initialPos._y;
        // positions[positions.length + 1] = initialPos._z;

        if (evt.button == 2) {
          console.log(positions, indices);
          vertexData.positions = positions;
          vertexData.indices = indices;
          vertexData.applyToMesh(customMesh);
          for (let i = 0; i < bufferMeshes.length; i++) {
            bufferMeshes[i].dispose();
            // bufferMeshes.length = 0;
          }
        }
      }
    };

    // Rendering loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener("resize", handleResize);

    // Clean up the scene when the component unmounts
    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={sceneRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
};

export default BabylonScene;
