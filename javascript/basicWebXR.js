
import { loadGLTF } from './lib/loader.js'

document.addEventListener('DOMContentLoaded', () => {
  const initialize = async () => {
    const arButton = document.querySelector("#ar-button");

    // check and request webxr session
    const supported = navigator.xr && await navigator.xr.isSessionSupported('immersive-ar');
    if (!supported) {
      arButton.textContent = "Not Supported";
      arButton.disabled = true;
      return;
    }

    const img = document.getElementById('bitmap')
    const imgBitmap = await createImageBitmap(img)
    const gltfObject = await loadGLTF('../data/models/zoro/zoro.glb')
    console.log("🚀 ~ file: basicWebXR.js:19 ~ initialize ~ gltfObject", gltfObject)
    const mixer = new THREE.AnimationMixer(gltfObject.scene)
    const action = mixer.clipAction(gltfObject.animations[0])
    action.play()
    const group = new THREE.Group()
    group.add(gltfObject.scene)

    // build three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // create AR object
    const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -0.3);
    scene.add(mesh);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);
    scene.add(group)


    renderer.xr.addEventListener("sessionstart", (e) => {
      console.log("session start");
    });
    renderer.xr.addEventListener("sessionend", () => {
      console.log("session end");
    });

    let currentSession = null;
    const start = async () => {
      currentSession = await navigator.xr.requestSession('immersive-ar', {
        optionalFeatures: ['dom-overlay'], requiredFeatures: ['dom-overlay'],
        trackedImages: [
          {
            image: imgBitmap,
            widthInMeters: 0.05
          }
        ],
        domOverlay: { root: document.body }
      });

      renderer.xr.enabled = true;
      renderer.xr.setReferenceSpaceType('local');
      await renderer.xr.setSession(currentSession);
      arButton.textContent = "End";

      const refSpace = await currentSession.requestReferenceSpace('local')

      function onXRFrame(t, frame) {

      }

      function render() {

      }

      const clock = new THREE.Clock()
      renderer.setAnimationLoop(() => {
        const delta = clock.getDelta()
        if (mixer) {
          mixer.update(delta)
        }
        renderer.render(scene, camera);
      });
      function render() {

      }
    }
    const end = async () => {
      currentSession.end();
      renderer.setAnimationLoop(null);
      renderer.clear();
      arButton.style.display = "none";
    }
    arButton.addEventListener('click', () => {
      if (currentSession) {
        end();
      } else {
        start();
      }
    });

  }

  initialize();
});
