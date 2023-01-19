import { CSS3DObject } from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import { loadGLTF, loadTextures, loadVideo } from './libs/loader.js'
import * as utils from './utils.js'
const THREE = window.MINDAR.IMAGE.THREE

async function start() {

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: './assets/targets/zorojuro_hoodie_crop.mind',
    // filterMinCF: 0.0000001,
    // filterBeta: 0.00001
  })
  console.log("🚀 ~ file: main.js:11 ~ start ~ mindarThree", mindarThree)

  const { renderer, scene, cssRenderer, cssScene, camera } = mindarThree

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);


  const gltf = await loadGLTF('./assets/models/zoro/zoro.glb');

  gltf.scene.scale.set(0.01, 0.01, 0.01);

  const [logo_texture] = await loadTextures(['./assets/images/23point5_logo.png'])
  gltf.scene.position.set(0.7, -0.8, 0)

  // create videos
  const zoroVideo = await loadVideo("./assets/videos/zoro_video.mp4");
  zoroVideo.muted = true;
  zoroVideo.loop = true
  zoroVideo.play()
  console.log("🚀 ~ file: main.js:33 ~ start ~ zoroVideo", zoroVideo)
  const zoroVideoTexture = new THREE.VideoTexture(zoroVideo);
  const zoroVideoGeometry = new THREE.PlaneGeometry(2, 1)
  const zoroVideoMaterial = new THREE.MeshBasicMaterial({ map: zoroVideoTexture });

  const zoroVideoMesh = new THREE.Mesh(zoroVideoGeometry, zoroVideoMaterial);
  zoroVideoMesh.position.set(1, 1, -0.5)

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


  // create run button
  const runButtonElement = utils.createActionButtonElement('Run')
  const runButtonObj = new CSS3DObject(runButtonElement)
  runButtonObj.position.set(1500, 0, 0)

  // create ninja run button
  const ninjaRunButtonElement = utils.createActionButtonElement('Ninja Run')
  const ninjaRunButtonObj = new CSS3DObject(ninjaRunButtonElement)
  ninjaRunButtonObj.position.set(1500, 400, 0)

  // create dance button
  const danceButtonElement = utils.createActionButtonElement('Dance')
  const danceButtonObj = new CSS3DObject(danceButtonElement)
  danceButtonObj.position.set(1500, -400, 0)


  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(gltf.scene);
  anchor.group.add(logo)
  anchor.group.add(zoroVideoMesh)

  const cssAnchor = mindarThree.addCSSAnchor(0);
  cssAnchor.group.add(textObj);
  cssAnchor.group.add(runButtonObj)
  cssAnchor.group.add(ninjaRunButtonObj)
  cssAnchor.group.add(danceButtonObj)


  // handle buttons
  logo.userData.clickable = true
  runButtonObj.userData.clickable = true

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
      console.log('o', o)
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

  console.log("🚀 ~ file: main.js:122 ~ start ~ gltf", gltf)
  // animations
  const mixer = new THREE.AnimationMixer(gltf.scene)
  const idleAction = mixer.clipAction(gltf.animations[0])
  const danceAction = mixer.clipAction(gltf.animations[4])
  const runAction = mixer.clipAction(gltf.animations[2])
  const ninjaRunAction = mixer.clipAction(gltf.animations[1])
  idleAction.play()

  let currentAction = idleAction

  runButtonElement.addEventListener('click', (e) => {
    runAction.crossFadeFrom(currentAction, 0.5)
    runAction.reset().play()
    currentAction = runAction
  })

  ninjaRunButtonElement.addEventListener('click', (e) => {
    ninjaRunAction.crossFadeFrom(currentAction, 0.5)
    ninjaRunAction.reset().play()
    currentAction = ninjaRunAction
  })

  danceButtonElement.addEventListener('click', (e) => {
    danceAction.crossFadeFrom(currentAction, 0.5)
    danceAction.reset().play()
    currentAction = danceAction
  })

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