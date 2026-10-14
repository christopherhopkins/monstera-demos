/**
 * The launcher's light/dark toggle: the portal's segmented group, remembered
 * in this browser.
 *
 * Loaded in <head> without defer, so the theme is on <html> before the first
 * paint: the dark tokens hang off the attribute, and a dark system would
 * otherwise flash the light page on every load. A stored choice outranks the
 * system preference. The buttons are wired once the document has them.
 */
( function () {
	const KEY = 'monstera-demos-theme';
	const root = document.documentElement;
	const system = window.matchMedia( '(prefers-color-scheme: dark)' );

	let stored = null;
	try {
		stored = window.localStorage.getItem( KEY );
	} catch ( e ) {
		stored = null;
	}
	if ( 'light' !== stored && 'dark' !== stored ) {
		stored = null;
	}

	function current() {
		return stored || ( system.matches ? 'dark' : 'light' );
	}

	function reflect() {
		document
			.querySelectorAll( '[data-theme-set]' )
			.forEach( function ( button ) {
				button.setAttribute(
					'aria-pressed',
					button.dataset.themeSet === current() ? 'true' : 'false'
				);
			} );
	}

	function apply() {
		root.setAttribute( 'data-monstera-theme', current() );
		reflect();
	}

	function wire() {
		document
			.querySelectorAll( '[data-theme-set]' )
			.forEach( function ( button ) {
				button.addEventListener( 'click', function () {
					stored = button.dataset.themeSet;
					try {
						window.localStorage.setItem( KEY, stored );
					} catch ( e ) {
						// Private windows and blocked storage: the choice lasts the page.
					}
					apply();
				} );
			} );
		reflect();
	}

	apply();
	system.addEventListener( 'change', apply );
	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', wire );
	} else {
		wire();
	}
} )();
