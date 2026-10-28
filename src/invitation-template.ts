import type { InvitationData, InvitationPhoto } from "./invitation-data";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function multiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function renderPhoto(photo: InvitationPhoto, placeholderLabel: string): string {
  const image = photo.src.trim()
    ? `
      <img
        class="couple-photo"
        src="${escapeHtml(photo.src)}"
        alt="${escapeHtml(photo.alt)}"
        decoding="async"
      />
    `
    : `
      <div
        class="photo-placeholder"
        role="img"
        aria-label="${escapeHtml(photo.alt)} — placeholder"
      >
        <span aria-hidden="true">♡</span>
        <small>${escapeHtml(placeholderLabel)}</small>
      </div>
    `;

  return `
    <figure class="photo-card">
      ${image}
      <figcaption>${escapeHtml(photo.caption)}</figcaption>
    </figure>
  `;
}

export function renderInvitation(data: InvitationData): string {
  const { general, details, gallery, thanks } = data;

  return `
    <article
      class="invitation"
      id="invitation"
      aria-label="Wedding invitation"
      aria-hidden="true"
      inert
    >
      <section
        class="invite-section intro-section"
        aria-labelledby="intro-title"
      >
        <div class="section-content">
          <p class="eyebrow">${escapeHtml(general.eyebrow)}</p>

          <h1 id="intro-title" tabindex="-1">
            ${escapeHtml(general.names[0])}
            <span>&amp;</span>
            ${escapeHtml(general.names[1])}
          </h1>

          <div class="divider" aria-hidden="true">✦</div>

          <p class="section-description">
            ${multiline(general.description)}
          </p>

          <p class="date">${escapeHtml(general.date)}</p>
          <p class="section-note">${escapeHtml(general.note)}</p>
        </div>

        <span class="scroll-cue" aria-hidden="true">
          ${escapeHtml(general.scrollHint)}
        </span>
      </section>

      <section
        class="invite-section details-section"
        aria-labelledby="details-title"
      >
        <div class="section-content">
          <p class="eyebrow">${escapeHtml(details.eyebrow)}</p>
          <h2 id="details-title">${escapeHtml(details.title)}</h2>

          <div class="divider" aria-hidden="true">✦</div>

          <p class="event-day">${escapeHtml(details.day)}</p>

          <div class="event-schedule">
            ${details.schedule
              .map(
                (event) => `
                  <div>
                    <span class="event-time">
                      ${escapeHtml(event.time)}
                    </span>
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${multiline(event.description)}</p>
                  </div>
                `,
              )
              .join("")}
          </div>

          <div class="venue-card">
            <p class="eyebrow">
              ${escapeHtml(details.venue.eyebrow)}
            </p>
            <h3>${escapeHtml(details.venue.name)}</h3>
            <p>${multiline(details.venue.address)}</p>

            ${
              details.venue.note
                ? `
                  <span class="placeholder-note">
                    ${escapeHtml(details.venue.note)}
                  </span>
                `
                : ""
            }
          </div>
        </div>
      </section>

      <section
        class="invite-section photos-section"
        aria-labelledby="photos-title"
      >
        <div class="section-content">
          <p class="eyebrow">${escapeHtml(gallery.eyebrow)}</p>
          <h2 id="photos-title">${escapeHtml(gallery.title)}</h2>

          <p class="section-description">
            ${multiline(gallery.description)}
          </p>

          <div class="photo-grid">
            ${gallery.photos
              .map((photo) => renderPhoto(photo, gallery.placeholderLabel))
              .join("")}
          </div>
        </div>
      </section>

      <section
        class="invite-section thanks-section"
        aria-labelledby="thanks-title"
      >
        <div class="section-content">
          <p class="eyebrow">${escapeHtml(thanks.eyebrow)}</p>
          <h2 id="thanks-title">${escapeHtml(thanks.title)}</h2>

          <div class="divider" aria-hidden="true">✦</div>

          <p class="section-description">
            ${multiline(thanks.description)}
          </p>

          <p class="section-note">${escapeHtml(thanks.note)}</p>
          <p class="couple-signature">
            ${escapeHtml(thanks.signature)}
          </p>
          <p class="date">${escapeHtml(thanks.date)}</p>
        </div>
      </section>
    </article>
  `;
}
