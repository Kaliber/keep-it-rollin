import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function rotateObject (object, degreeX = 0, degreeY = 0, degreeZ = 0) {
  object.rotation.x = (THREE.Math.degToRad(degreeX))
  object.rotation.y = (THREE.Math.degToRad(degreeY))
  object.rotation.z = (THREE.Math.degToRad(degreeZ))
}

export function loadGlb (fileName) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()

    loader.load(`/three-assets/${fileName}.glb`, function (object) {
      resolve(object)
    })
  })
}

export const visibleHeightAtZDepth = (depth, camera) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z
  if (depth < cameraOffset) {
    depth -= cameraOffset
  } else {
    depth += cameraOffset
  }

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth)
}

export const visibleWidthAtZDepth = (depth, camera) => {
  const height = visibleHeightAtZDepth(depth, camera)
  return height * camera.aspect
}
