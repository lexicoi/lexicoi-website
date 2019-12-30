module.exports = {
  heading: function (text, level) {
    return `<h${level} class="f3 f2-m f1-l ">${text}</h${level}>`;
  },

  paragraph: function(text) {
    return `<p class="measure lh-copy">${text}</p>\n`;
  }

}
