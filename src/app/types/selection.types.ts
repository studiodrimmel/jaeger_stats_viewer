
// pub struct Label {
//     pub idx: i64, // could be u64, but will be used in json, so will be signed anyway
//     pub label: String,
//     pub selected: bool,
// }

// items as received from the get_selection call
export type SelectionItem = {
    idx: number;
    label: string;
    selected: boolean;
}

export type LabeledSelection = SelectionItem[];

// values used to set the selection
export type Selection = boolean[];