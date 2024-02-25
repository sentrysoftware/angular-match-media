/**
 * MIT License

Copyright (c) 2024 Sentry Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
(function() {
	"use strict";

	var app = angular.module("matchMediaLight", []);


	app.factory("mediaWatcher", ["$rootScope", "$window", "$timeout", function mediaWatcherFactory($rootScope, $window, $timeout) {

		// Rules to match different screen sizes
		var rules = {
			lg: "(min-width: 1200px)",
			md: "(min-width: 992px) and (max-width: 1199px)",
			sm: "(min-width: 768px) and (max-width: 991px)",
			xs: "(max-width: 767px)"
		};

		/**
		 * Configures the service with a specific set of rules.
		 * This method is meant to be called during module configuration:
		 * angular.module("myApp").config(["mediaWatcher", function(mediaWatcher) { mediaWatcher.setRules({...}); }])
		 * @param {Map} newRules A map associating a screen site category (xs, sm, etc.) with a \@media query rule
		 */
		var setRules = function(newRules) {
			rules = newRules;
		};

		// The map of media queries for screen sizes
		var mediaQueries;

		// Media query that detects when printing (or not)
		var printMediaQuery = $window.matchMedia("print");

		// Media query that detects Retina (high DPI) screens
		var retinaMediaQuery = $window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5),(min-resolution: 192dpi),(min-resolution: 2dppx)");

		// Media query that detects dark mode
		var darkMediaQuery = $window.matchMedia("(prefers-color-scheme: dark)");

		/**
		 * Initialization function. Don't touch, it's taken care of automatically.
		 */
		var init = function() {

			// Initialize $matchMedia
			$rootScope.$matchMedia = {};

			mediaQueries = {};

			// Build the mediaQueries map with all mediaQuery instances
			// Also, add a change listener to each of them
			angular.forEach(rules, function(rule, category) {
				mediaQueries[category] = $window.matchMedia(rule);
				mediaQueries[category].addEventListener("change", refreshScreenSize);
			});

			// Add listeners for other interesting changes
			printMediaQuery.addEventListener("change", refreshPrint);
			retinaMediaQuery.addEventListener("change", refreshRetina);
			darkMediaQuery.addEventListener("change", refreshDark);

			// Initialize the value
			refreshScreenSize();
			refreshPrint();
			refreshRetina();
			refreshDark();
		};

		/**
		 * @returns the category name of the current screen size
		 */
		function getCurrentScreenSize() {

			var screenSize = "";

			// Find the matching screen size category, if any
			angular.forEach(mediaQueries, function(mediaQuery, category) {
				if (mediaQuery.matches) {
					screenSize = category;
				}
			});

			return screenSize;

		}

		/**
		 * Check the status of each mediaQuery and update the $matchMedia object in $rootScope
		 */
		var refreshScreenSize = function() {

			// Update $matchMedia
			$rootScope.$matchMedia.size = getCurrentScreenSize();

			// Update AngularJS
			$rootScope.$applyAsync();

		};

		/**
		 * Refresh $matchMedia.print
		 */
		var refreshPrint = function() {

			// Refresh $matchMedia.print
			$rootScope.$matchMedia.print = printMediaQuery.matches;

			// Also refresh other properties, because a print event will surely trigger a new screen size
			$rootScope.$matchMedia.size = getCurrentScreenSize();
			$rootScope.$matchMedia.retina = retinaMediaQuery.matches;
			$rootScope.$matchMedia.dark = darkMediaQuery.matches;

			// Special for print event: force a digest cycle NOW, because the browser
			// will probably switch rapidly back to non-print media, once it's done with
			// the rendering of the page. So we need to refresh AngularJS immediately.
			try {
				// Attempt to start a new digest cycle
				$rootScope.$apply();
			} catch (error) {
				if (error.name === "$rootScope:inprog") {
					// If a $digest cycle is already in progress, defer to the next cycle
					$timeout(function() { $rootScope.$apply(); }, 0);
				} else {
					// Rethrow the error if it's not a '$digest already in progress' error
					throw error;
				}
			}
		};

		/**
		 * Refresh $matchMedia.retina
		 */
		var refreshRetina = function() {
			$rootScope.$matchMedia.retina = retinaMediaQuery.matches;
			$rootScope.$applyAsync();
		};

		/**
		 * Refresh $matchMedia.dark
		 */
		var refreshDark = function() {
			$rootScope.$matchMedia.dark = darkMediaQuery.matches;
			$rootScope.$applyAsync();
		};

		// The service methods
		return {
			setRules: setRules,
			init: init
		};

	}]);

	// Initialization
	app.run(["mediaWatcher", function(mediaWatcher) {
		mediaWatcher.init();
	}]);

})();