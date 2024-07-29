var fs = require('fs');
var chalk = require('chalk');

module.exports = {
	input: [
		'src/**/*.{js,jsx,ts,tsx}',
		// Use ! to filter out files or directories
		'!src/**/*.spec.{js,jsx,ts,tsx}',
		'!i18n/**',
		'!**/node_modules/**',
	],
	output: './',
	options: {
		compatibilityJSON: 'v3',
		debug: true,
		func: {
			list: ['i18next.t', 'i18n.t', 't'],
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
		},
		trans: {
			component: 'Trans',
			i18nKey: 'i18nKey',
			defaultsKey: 'defaults',
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
			fallbackKey(ns, value) {
				return value;
			},
			acorn: {
				ecmaVersion: 2020,
				sourceType: 'module',
				// Check out https://github.com/acornjs/acorn/tree/master/acorn#interface for additional options
			},
		},
		lngs: ['ru', 'en', 'de'],
		ns: ['translation', 'siteNews', 'tournamentRules', 'teams'],
		defaultLng: 'ru',
		defaultNs: 'translation',
		defaultValue: '__STRING_NOT_TRANSLATED__',
		resource: {
			loadPath: 'i18n/{{lng}}/{{ns}}.json',
			savePath: 'i18n/{{lng}}/{{ns}}.json',
			jsonIndent: 2,
			lineEnding: '\n',
		},
		nsSeparator: ':', // namespace separator
		keySeparator: '.', // key separator
		interpolation: {
			prefix: '{{',
			suffix: '}}',
		},
	},
	transform: function customTransform(file, enc, done) {
		'use strict';
		const parser = this.parser;
		const content = fs.readFileSync(file.path, enc);
		let count = 0;

		parser.parseFuncFromString(content, { list: ['i18next.t', 'i18n.t', 't'] }, (key, options) => {
			parser.set(
				key,
				Object.assign({}, options, {
					nsSeparator: ':',
					keySeparator: '.',
				})
			);
			++count;
		});

		if (count > 0) {
			console.log(
				`i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(
					JSON.stringify(file.relative)
				)}`
			);
		}

		done();
	},
};
