# AMDFriend

Note: All of this is experimental software and it should only be referred to for the purpose of testing.

## Introduction

This project stems directly from the excellent [guide](https://www.macos86.it/topic/5489-tutorial-for-patching-binaries-for-amd-hackintosh-compatibility/) made by tomnic over at the MacOS86 forums.

Since userland patching is not possible with Lilu on Big Sur+, manual patching of libraries of certain programs is needed to get them to work reliably on AMD hackintoshes.

Tomnic did outline some general bit patterns to search for, but then he admitted that a crude find and replace wouldn't be viable. This project uses regular expressions to find those patterns and patch them.

## TO DO

- Test this project with more libraries (currently only Discord's Krisp module is tested and successfully patched)

## Usage

Only use this if you know what you're doing. Also, this is incomplete software.

You will need:
- Node.js: `brew install nodejs`
- Yarn: `brew install yarn`

Install (and update) AMDFriend on your system with this command:
```
$ yarn global add NyaomiDEV/AMDFriend
```

Use it with:
```
$ amdfriend "/path/to/your/library.dylib"
```

## Command line arguments

|Argument|Type|Default value|Description|
|-|-|-|-|
|`--in-place`|Boolean|`false`|Directly patch the library, as opposed to creating a patched library with `.patched` appended to the file name.|
|`--backup`|Boolean|`false`|Only works in conjunction with `--in-place`; it backs up the original library by copying it and appending `.bak` on its extension.|
|`--sign`|Boolean|`false`|Automatically invoke `codesign` on patched libraries.|
|`--dry-run`|Boolean|`false`|Do all checking and patching, but DO NOT write anything to disk. This is useful to test performance and to scan for matches in a given library.|
|`--directories`|Array|Not set|Scan directories alongside files. It will search for any file with no extension and with extension `.dylib`, as they are the common ones to patch.|

## Contributing

If you want to contribute to this project, clone it to your computer!

```sh
$ git clone https://github.com/NyaomiDEV/AMDFriend
$ cd AMDFriend
$ yarn
$ yarn test "/path/to/your/library.dylib"
```

## Tips and tricks

Scan for patchable files in a directory:
```
$ amdfriend --dry-run --directories /path/to/dir /path/to/another/dir | grep "Routines found"
```

Scan for patchable files and patch them (NOT recommended):
```
$ amdfriend --in-place --backup --sign --directories /path/to/dir /path/to/another/dir
```

## License

Refer to the LICENSE file.

## Credits

Tomnic, Tomnic and Tomnic again. You don't know him? He's [this guy](https://www.macos86.it/profile/69-tomnic/).