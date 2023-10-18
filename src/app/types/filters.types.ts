export type InboundOption = {
    index: string;
    display: string;
}

export type DateFilterOption = {
    label: string;
    index: number;
    active: boolean;
}

export type DateFilters = DateFilterOption[];

export type Equalizer = 'default' | 'equal' | 'zero'