import "./style.css";

import { invitationData } from "./invitation-data";
import { renderInvitation } from "./invitation-template";
import { prepareParticles, startParticles } from "./particles";

type FlapSide = "top" | "bottom" | "left" | "right";

function flap(side: FlapSide): string {
  return `
    <div class="flap flap--${side}">
      <img
        src="/images/flap-${side}.png"
        alt=""
        draggable="false"
      />
    </div>
  `;
}

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element.");
}

const assetUrls = [
  "/images/flap-top.png",
  "/images/flap-bottom.png",
  "/images/flap-left.png",
  "/images/flap-right.png",
  "/images/wax-seal.png",
];

async function preloadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;

  await image.decode();

  return image;
}

app.innerHTML = `
<div class="loader" role="status" aria-live="polite">
  <div class="loader-spinner" aria-hidden="true"></div>
  <p class="loader-message">Preparing your invitation…</p>
  <button class="loader-retry" type="button" hidden>
    Try again
  </button>
</div>

<main class="experience is-loading" inert aria-hidden="true">
    <div class="viewport">
      <div class="envelope">
        ${renderInvitation(invitationData)}

        <div class="flap-cover" aria-hidden="true">
            ${flap("top")}
            ${flap("bottom")}
            ${flap("left")}
            ${flap("right")}
        </div>

        <button
          class="seal"
          type="button"
          aria-label="Open invitation"
          aria-controls="invitation"
          aria-expanded="false"
        >
          <img
            src="/images/wax-seal.png"
            alt=""
            draggable="false"
          />
        </button>

        <div id="invitation-particles" aria-hidden="true"></div>

      </div>
    </div>
  </main>
`;

const envelope = app.querySelector<HTMLDivElement>(".envelope")!;
const seal = app.querySelector<HTMLButtonElement>(".seal")!;
const invitation = app.querySelector<HTMLElement>(".invitation")!;
const heading = app.querySelector<HTMLHeadingElement>("h1")!;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function openInvitation(): void {
  envelope.classList.add("is-open");
  void startParticles().catch((error: unknown) => {
    console.warn("Unable to start particles:", error);
  });
  seal.setAttribute("aria-expanded", "true");
  seal.disabled = true;

  const revealInvitation = (): void => {
    invitation.inert = false;
    invitation.removeAttribute("aria-hidden");
    heading.focus({ preventScroll: true });
    seal.hidden = true;
  };

  if (reducedMotion.matches) {
    revealInvitation();
  } else {
    // Allow the flaps and text reveal to finish.
    window.setTimeout(revealInvitation, 2700);
  }
}

seal.addEventListener("click", openInvitation, { once: true });
const loader = app.querySelector<HTMLDivElement>(".loader")!;
const loaderMessage =
  app.querySelector<HTMLParagraphElement>(".loader-message")!;
const retryButton = app.querySelector<HTMLButtonElement>(".loader-retry")!;
const experience = app.querySelector<HTMLElement>(".experience")!;

// Keep references to the decoded images while the page is open.
const preloadedImages: HTMLImageElement[] = [];
let isLoading = false;

async function loadAssets(): Promise<void> {
  if (isLoading) return;
  isLoading = true;

  loader.classList.remove("has-error");
  loaderMessage.textContent = "Preparing your invitation…";
  retryButton.hidden = true;

  try {
    const images = await Promise.all(assetUrls.map(preloadImage));

    preloadedImages.push(...images);

    // Decode the actual displayed elements too, so their first
    // visible frame is ready.
    await Promise.all(
      Array.from(
        experience.querySelectorAll<HTMLImageElement>("img"),
        (image) => image.decode(),
      ),
    );

    try {
      await prepareParticles();
    } catch (error: unknown) {
      console.warn("Unable to prepare particles:", error);
    }

    experience.classList.remove("is-loading");
    experience.inert = false;
    experience.removeAttribute("aria-hidden");

    const shouldRestoreFocus = loader.contains(document.activeElement);
    loader.hidden = true;

    if (shouldRestoreFocus) {
      seal.focus({ preventScroll: true });
    }
  } catch (error: unknown) {
    loader.classList.add("has-error");
    loaderMessage.textContent =
      "Unable to load the invitation. Please try again.";
    retryButton.hidden = false;

    console.error("Invitation asset loading failed:", error);
  } finally {
    isLoading = false;
  }
}

retryButton.addEventListener("click", () => {
  void loadAssets();
});

void loadAssets();
