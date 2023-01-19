import { CSS3DObject } from '../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
// import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { loadGLTF, loadTextures } from './libs/loader.js'
const THREE = window.MINDAR.IMAGE.THREE

async function start() {

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: '../../assets/targets/zorojuro_hoodie_crop.mind',
    // filterMinCF: 0.0000001,
    // filterBeta: 0.00001
  })
  console.log("🚀 ~ file: main.js:11 ~ start ~ mindarThree", mindarThree)

  const { renderer, scene, cssRenderer, cssScene, camera } = mindarThree

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);


  const gltf = await loadGLTF('../../assets/models/zoro/zoro.glb');

  gltf.scene.scale.set(0.01, 0.01, 0.01);

  const [hoodie_texture, logo_texture] = await loadTextures(['../../assets/models/hoodie/textures/dee7b4e3-1469-44ff-a7c4-055a73f47683.png', '../../assets/images/23point5_logo.png'])
  // hoodie_texture.magFilter = THREE.LinearFilter
  // hoodie_texture.minFilter = THREE.LinearMipMapNearestFilter
  // hoodie_texture.wrapS = THREE.RepeatWrapping
  // hoodie_texture.wrapT = THREE.RepeatWrapping
  // hoodie_texture.flipY = false
  // hoodie_texture.encoding = THREE.sRGBEncoding
  // const material = new THREE.MeshStandardMaterial({ map: hoodie_texture })
  gltf.scene.position.set(0.7, -0.8, 0)
  // gltf.scene.children.map((item) => {
  //   item.material = material
  //   item.material.needsUpdate = true
  // })


  // create the logo
  const planeGeometry = new THREE.PlaneGeometry(1, 0.5);
  const logoMaterial = new THREE.MeshBasicMaterial({ map: logo_texture, transparent: true });
  const logo = new THREE.Mesh(planeGeometry, logoMaterial)
  logo.position.set(0.7, 0.7, 0)

  // create welcome
  const textElement = document.createElement("div");
  const textObj = new CSS3DObject(textElement);
  textObj.position.set(700, 1000, 0);
  textObj.visible = true
  textElement.innerHTML = 'WELCOME'
  textElement.style.background = "transparent";
  textElement.style.padding = "30px";
  textElement.style.fontSize = "100px";
  textElement.style.fontFamily = "arial";



  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(gltf.scene);
  anchor.group.add(logo)

  const cssAnchor = mindarThree.addCSSAnchor(0);
  cssAnchor.group.add(textObj);


  // handle buttons
  logo.userData.clickable = true

  document.body.addEventListener("click", (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    const mouse = new THREE.Vector2(mouseX, mouseY);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length) {
      let o = intersects[0].object
      while (o.parent && !o.userData.clickable) {
        o = o.parent
      }
      if (o.userData.clickable) {
        if (o === logo) {
          const params = new URLSearchParams(window.location.search)
          const id = params.get('id')
          window.open(`https://www.23point5.com/product-preview/${id}`)
        }
      }
    }
  })



  function rotateModel() {
    const SPEED = 0.01
    // cube.rotation.x -= SPEED * 2;
    gltf.scene.rotation.y -= SPEED;
    // cube.rotation.z -= SPEED * 3;
  }

  // animations
  console.log("🚀 ~ file: main.js:103 ~ start ~ gltf", gltf)
  const mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(gltf.animations[4])
  action.play()

  const clock = new THREE.Clock()
  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    // rotateModel()
    const delta = clock.getDelta()
    mixer.update(delta)
    renderer.render(scene, camera);
    cssRenderer.render(cssScene, camera)
  });
}

try {
  start()
} catch (err) {
  console.log("🚀 ~ file: main.js:82 ~ err", err)
}