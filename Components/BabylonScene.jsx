"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  PolygonMeshBuilder,
  Scene,
  StandardMaterial,
  Vector2,
  Vector3,
} from "@babylonjs/core";
import * as earcut from "earcut";
import { AdvancedDynamicTexture, Control, Button } from "@babylonjs/gui";
import CreateButton from "./CreateButton";

const BabylonScene = () => {
  const sceneRef = useRef(null);
  let drawActive = false;
  useEffect(() => {
    // Create the Babylon.js scene
    const engine = new Engine(sceneRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = Color3.Black();
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
    light.intensity = 0.9;
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      scene
    );
    const groundmat = new StandardMaterial("groundMat", scene);
    groundmat.diffuseColor = new Color3(0.1, 0.1, 0.1);
    // groundmat.alpha = 0.4;
    ground.material = groundmat;

    const mat = new StandardMaterial("mat", scene);
    mat.emissiveColor = Color3.Green();
    mat.backFaceCulling = false;
    mat.twoSidedLighting = true;

    let bufferMeshes = [];
    const positions = [];

    scene.onPointerDown = (evt) => {
      // pick mesh at the pointer position
      const hit = scene.pick(scene.pointerX, scene.pointerY);
      // the evt.button will be zero for left mouse button, and 2 for right mouse button
      // console.log(evt.button);

      if (hit.faceId != -1 && drawActive) {
        if (evt.button == 0) {
          const Mesh = MeshBuilder.CreateSphere(
            "PlaceHolder",
            { diameter: 0.15 },
            scene
          );
          try {
            Mesh.position = hit.pickedPoint;
            bufferMeshes.push(Mesh);
            positions.push(new Vector2(Mesh.position._x, Mesh.position._z));
          } catch (error) {
            console.error(error);
          }
        }
        if (evt.button == 2) {
          const poly_tri = new PolygonMeshBuilder(
            "polygon",
            positions,
            scene,
            earcut
          );
          const polygon = poly_tri.build();
          polygon.material = mat;
          const len = bufferMeshes.length;
          for (let i = 0; i < len; i++) {
            bufferMeshes[i].dispose();
          }
        }
      }
    };

    // Creating the GUI
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("myUI");

    const draw = CreateButton("Draw", [0, 0], advancedTexture);
    draw.onPointerDownObservable.add(() => {
      if (drawActive) drawActive = false;
      else drawActive = true;
    });

    const extrude = CreateButton("Extrude", [1, 0], advancedTexture);
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
    <>
      <canvas
        ref={sceneRef}
        style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      />
    </>
  );
};

export default BabylonScene;
