const DEFAULT_TITLE_MODE = 'one';

/**
 * Generates the HTML blob consumed by the OBS browser source for slides.
 *
 * The previous implementation concatenated `String(settings.titleMode)`
 * directly inside of the HTML, which broke the surrounding markup whenever
 * the mode contained characters that needed escaping (for example `"wrap"`).
 * Using JSON.stringify ensures the value is safely quoted for inline usage.
 */
export function makeSlidesHTML(state) {
  const slides = Array.isArray(state?.slides) ? state.slides : [];
  const settings = state?.settings ?? {};
  const titleMode = settings.titleMode ?? DEFAULT_TITLE_MODE;

  const safeTitleMode = JSON.stringify(String(titleMode));

  const body = slides
    .map((slide, index) => renderSlide(slide, index))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>ITT NewsCentral Slides</title>
</head>
<body data-title-mode=${safeTitleMode}>
${body}
</body>
</html>`;
}

function renderSlide(slide, index) {
  const title = escapeHTML(slide?.title ?? `Slide ${index + 1}`);
  const summary = escapeHTML(slide?.slide_text ?? '');
  const image = slide?.image_url ? `<img src="${escapeAttribute(slide.image_url)}" alt="" />` : '';

  return `  <section class="slide" data-index="${index}">
    ${image}
    <h1>${title}</h1>
    <p>${summary}</p>
  </section>`;
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return String(value).replace(/"/g, '&quot;');
}
