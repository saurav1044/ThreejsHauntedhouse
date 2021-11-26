import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh, MeshStandardMaterial, PCFShadowMap, PCFSoftShadowMap } from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// fog
const fog=new THREE.Fog('#262837',1,15)
scene.fog=fog
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorAlphaTexture=textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture=textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorColorTexture=textureLoader.load('/textures/door/color.jpg')
const doorHeightTexture=textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture=textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture=textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture=textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// const grassColorTexture = textureLoader.load('/textures/ground/color.jpg')
// const grassAmbientOcclusionTexture = textureLoader.load('/textures/ground/black.jpg')
// const grassNormalTexture = textureLoader.load('/textures/ground/normal.jpg')
// const grassRoughnessTexture = textureLoader.load('/textures/ground/white.jpg')
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping


const roofTexture=textureLoader.load('/textures/roof/roof.jpg')
/**
 * House
 */

const house=new THREE.Group()
scene.add(house)

const wall=new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new MeshStandardMaterial({
        map:bricksColorTexture,
        aoMap:bricksAmbientOcclusionTexture,
        aoMapIntensity:2,
        normalMap:bricksNormalTexture,
        roughnessMap:bricksRoughnessTexture
    })
)
wall.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array,2)
)
wall.position.set(0,1.25,0)
house.add(wall)

const roof=new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new MeshStandardMaterial({map:roofTexture})
)
roof.position.set(0,3,0)
roof.rotation.y=-(Math.PI*0.25)
house.add(roof)

const door=new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2.1,100,100),
    new MeshStandardMaterial({
        map:doorColorTexture,
        alphaMap:doorAlphaTexture,
        transparent:true,
        aoMap:doorAmbientOcclusionTexture,
        aoMapIntensity:2.5,
        displacementMap:doorHeightTexture,
        displacementScale:0.1,
        normalMap:doorNormalTexture,
        metalnessMap:doorMetalnessTexture,
        roughnessMap:doorRoughnessTexture
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
)
door.position.set(0,0.96,2.01)
house.add(door)

// bushes
const bushGeometry=new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial=new THREE.MeshStandardMaterial({color:'green'})

const bush1=new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(1.1,0.2,2.2)
const bush2=new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.7,0.075,2.2)
const bush3=new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-1.1,0.2,2.2)
const bush4=new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush4.scale.set(0.22,0.22,0.22)
bush4.position.set(-1.5,0.11,2.6)
house.add(bush1,bush2,bush3,bush4)

// graves
const graves=new THREE.Group()
house.add(graves)

const graveGeometry=new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const graveMaterial=new THREE.MeshStandardMaterial({color:'grey'})

for(let i=0;i<50;i++)
{
    const angle=Math.random()*Math.PI*2
    const radius=5+Math.random()*6
    const x=Math.sin(angle)*radius
    const z=Math.cos(angle)*radius

    const grave=new THREE.Mesh(graveGeometry,graveMaterial)
    graves.add(grave)
    grave.position.set(x,0.3,z)
    grave.rotation.y=(Math.random()-0.5)*(Math.random()+0.1)
    grave.rotation.z=(Math.random()-0.5)*0.6
    grave.castShadow=true
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(25, 20),
    new THREE.MeshStandardMaterial({ 
        map:grassColorTexture,
        aoMap:grassAmbientOcclusionTexture,
        normalMap:grassNormalTexture,
        roughnessMap:grassRoughnessTexture
     })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight=new THREE.AmbientLight(0xb9d5ff,0.12)
scene.add(ambientLight)

gui.add(ambientLight,'intensity').min(0).max(1).step(0.001)

// Directional light
const moonLight=new THREE.DirectionalLight(0xb9d5ff,0.12)
moonLight.position.set(4,5,-2)
house.add(moonLight)
gui.add(moonLight,'intensity').min(-5).max(5).step(0.001)

// doorLight
const doorLight=new THREE.PointLight(0xff7d46,1,7)
doorLight.position.set(0,2.2,2.7)

house.add(doorLight)

// ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 3, 3)

scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff', 3, 3)

scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ff7800', 3, 3)

scene.add(ghost3)
/**
 * Sizes
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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 2
camera.position.z = 40
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled=true
renderer.shadowMap.type=THREE.PCFSoftShadowMap
renderer.setClearColor('#262837')

// shadows
ghost1.castShadow=true
ghost2.castShadow=true
ghost3.castShadow=true
moonLight.castShadow=true
doorLight.castShadow=true

wall.castShadow=true;
bush1.castShadow=true
bush2.castShadow=true
bush3.castShadow=true

floor.receiveShadow=true


ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 7

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7
/**
 * Animate
 */
const clock = new THREE.Clock()
let clock2 = new THREE.Clock();
let maximumValue=7.45
let limit=true
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    if(camera.position.z.toFixed(2)>maximumValue)
    {
    camera.position.z-=(elapsedTime)*0.08
    }
    else
    {
        camera.position.x=Math.sin(elapsedTime)*6
        camera.position.z=(Math.cos(elapsedTime)) * (6.5 + Math.sin(elapsedTime) * 3)
        camera.position.y=0.25+Math.abs(Math.sin(elapsedTime))*2
    }
    camera.lookAt(house.position)
    camera.rotation.z+=(Math.sin(elapsedTime)*5)

    const ghostAngle=elapsedTime*0.5
    ghost1.position.x=Math.sin(ghostAngle)*4
    ghost1.position.z=Math.cos(ghostAngle)*4
    ghost1.position.y=Math.sin(elapsedTime*3)
    
    const ghostAngle2=-elapsedTime*0.32
    ghost2.position.x=Math.sin(ghostAngle2)*5.5
    ghost2.position.z=Math.cos(ghostAngle2)*5.5
    ghost2.position.y=Math.sin(elapsedTime*4)+Math.sin(elapsedTime*2.4)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()