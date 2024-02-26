# AngularJS matchMediaLight Module

![NPM Version](https://img.shields.io/npm/v/angular-match-media-light)
![NPM Downloads](https://img.shields.io/npm/dm/angular-match-media-light)
![GitHub top language](https://img.shields.io/github/languages/top/sentrysoftware/angular-match-media)
![License](https://img.shields.io/github/license/sentrysoftware/angular-match-media)

Provides an AngularJS service that sets and updates `$matchMedia` in `$rootScope` with the following information:

```js
$matchMedia = {
  size: "xs|sm|md|lg", // Current size of the screen
  retina: true|false, // Whether we're on high-DPI display
  print: true|false, // Whether we're printing
  dark: true|false // Whether we're in dark mode
}
```

Notably features are:

* Automatic setup (you only need to load the AngularJS module)
* Automatically sets and updates `$matchMedia` in `$rootScope`
* Properly detects print events and synchronizes AngularJS
* Reports light-dark color schemes
* User-controllable light-dark color scheme

This project improves on jacopotarantino's excellent [angular-match-media](https://github.com/jacopotarantino/angular-match-media) library in various ways:

* Improved performance (code doesn't rely on `resize` events)
* Encourages developer to follow AngularJS's native functions (use `$watch` rather than specific functions)
* Properly detects screen resizes on print
* Loses compatibility with ancient browsers (pre-2014, although this is admittedly a minus)

## Installation

To install `matchMediaLight` for your AngularJS project via NPM, run the following command in your project's root directory:

```bash
npm install angular-match-media-light --save
```

Include `match-media-light.min.js` in your HTML, after AngularJS:

```html
<script type="text/javascript" src="...your-path-to/node_modules/angular-match-media-light/dist/match-media-light.min.js"></script>
```

## Usage

Require the `matchMediaLight` module as a dependency in your AngularJS application:

```js
// My AngularJS module declaration
var myApp = angular.module('myApp', ['matchMediaLight']);
```

And that's it, `$matchMedia` is now available in `$rootScope`, i.e. everywhere in your `myApp` AngularJS application!

### In HTML templates

In your HTML templates, you can then use:

```html
This is the current media type: {{ $matchMedia.size }} <br>
Theme is: {{ $matchMedia.dark ? 'dark' : 'light' }}
```

which will output:

```
This is the current media type: lg
Theme is: light
```

For example, you can dynamically add classes to the `<body>` element, depending on the size of the screen, to control the CSS:

```html
<body ng-class="'size-' + $matchMedia.size">
```

```css
body.size-xs h3 div {
  display: none;
}

body.size-sm {
  font-size: 10px;
}
```

### In a controller

Simply inject `$rootScope` in your controller to access `$matchMedia` directly, or use `$watch('$matchMedia', myCallBack)` to react to media changes, as in the example below:

```js
angular.module('myApp', ['matchMediaLight']).controller('myController', ['$rootScope', function($rootScope) {

  // Access $matchMedia in $rootScope
  console.log('Screen size is ' + $rootScope.$matchMedia.size);

  // Watch changes in $matchMedia
  $rootScope.$watch('$matchMedia', function(media) {
    console.log('New size: ' + media.size);
    console.log('Retina: ' + media.retina);
    console.log('Dark: ' + media.dark);
    console.log('Print: ' + media.print);
  }, true);

}]);
```

### Control color scheme

Use the `forceDark()` and `forceLight()` methods of the `mediaWatcher` AngularJS service to force the dark or light color scheme. The setting is stored in `window.localStorage` and remembered. Use these functions to let the user control how to display your application.

`$matchMedia.dark` will reflect the setting configured with `forceDark()` and `forceLight()`.

When you call `forceDark()` and that the browser is already in dark mode, the setting is removed from `localStorage` so that the application follows the browser's default behavior. This means that if the browser is set back to light mode, `$matchMedia.dark` will be set to `false` again. Same goes when calling `forceLight()` when the browser is already in light color mode.

You can use [`angular-bootstrap-toggle`](https://ziscloud.github.io/angular-bootstrap-toggle/) to let the user switch from light to dark mode:

```html
<toggle
  ng-model="$matchMedia.dark"
  ng-change="switchColors()"
  size="btn-xs"
  width="34px"
  height="22px"
  off-class="btn-info"
  on-class="btn-primary"
  on="<i class='fa-solid fa-moon'></i>"
  off="<i class='fa-solid fa-sun'></i>">
</toggle>
```

```js
myApp.controller('aController', ['$rootScope', 'mediaWatcher', function($rootScope, mediaWatcher) {

  // [...]

  /**
   * Switches color schemes between light and dark
   * Reacts to ng-change on the toggle
   */
  $scope.switchColors = function() {
    // When we arrive here, $matchMedia.dark has already been forced to the desired value
    $rootScope.$matchMedia.dark ? mediaWatcher.forceDark() : mediaWatcher.forceLight();
  };

}]);
```

### Custom screen sizes or media queries

By default, `$matchMedia.size` matches with Bootstrap 3.x screen sizes: `xs`, `sm`, `md`, and `lg`. You can customize the screen size categories (add or remove), and change the breakpoints.

This must be done during the initialization of your AngularJS module, with as in the example below:

```js
angular.module("myApp").config(["mediaWatcher", function(mediaWatcher) {
  // Add a `xl` size category for extra-large screens
  mediaWatcher.setRules({
    xl: "(min-width: 1980px)",
    lg: "(min-width: 1200px) and (max-width: 1979px)",
    md: "(min-width: 992px) and (max-width: 1199px)",
    sm: "(min-width: 768px) and (max-width: 991px)",
    xs: "(max-width: 767px)"
  });
}]);
```

## License

[MIT License](LICENSE)

## Contributing

Please read our [contributor guide](https://sentrysoftware.org/contributing.html).
