# Knuth–Morris–Pratt Search

An naive implementation of [Knuth–Morris–Pratt algorithm][wikipedia_link] that works with [Array][mdn_array_link] & [TypedArray][mdn_typed_array_link]

[wikipedia_link]: https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm
[mdn_array_link]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[mdn_typed_array_link]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray

### Installation
```shell
npm install git+https://github.com/Chocobo1/kmps.git
```

### Usage example
```javascript
const Kmp = require('kmps');  // import this module

// working with TypedArray
{
    const pattern = Uint32Array.from([0xFFFF, 0x3000]);
    const corpus = Uint32Array.from([0xFFFF, 0xFFFF, 0x3000, 0x1000]);

    // setup `kmp` for later reuse
    const kmp = Kmp.KnuthMorrisPratt(pattern);
    // returns the first index of the exact match in `corpus`; -1 if not found
    const idx = kmp.match(corpus);
    if (idx !== 1)
        throw (new Error('Please file an issue'));
}

// also working with String
{
    const pattern = "pattern";
    const corpus = "some pattern !@#$%";

    const kmp = Kmp.KnuthMorrisPratt(pattern);
    const idx = kmp.match(corpus);
    if (idx !== corpus.indexOf(pattern))
        throw (new Error('Please file an issue'));
}

// you can specify offset!
{
    const pattern = "123";
    const corpus = "123abc123";
    const corpusOffset = 1;

    const idx = Kmp.KnuthMorrisPratt(pattern).match(corpus, corpusOffset);
    if (idx !== corpus.indexOf(pattern, corpusOffset))
        throw (new Error('Please file an issue'));
}
```

### Run tests
```shell
npm install -D  # install dev dependencies
npm test        # run tests
```

### References
* http://www.inf.fh-flensburg.de/lang/algorithmen/pattern/kmpen.htm
* https://people.ok.ubc.ca/ylucet/DS/KnuthMorrisPratt.html

### See also
You might be interested to [Boyer–Moore–Horspool algorithm][bmh_link]

[bmh_link]: https://github.com/Chocobo1/bmhs

### License
See [LICENSE](./LICENSE) file
