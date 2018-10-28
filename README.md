# reader-mode
A Firefox-inspired reader mode that toggles font and theme using css-variables and js.

Include the following in your html file
```html
<script src="path/to/mode.js" defer></script>
<link rel="stylesheet" id="mode-css" href="path/to/themes/light.css">
<link rel="stylesheet" href="path/to/mode.css">
```

Include `light.css`, `sepia.css`, `solarized.css`, and `dark.css` in the themes folder.

Include the following in `mode.css`
```css
:root {
	--mode-font-family: sans-serif;
	--mode-font-size: 16px;
	--mode-line-height: 24px;
	--mode-content-width: 800px;
}
```
and use the css `var()` function in a class to use these settings. e.g.
```css
.content {font-family: var(--mode-font-family);
```

![Settings menu](https://i.imgur.com/s7eq5EL.jpg)
