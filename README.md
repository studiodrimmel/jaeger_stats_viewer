# Tauri + Yew

This template should help get you started developing with Tauri and Angular.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) + [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).

## MacOS
`/tmp/stitched.bincode` (src-tauri/src/main.rs, line 18) does not exist on MacOS, therefore the application won't run on a MacOS device. However you can add the file to the `/private/var/tmp`.

Open the Terminal and use the following command: `open /private/var/tmp`.
This opens up the directory in which you can paste the stitched.bincode.
Than update the src-tauri/src/main.rs, line 18 with `#[arg(short, long, default_value_t = String::from("/private/var/tmp/stitched.bincode"))]`