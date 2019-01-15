'use strict';

function generateSkipTable(pattern)
{
    var table = [0, 0];  // first `0` is for padding
    for (let i = 0, j = 1; j < pattern.length; ++j)
    {
        if (pattern[i] === pattern[j])
            ++i;
        else
            i = (pattern[0] === pattern[j]) ? 1 : 0;

        table.push(i);
    }

    return table;
}

function search(pattern, skipTable, corpus, corpusOffset)
{
    // returns first match index in `corpus`
    // returns -1 if not found

    if (pattern.length <= 0)
        return 0;

    if (corpusOffset >= corpus.length)
        return -1;

    if (corpusOffset < 0)
    {
        corpusOffset += corpus.length;
        corpusOffset = Math.max(0, corpusOffset);
    }

    for (let i = corpusOffset, j = 0, iMax = (corpus.length - pattern.length); i <= iMax;)
    {
        if (pattern[j] === corpus[i + j])
        {
            ++j;
            if (j === pattern.length)
                return i;
        }
        else
        {
            i += (j > 0) ? (j - skipTable[j]) : 1;
            j = skipTable[j];
        }
    }

    return -1;
}

function KnuthMorrisPratt(pattern)
{
    if (!new.target)
        return (new KnuthMorrisPratt(pattern));

    this.pattern = pattern;
    this.skipTable = generateSkipTable(pattern);

    this.match = (corpus, corpusOffset = 0) => search(this.pattern, this.skipTable, corpus, corpusOffset);
}


module.exports = {
    KnuthMorrisPratt: KnuthMorrisPratt
};
