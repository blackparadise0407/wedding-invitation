import {
  tsParticles,
  type Container,
  type ISourceOptions,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

let container: Container | undefined;
let initialization: Promise<void> | undefined;

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

const options: ISourceOptions = {
  autoPlay: false,
  fullScreen: {
    enable: false,
  },
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 45,
  detectRetina: true,
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,

  particles: {
    number: {
      value: 35,
    },
    color: {
      value: ["#bfa36b", "#d8c494", "#a88b54"],
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: { min: 0.15, max: 0.5 },
    },
    size: {
      value: { min: 1, max: 3 },
    },
    links: {
      enable: false,
    },
    move: {
      enable: true,
      direction: "top",
      speed: 0.45,
      random: true,
      straight: false,
      outModes: {
        default: "out",
      },
    },
  },

  interactivity: {
    events: {
      onHover: {
        enable: false,
      },
      onClick: {
        enable: false,
      },
    },
  },
};

export function prepareParticles(): Promise<void> {
  if (motionPreference.matches) {
    return Promise.resolve();
  }

  initialization ??= (async () => {
    await loadSlim(tsParticles);

    container = await tsParticles.load({
      id: "invitation-particles",
      options,
    });
  })().catch((error: unknown) => {
    initialization = undefined;
    throw error;
  });

  return initialization;
}

export async function startParticles(): Promise<void> {
  if (motionPreference.matches) return;

  await prepareParticles();

  // The preference may have changed during initialization.
  if (motionPreference.matches) return;

  document.getElementById("invitation-particles")?.classList.add("is-active");

  container?.play();
}

export function stopParticles(): void {
  container?.pause();

  document
    .getElementById("invitation-particles")
    ?.classList.remove("is-active");
}

function handleMotionChange(): void {
  if (motionPreference.matches) {
    stopParticles();
  }
}

motionPreference.addEventListener("change", handleMotionChange);

// Clean up when Vite replaces this module during development.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    motionPreference.removeEventListener("change", handleMotionChange);
    container?.destroy();
  });
}
