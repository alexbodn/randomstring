// get random string
// the string is a concatenation of substrings of various classes, made after their lengths are calculated

const def_charclass = {
  alpha: 'abcdefghijklmnopqrstuvxyz',
  ALPHA: 'ABCDEFGHIJKLMNOPQRSTUVXYZ',
  digit: '0123456789',
  underscore: '_',
  dash: '-',
  space: ' ',
  period: '.',
  dollar: '$',
  special: '`~!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?',
  too_special: '"/\\[]:;|=,+*?<>',
};

let def_stringtypes = {
  username: {
    segments: [
      {classes: ['alpha', 'underscore'], length: 1,},
      {classes: ['alpha', 'digit', 'underscore', 'dash'], length: [0, 30]},
      {classes: ['alpha', 'digit', 'underscore', 'dollar'], length: [0, 1]},
    ],
    description: 'unix user name',
  },
  passwd: {
    segments: [ // this won't asure minimum for each class
      {classes: ['alpha', 'ALPHA', 'digit', 'special'], length: [9, 255]},
    ],
    description: 'unix user password',
  },
  vncpass: {
    segments: [ // this won't asure minimum for each class
      {classes: ['alpha', 'ALPHA', 'digit'], length: 8},
    ],
    description: 'vnc password',
  },
  winuser: {
    segments: [
      {classes: [], length: [1, 20]}
    ],
    forbidden: [
      'CON', 'PRN', 'AUX', 'NUL', 'NONE',
      'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
      'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
    ],
    description: 'windows user name',
  },
  winpass: {
    segments: [
      {classes: ['alpha', 'ALPHA', 'digit', 'special'], length: [6, 127]},
    ],
    description: 'windows password',
    passwd_quality: {
      classes_occurences: {
        alpha: 1,
        ALPHA: 1,
        digit: 1,
        special: 1
      },
      min_occurences: 3,
    },
  },
};

const getRandomString = (def) => {
	let lengths = new Uint32Array(def.segments.length);
	let totalLength = 0;
	self.crypto.getRandomValues(lengths);
	let segments = new Array(def.segments.length);
	for (const c in lengths) {
		let rng = def.segments[c].length;
		if (Array.isArray(rng)) {
			rng = rng[0] + lengths[c] % (rng[1] - rng[0]);
		}
		segments[c] = {
			length: rng,
			chars: def.segments[c].classes.reduce(
			  (acc, curr) => (acc + def_charclass[curr]), ''),
			offset: totalLength,
		};
		totalLength += rng;
	}
	let entropies = new Uint8Array(totalLength);
	self.crypto.getRandomValues(entropies);
	let result = '';
	for (const c in lengths) {
		for (let c1 = 0; c1 < segments[c].length; ++c1) {
			result += segments[c].chars[entropies[segments[c].offset + c1] % segments[c].chars.length];
		}
	}
	return result;
}

//console.log(getRandomString(def_username));
