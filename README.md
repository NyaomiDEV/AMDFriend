# AMDFriend

Note: All of this is experimental software and it should only be referred to for the purpose of testing.

The issue section has been disabled because people started reporting issues with single apps and libraries, and not with AMDFriend. This is EXPERIMENTAL SOFTWARE and NO SUPPORT FOR SPECIFIC LIBRARIES WAS EVER GIVEN. Again, you are on your own.

If there are issues SPECIFIC to AMDFriend I am sure y'all will know how to reach me eventually.

## Introduction

This project stems directly from the excellent [guide](https://www.macos86.it/topic/5489-tutorial-for-patching-binaries-for-amd-hackintosh-compatibility/) made by tomnic over at the MacOS86 forums.

Tomnic did outline some general bit patterns to search for, but then he admitted that a crude find and replace wouldn't be viable. This project uses regular expressions to find those patterns and patch them.

## Usage

Only use this if you know what you're doing. Also, this is incomplete software.

### From the Releases section

Just grab the latest binary from the Releases section, mark it as executable, clear XAttrs as I cannot sign it, and use it. You can put it in your PATH (usually `/usr/local/bin`) if you want, for easy access.

## Observed quirks

- Discord's Krisp module will only work if SIP is disabled. Reason is that the system usually won't load libraries that are not signed with the same key as the main application.
- Only patch `libtbb` and `libtbbmalloc` in Autocad 2024 -- there's a false positive inside one of the other libraries that, if patched, would crash the program on launch.

## Command line arguments

|Argument|Type|Default value|Description|
|-|-|-|-|
|`--in-place`|Boolean|`false`|Directly patch the library, as opposed to creating a patched library with `.patched` appended to the file name.|
|`--backup`|Boolean|`false`|Only works in conjunction with `--in-place`; it backs up the original library by copying it and appending `.bak` on its extension.|
|`--sign`|Boolean|`false`|Automatically invoke `codesign` on patched libraries.|
|`--clear-xa`|Boolean|`true`|Automatically invoke `xattr -c` on patched libraries.|
|`--dry-run`|Boolean|`false`|Do all checking and patching, but DO NOT write anything to disk. This is useful to test performance and to scan for matches in a given library.|
|`--directories`|Array|Not set|Scan directories alongside files. It will search for any file with no extension and with extension `.dylib`, as they are the common ones to patch.|
|`--jobs`|Number|N. of threads available|The number of jobs that will be spawned to process the libraries.|

## Contributing

If you want to contribute to this project, clone it to your computer!

```sh
git clone https://github.com/NyaomiDEV/AMDFriend
cd AMDFriend
deno install
deno task start "/path/to/your/library.dylib"
```

## Tips and tricks

Scan for patchable files in a directory:
```
amdfriend --dry-run --directories /path/to/dir /path/to/another/dir | grep "Routines found"
```

Scan for patchable files and patch them (NOT recommended, might use `sudo` in front of the command if patching directories not owned by the current user):
```
amdfriend --in-place --backup --sign --directories /path/to/dir /path/to/another/dir
```

## License

Refer to the LICENSE file.

## Credits

Tomnic, Tomnic and Tomnic again. You don't know him? He's [this guy](https://www.macos86.it/profile/69-tomnic/).
