// This plugin checks contrast for all text in the current file
// Author: portiao@amazon.com
// Last updated: 4 Jan 2022

// Helper functions
function RGBToHex(r, g, b) {
  r = Math.round(r * 255).toString(16);
  g = Math.round(g * 255).toString(16);
  b = Math.round(b * 255).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return r + g + b;
}

// Create the Plugin UI
figma.showUI(__html__, {
  visible: false,
  title: "Contrast checker",
  width: 200,
  height: 280,
});

// Check that only 2 layers are selected, if not, throw an error
if (figma.currentPage.selection.length != 2) {
  const error = "You must select exactly two layers";
  throw error;
}

//  Put selections into an array
const selections = [];
let text = "[None]";

figma.currentPage.selection.forEach((selection) => {
  switch (selection.type) {
    case "TEXT":
      text = '"' + selection.characters + '"';
      selections.push({
        color: selection.fills[0].color,
        type: selection.type,
      });
      break;
    case "LINE":
    case "POLYGON":
    case "RECTANGLE":
    case "STAR":
    case "VECTOR":
    case "STAMP":
    case "ELLIPSE":
      selections.push({
        color: selection.fills[0].color,
        type: selection.type,
      });
      break;
  }
});

// Get hex values for each node fill
const hexValues = selections.map((selection) => {
  return RGBToHex(selection.color.r, selection.color.g, selection.color.b);
});

// Check contrast with https://webaim.org/resources/contrastchecker/?fcolor=FF0000&bcolor=FFFFFF&api
// Forground/background order doesn't matter per https://webaim.org/articles/contrast/#ratio
const apiString =
  "https://webaim.org/resources/contrastchecker/?fcolor=" +
  hexValues[0] +
  "&bcolor=" +
  hexValues[1] +
  "&api";

figma.ui.postMessage({ apiString, text });

// Show output - most of the work is done in ui.html
figma.ui.show();
