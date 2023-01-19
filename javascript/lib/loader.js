
const dracoLoader = new THREE.DRACOLoader()
dracoLoader.setDecoderPath('/data/draco/gltf/')

export const loadImage = (path) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      resolve(image)
    }
    image.src = path
  })
}

export const loadGLTF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.GLTFLoader();
    loader.setDRACOLoader(dracoLoader)
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
}

export const loadAudio = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.AudioLoader();
    loader.load(path, (buffer) => {
      resolve(buffer);
    });
  });
}

export const loadVideo = (path) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    //video.addEventListener('loadeddata', () => {
    video.addEventListener('loadedmetadata', () => {
      video.setAttribute('playsinline', '');
      resolve(video);
    });
    video.src = path;
  });
}

export const loadTexture = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(path, (texture) => {
      resolve(texture);
    });
  });
}

export const loadTextures = (paths) => {
  const loader = new THREE.TextureLoader();
  const promises = [];
  for (let i = 0; i < paths.length; i++) {
    promises.push(new Promise((resolve, reject) => {
      loader.load(paths[i], (texture) => {
        resolve(texture);
      });
    }));
  }
  return Promise.all(promises);
}
