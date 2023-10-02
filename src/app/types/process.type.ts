export type Process = {
    idx: number;
    key: string;      // @Wesley: originally we had a name parameter, but this is replaced by a 'display' value (nearly always unique) and a key (always unique).
    display: string;
    rank: number;
}