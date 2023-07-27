# Babylon.js Interactive Scene

Welcome to the Babylon.js Interactive Scene! This project demonstrates an interactive 3D scene using the powerful Babylon.js framework combined with React and Next.js.

The live version of the Project is deployed on vercel and can be found [here](https://uttejk-2d-extrusion.vercel.app/).

## Features

- Draw Polygons: Use the "Draw" button to draw polygons on the ground. Left-click to place points, and right-click to complete the polygon.
- Move Vertices: Enable vertex manipulation by clicking the "Move Vertices" button. Once active, left-click and drag on a vertex to move it.
- Move Mesh: To move the entire mesh, click the "Move" button and drag the mesh in the 3D space.
- Extrude Mesh: Extrude the drawn polygon into a 3D shape by clicking the "Extrude" button. Left-click to perform the extrusion.

## How to Use

1. Clone the repository to your local machine using

   `git clone https://github.com/UttejK/2D-ExtrudeMesh.git`

   this part is already done if you have a .zip file and you should proceed from here...

2. Install the required dependencies using npm or yarn:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the Babylon.js scene.

## Interacting with the Scene

- Left-click on the ground to place points and draw a polygon. Right-click to complete the polygon.
- To extrude the polygon into a 3D shape, click the "Extrude" button, and left-click on the mesh to perform the extrusion.
- Activate the "Move" button to move the entire mesh by left-clicking and dragging it in the 3D space. NOTE: The mesh can be moved only after the extrusion is complete.
- Activate vertex manipulation by clicking the "Move Vertices" button. Left-click and drag on a vertex to move it.

## Technologies Used

- [Babylon.js](https://www.babylonjs.com/): A powerful 3D game engine and framework for web development.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [Next.js](https://nextjs.org/): A framework for server-rendered React applications.
