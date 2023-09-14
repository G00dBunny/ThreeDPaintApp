import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * BASE
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * OBJECT
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({color: 0xaaaaaa})
)
scene.add(cube)

/**
 * SIZES
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * LIGHTS
 */

const whiteLight = new THREE.DirectionalLight(0xffffff)
whiteLight.position.set(0, 0, 1)
scene.add(whiteLight)
scene.add(new THREE.AmbientLight(0xffffff, 0.1))

/**
 * CAMERA
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(0x222230)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

/**
 * ANIMATE
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

/**
 * RAYCASTING
 */

const raycaster = new THREE.Raycaster()
document.addEventListener('mousedown', (event) => {
    const coords = {  // mouse position in normalized device coordinates
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1, // put x in range [-1, 1]
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1 //same for y
    }
    raycaster.setFromCamera(coords, camera) 
    
    let intersections = raycaster.intersectObjects(scene.children) 

    if (intersections.length > 0) {
        const selectedObject = intersections[0].object 
        console.log(intersections[0])
        selectedObject.material.color.set(0xff0000)
    }
})
tick()