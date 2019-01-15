'use strict';

const Assert = require('assert');
const Jsc = require('jsverify');
const Kmp = require('../src/index.js');

describe("Unit tests", function() {
    describe("kmps.generateSkipTable", function() {
        it("Boundary tests", function() {
            const checkPositive = (val) => {
                const kmp = Kmp.KnuthMorrisPratt(val);

                const x = kmp.skipTable.every((val) => {
                    return (val >= 0);
                });
                Assert(x);
                Assert(kmp.skipTable.length >= 2);
            };

            checkPositive("");
            checkPositive("a");
            checkPositive("looooooong string");

            checkPositive(new Uint32Array(0));
            checkPositive(new Uint32Array(1));
            checkPositive(new Uint32Array(255));
        });
    });

    describe("kmps.match", function() {
        const dataSet = [
            // [pattern, corpus, expectedIdx]

            // boundary
            ["", "", 0],
            ["", "aaa", 0],
            ["aaaa", "", -1],

            [Uint32Array.from([]), Uint32Array.from([]), 0],
            [Uint32Array.from([]), Uint32Array.from([1, 1, 1]), 0],
            [Uint32Array.from([1, 1, 1, 1]), Uint32Array.from([]), -1],

            // can be found
            ["a", "a", 0],
            ["a", "aa", 0],
            ["a", "ba", 1],
            ["aa", "aaaaaa", 0],
            ["aa", "zaaaaa", 1],
            ["aa", "zzaaaa", 2],
            ["aa", "zzzaaa", 3],
            ["aa", "zzzzaa", 4],
            ["aaa", "aaaaaa", 0],
            ["aaa", "zaaaaa", 1],
            ["aaa", "zzaaaa", 2],
            ["aaa", "zzzaaa", 3],
            ["some pattern", "123some pattern321", 3],
            ["STING", "A STRING SEARCHING EXAMPLE CONSISTING OF TEXT", 32],
            ["TEXT", "A STRING SEARCHING EXAMPLE CONSISTING OF TEXT", 41],
            [[5, 1, 1], [0, 5, 1, 1], 1],

            [Uint32Array.from([0xF]), Uint32Array.from([0xF]), 0],
            [Uint32Array.from([0xF]), Uint32Array.from([0xF, 0xF]), 0],
            [Uint32Array.from([0xF]), Uint32Array.from([0x1, 0xF]), 1],
            [Uint32Array.from([0x1, 0xF]), Uint32Array.from([0x1, 0x1, 0xF, 0x1]), 1],
            [Uint32Array.from([0xF, 0x1]), Uint32Array.from([0x1, 0x1, 0xF, 0x1]), 2],

            // cannot be found
            ["zzzz", "zzz", -1],
            ["zzz", "A STRING SEARCHING EXAMPLE CONSISTING OF TEXT", -1],

            [Uint32Array.from([0x1, 0x1, 0xF]), Uint32Array.from([0x1, 0xF, 0x1, 0xF]), -1],
        ];

        it("Boundary tests", function() {
            dataSet.forEach((val) => {
                const pattern = val[0];
                const corpus = val[1];
                const expectedIdx = val[2];

                const idx = Kmp.KnuthMorrisPratt(pattern).match(corpus);
                const msg = "\npattern: " + pattern + ", corpus: " + corpus;
                Assert.equal(idx, expectedIdx, msg);
            });
        });

        it("Reuse tests", function() {
            dataSet.forEach((val) => {
                const pattern = val[0];
                const corpus = val[1];

                const kmp = Kmp.KnuthMorrisPratt(pattern);
                Assert.equal(kmp.match(corpus), kmp.match(corpus));
            });
        });

        it("Offset tests", function() {
            const offsetDataSet = [
                // [pattern, corpus, offset, expectedIdx]

                // boundary
                ["a", "", -100, -1],
                ["a", "", -1, -1],
                ["a", "", 0, -1],
                ["a", "", 1, -1],
                ["a", "", 100, -1],

                ["aa", "aazzzaaa", 0, 0],
                ["aa", "aazzzaaa", 1, 5],
                ["aa", "aazzzaaa", 2, 5],
                ["aa", "aazzzaaa", 3, 5],
                ["aa", "aazzzaaa", 4, 5],
                ["aa", "aazzzaaa", 5, 5],
                ["aa", "aazzzaaa", 6, 6],
                ["aa", "aazzzaaa", 7, -1],
                ["aa", "aazzzaaa", 8, -1],
                ["aa", "aazzzaaa", -1, -1],
                ["aa", "aazzzaaa", -2, 6],
                ["aa", "aazzzaaa", -3, 5],
                ["aa", "aazzzaaa", -4, 5],
                ["aa", "aazzzaaa", -5, 5],
                ["aa", "aazzzaaa", -6, 5],
                ["aa", "aazzzaaa", -7, 5],
                ["aa", "aazzzaaa", -8, 0],
                ["aa", "aazzzaaa", -9, 0],
                ["aa", "aazzzaaa", -10, 0],
            ];

            offsetDataSet.forEach((val) => {
                const pattern = val[0];
                const corpus = val[1];
                const corpusOffset = val[2];
                const expectedIdx = val[3];

                const idx = Kmp.KnuthMorrisPratt(pattern).match(corpus, corpusOffset);
                const msg = "\npattern: " + pattern + ", corpus: " + corpus + ", corpusOffset: " + corpusOffset;
                Assert.equal(idx, expectedIdx, msg);
            });
        });
    });
});

describe("Property tests", function () {
    it("Single integer element", function() {
        Jsc.assertForall(Jsc.nearray(Jsc.integer), (corpus) => {
            const value = corpus[Jsc.random(0, (corpus.length - 1))];
            const corpusOffset = Jsc.random(((-1 * corpus.length) - 5), (corpus.length + 5))

            const idx = Kmp.KnuthMorrisPratt([value]).match(corpus, corpusOffset);
            return (idx === corpus.indexOf(value, corpusOffset));
        });
    });

    it("Multiple integer elements", function() {
        Jsc.assertForall(Jsc.nearray(Jsc.integer), (corpus) => {
            const randomStart = Jsc.random(0, (corpus.length - 1));
            const randomEnd = randomStart + Jsc.random(1, (corpus.length - randomStart));
            const pattern = corpus.slice(randomStart, randomEnd);

            const idx = Kmp.KnuthMorrisPratt(pattern).match(corpus);
            return (idx > -1);
        });
    });

    describe("Compare with String.prototype.indexOf()", function () {
        it("Random inputs, fixed offset = 0", function() {
            Jsc.assertForall(Jsc.string, Jsc.string, (pattern, corpus) => {
                const idx = Kmp.KnuthMorrisPratt(pattern).match(corpus);
                return (idx === corpus.indexOf(pattern));
            });
        });

        it("Random inputs, random offset", function() {
            Jsc.assertForall(Jsc.nestring, Jsc.string, Jsc.integer, (pattern, corpus, corpusOffset) => {
                const idx = Kmp.KnuthMorrisPratt(pattern).match(corpus, corpusOffset);
                return (idx === corpus.indexOf(pattern, corpusOffset));
            });
        });
    });
});
