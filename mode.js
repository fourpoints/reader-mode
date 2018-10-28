"use strict";

/*
TODO:
* Factor out settings load; now it loads after the entire page is loaded, which might be slow.
	- wasn't noticeably faster.
*/

/*-- reader view --*/
console.log("mode.js")
/*-- About --*>
Mode.js adds a GUI for changing and saving CSS variables

Include the following in your HTML-document
<link rel="stylesheet" href="path/to/mode.css">
<link rel="stylesheet" href="path/to/light.css" id="mode-css">
<script src="path/to/mode.js" defer=""></script>

<!-- insertion point in <body> -->
<div id="mode">

Settings:
--mode-font-family:
This can be either sans-serif or serif

--mode-font-size:
This adjusts the font-size between 8px and 24px

--mode-content-width:
This adjusts the width between 400px and 1600px

--mode-line-height:
This adjusts the line-height between 16px and 40px

--mode-theme-color:
Can be one of either [light.css, sepia.css, solarized.css, dark.css]
These files must be included in the same folder.

The [Reset to default] values are set to
[serif, 16px, 800px, 24px, light]

The settings can be saved by clicking a [Remember] checkbox,
this will save the variables to localStorage.

Coding time : approximately 10-12 hours (including some breaks)
--*/


// insertion point
const modeNode = document.getElementById("mode");

// virtual node
const vodeNode = document.createDocumentFragment();

// create element function
const createElement = (type, properties = null) => {
	const element = document.createElement(type);
  for (const property in properties) {
		element.setAttribute(property, properties[property]);
	};
  return element;
};

// append children
Node.prototype.appendChildren = function (...children) {
	children.forEach((child) => {this.appendChild(child)});
}

// create toggle button to toggle settings menu
const modeToggle = createElement("div", {class : "mode-toggle open"});
modeToggle.onclick = () => {
	if (modeNode.classList.contains("open")) {
		modeNode.classList.remove("open");
	} else {
		modeNode.classList.add("open");
	}
}

// create reference to root element where variables are stored
const root = document.documentElement
root.getVar = function (varname) {
	// Tries to see if variable is set, otherwise gets computed style.
	return this.style.getPropertyValue(varname)
	|| getComputedStyle(this).getPropertyValue(varname).trim();
}
root.setVar = function (varname, value) {
	this.style.setProperty(varname, value);
}

// Easy access to localStorage
const remembering = () => localStorage.getItem("mode-remember");
const remember = (key, val) => remembering() && localStorage.setItem(key, val);
const recall = (key) => localStorage.getItem(key);
const forget = (key) => localStorage.removeItem(key);

// update item
const update = (key, val) => {
	root.setVar(key, val);
	remember(key.slice(2), val); // will only remember if localStorage is set.
}

// set color theme
const setColorTheme = (theme) => {
	const modeTheme = document.getElementById("mode-css");
	const modePath = modeTheme.href.split('/').slice(0, -1).join('/');
	modeTheme.href = `${modePath}/${theme}.css`;
}

// Load settings if saved
if (remembering()) {
	root.setVar("--mode-font-family", recall("mode-font-family"));
	root.setVar("--mode-font-size", recall("mode-font-size"));
	root.setVar("--mode-content-width", recall("mode-content-width"));
	root.setVar("--mode-line-height", recall("mode-line-height"));
	setColorTheme(recall("mode-color-theme"));
}

/*-- --- --- --- --- --- --- --*/

// create wrapper element
const modeWrapper = createElement("div", {class : "mode-wrapper"});

// create setting elements
const fontFamily   = createElement("div", {class : "mode-font-family"});
const fontSize     = createElement("div", {class : "mode-font-size"});
const contentWidth = createElement("div", {class : "mode-content-width"});
const lineHeight   = createElement("div", {class : "mode-line-height"});
const colorTheme   = createElement("div", {class : "mode-color-theme"});
const storage      = createElement("div", {class : "mode-storage"});


/*-- font-family --*/
const fontFamilySans = createElement("button", {class : "mode-font-sans mode-button"});
fontFamilySans.appendChild(document.createTextNode("Aa"));
fontFamilySans.onclick = () => {
	update("--mode-font-family", "Arial, Helvetica, sans-serif");
}

const fontFamilySerif = createElement("button", {class : "mode-font-serif mode-button"});
fontFamilySerif.appendChild(document.createTextNode("Aa"));
fontFamilySerif.onclick = () => {
	update("--mode-font-family", "'Times New Roman', Times, serif");
}

fontFamily.appendChildren(fontFamilySans, fontFamilySerif);


/*-- font-size --*/
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 24;
const FONT_INCREMENT = 2;

const fontSizeDecrease = createElement("button", {class : "mode-font-decrease mode-button"});
fontSizeDecrease.appendChild(document.createTextNode("-"));
fontSizeDecrease.onclick = () => {
	const currentSize = root.getVar("--mode-font-size");
	const calculatedValue = parseInt(currentSize, 10) - FONT_INCREMENT;
	if (calculatedValue > MIN_FONT_SIZE) {
		update("--mode-font-size", `${calculatedValue}px`);
	}
}

const fontSizeIncrease = createElement("button", {class : "mode-font-increase mode-button"});
fontSizeIncrease.appendChild(document.createTextNode("+"));
fontSizeIncrease.onclick = () => {
	const currentSize = root.getVar("--mode-font-size");
	const calculatedValue = parseInt(currentSize, 10) + FONT_INCREMENT;
	if (calculatedValue < MAX_FONT_SIZE) {
		update("--mode-font-size", `${calculatedValue}px`);
	}
}

fontSize.appendChildren(fontSizeDecrease, fontSizeIncrease);


/*-- content-width --*/
const MIN_WIDTH = 400;
const MAX_WIDTH = 1600;
const WIDTH_INCREMENT = 50;

const contentWidthDecrease = createElement("button", {class : "mode-width-decrease mode-button"});
contentWidthDecrease.appendChild(document.createTextNode("→ ←"));
contentWidthDecrease.onclick = () => {
	const currentSize = root.getVar("--mode-content-width");
	const calculatedValue = parseInt(currentSize, 10) - WIDTH_INCREMENT;
	if (calculatedValue > MIN_WIDTH) {
		update("--mode-content-width", `${calculatedValue}px`);
	}
}

const contentWidthIncrease = createElement("button", {class : "mode-width-increase mode-button"});
contentWidthIncrease.appendChild(document.createTextNode("← →"));
contentWidthIncrease.onclick = () => {
	const currentSize = root.getVar("--mode-content-width");
	const calculatedValue = parseInt(currentSize, 10) + WIDTH_INCREMENT;
	if (calculatedValue < MAX_WIDTH) {
		update("--mode-content-width", `${calculatedValue}px`);
	}
}

contentWidth.appendChildren(contentWidthDecrease, contentWidthIncrease);


/*-- line-height --*/
const MIN_HEIGHT = 16;
const MAX_HEIGHT = 40;
const HEIGHT_INCREMENT = 2;

const lineHeightDecrease = createElement("button", {class : "mode-height-decrease mode-button"});
lineHeightDecrease.appendChild(document.createTextNode("↓↑"));
lineHeightDecrease.onclick = () => {
	const currentSize = root.getVar("--mode-line-height");
	const calculatedValue = parseInt(currentSize, 10) - HEIGHT_INCREMENT;
	if (calculatedValue > MIN_HEIGHT) {
		update("--mode-line-height", `${calculatedValue}px`);
	}
}

const lineHeightIncrease = createElement("button", {class : "mode-height-increase mode-button"});
lineHeightIncrease.appendChild(document.createTextNode("↑↓"));
lineHeightIncrease.onclick = () => {
	const currentSize = root.getVar("--mode-line-height");
	const calculatedValue = parseInt(currentSize, 10) + HEIGHT_INCREMENT;
	if (calculatedValue < MAX_HEIGHT) {
		update("--mode-line-height", `${calculatedValue}px`);
	}
}

lineHeight.appendChildren(lineHeightDecrease, lineHeightIncrease);


/*-- color themes --*/
const lightTheme = createElement("button", {class : "mode-light mode-button"});
lightTheme.onclick = () => {
		setColorTheme("light");
		remember("mode-color-theme", "light");
}

const sepiaTheme = createElement("button", {class : "mode-sepia mode-button"});
sepiaTheme.onclick = () => {
		setColorTheme("sepia");
		remember("mode-color-theme", "sepia");
}

const solarTheme = createElement("button", {class : "mode-solar mode-button"});
solarTheme.onclick = () => {
		setColorTheme("solarized");
		remember("mode-color-theme", "solarized");
}

const darkTheme = createElement("button", {class : "mode-dark mode-button"});
darkTheme.onclick = () => {
	setColorTheme("dark");
	remember("mode-color-theme", "dark");
}

colorTheme.appendChildren(lightTheme, sepiaTheme, solarTheme, darkTheme);


/*-- storage --*/

// reset to default
const reset = createElement("button", {class : "mode-reset"});
reset.appendChild(document.createTextNode("Reset to default"));
reset.onclick = () => {
	update("--mode-font-family", "Arial, Helvetica, sans-serif");
	update("--mode-font-size", "16px");
	update("--mode-content-width", "800px");
	update("--mode-line-height", "24px");
	remember("mode-color-theme", "light");
	setColorTheme("light");
}

// remember settings
const rememberWrapper = createElement("label", {class : "mode-remember-wrap"});
const rememberCheckbox = createElement("input", {type : "checkbox", class : "mode-remember"});
const rememberSpan = createElement("span", {class : "mode-remember-span"});
rememberSpan.appendChild(document.createTextNode("Remember"));
rememberWrapper.appendChildren(rememberCheckbox, rememberSpan);

if (remembering()) rememberCheckbox.checked = true;
rememberCheckbox.onclick = function () {

	if (this.checked) {
		localStorage.setItem("mode-remember", "true");

		remember("mode-font-family", root.getVar("--mode-font-family"));
		remember("mode-font-size", root.getVar("--mode-font-size"));
		remember("mode-content-width", root.getVar("--mode-content-width"));
		remember("mode-line-height", root.getVar("--mode-line-height"));

		//FIXME gets the file name from path string, i.e. /path/name.css -> name
		const theme = document.getElementById("mode-css").href.split('/').pop().split('.').shift()
		remember("mode-color-theme", theme);
	} else {
		forget("mode-remember");

		forget("mode-font-family");
		forget("mode-font-size");
		forget("mode-content-width");
		forget("mode-line-height");
		forget("mode-color-theme");
	}
}

storage.appendChildren(reset, rememberWrapper);

// Append settings
modeWrapper.appendChildren(
	fontFamily, fontSize, contentWidth, lineHeight, colorTheme, storage
);

// Insert into tree
vodeNode.appendChildren(modeToggle, modeWrapper);
modeNode.appendChildren(vodeNode);
