const manifestUri = "https://cdn.mish-stg-1.dev/video/gKPbFdVZGajsBaGyKXHN-uez2h/0FVaJajev6YdyD43CK2eQLXO/8v5X4HFv2kGu8yPQflB2Zuq6/video.m3u8";

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById('video');
  const player = new shaka.Player(video);
  player.configure({streaming: {useNativeHlsOnSafari: false}});
  player.getNetworkingEngine().registerRequestFilter(function(type, request) {
    console.info(type, request);
    request.headers["hdnts"] = "exp=1635747026~acl=/video/gKPbFdVZGajsBaGyKXHN-uez2h/0FVaJajev6YdyD43CK2eQLXO/8v5X4HFv2kGu8yPQflB2Zuq6/*~hmac=6d4f9ffad7fe7188bd6a7a1e8df02fbd96652b556112a8231a4be53cebdd7b59";
  });

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);
