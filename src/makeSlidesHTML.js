/**
 * Generates an HTML document for the slide deck using the provided settings.
 * The function previously concatenated the title mode directly into the
 * JavaScript block which resulted in invalid syntax when the value was a
 * string (e.g. `one`). To avoid syntax errors and injection issues we rely on
 * JSON.stringify so the emitted JavaScript receives a quoted string literal.
 *
 * @param {Object} slides - Slide configuration object.
 * @param {Object} [slides.settings] - Settings that influence rendering.
 * @param {string} [slides.settings.titleMode="one"] - Title rendering mode.
 * @returns {string} Complete HTML document as a string.
 */
function makeSlidesHTML(slides = {}) {
  const settings = slides.settings || {};
  const titleMode = settings.titleMode ?? 'one';
  const titleModeLiteral = JSON.stringify(titleMode);

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <title>Slides</title>',
    '</head>',
    '<body>',
    '  <div id="wrap"></div>',
    '  <script>',
    '    (function() {',
    '      var wrap = document.getElementById("wrap");',
    '      if (!wrap) { return; }',
    '      wrap.dataset.titleMode = ' + titleModeLiteral + ';',
    '    }());',
    '  </script>',
    '</body>',
    '</html>'
  ].join('\n');
}

module.exports = {
  makeSlidesHTML,
};
