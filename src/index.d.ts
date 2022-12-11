interface KnuthMorrisPratt<T>
{
    skipTable: number[];  // internal
    match: (corpus: T, corpusOffset?: number) => number;
}

export function KnuthMorrisPratt(pattern: any[]): KnuthMorrisPratt<any[]>;
export function KnuthMorrisPratt(pattern: ArrayBufferView): KnuthMorrisPratt<ArrayBufferView>;
export function KnuthMorrisPratt(pattern: string): KnuthMorrisPratt<string>;
