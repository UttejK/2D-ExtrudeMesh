const {
  Vector3,
  MeshBuilder,
  TransformNode,
  GizmoManager,
  VertexBuffer,
} = require("@babylonjs/core");

function verticesManipulator(scene) {
  const meshes = new Map();
  const radius = 5;
  const pickOrigin = new Vector3();
  const tmpVec = new Vector3();
  const spheres = [];
  const sphere = MeshBuilder.CreateSphere("sp", { diameter: 0.2 }, scene);
  const tranny = new TransformNode("tranny", scene);
  let selectedVertices = [];
  let selectedMesh = null;
  const gizmoManager = new GizmoManager(scene);

  gizmoManager.positionGizmoEnabled = true;
  gizmoManager.rotationGizmoEnabled = false;
  gizmoManager.scaleGizmoEnabled = false;
  gizmoManager.boundingBoxGizmoEnabled = false;

  gizmoManager.attachableMeshes = [tranny];

  function addMesh(mesh) {
    mesh.isPickable = true;
    const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
    const vertices = [];
    for (let i = 0; i < positions.length; i += 3) {
      vertices.push(
        new Vector3(positions[i], positions[i + 1], positions[i + 2])
      );
    }
    meshes.set(mesh, { mesh: mesh, vertices: vertices });
  }

  function updateVertices(mesh) {
    //mesh.bakeCurrentTransformIntoVertices();
    const mesh2 = meshes.get(mesh);
    if (!mesh2) {
      return;
    }
    const positions = [];
    for (let i = 0; i < mesh2.vertices.length; i++) {
      const vert = mesh2.vertices[i];
      positions.push(vert.x, vert.y, vert.z);
    }
    mesh.updateVerticesData(VertexBuffer.PositionKind, positions);
    mesh.bakeCurrentTransformIntoVertices();
  }

  function selectVertices(hit) {
    for (let i = 0; i < spheres.length; i++) {
      spheres[i].dispose();
    }
    spheres.length = 0;
    selectedVertices.length = 0;
    selectedMesh = null;
    selectedHit = null;

    if (!meshes.has(hit.pickedMesh)) {
      addMesh(hit.pickedMesh);
    }

    selectedMesh = hit.pickedMesh;
    selectedHit = hit;

    const mesh = meshes.get(hit.pickedMesh);
    for (let i = 0; i < mesh.vertices.length; i++) {
      Vector3.TransformCoordinatesToRef(
        mesh.vertices[i],
        mesh.mesh.getWorldMatrix(),
        tmpVec
      );
      const distance = Vector3.Distance(tmpVec, hit.pickedPoint);
      if (distance < radius) {
        const instance = sphere.createInstance("spi" + i);
        instance.position.copyFrom(tmpVec);
        spheres.push(instance);
        selectedVertices.push(mesh.vertices[i]);
        console.log("Puuf");
      }
    }
    tranny.position.copyFrom(hit.pickedPoint);
    gizmoManager.attachToMesh(tranny);
    pickOrigin.copyFrom(hit.pickedPoint);
  }

  return {
    addMesh,
    updateVertices,
    selectVertices,
  };
}

export default verticesManipulator;
