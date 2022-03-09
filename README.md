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
- Node.js
- Yarn

(Yes I should rewrite this project in Python or Perl or something more 'affordable' once it works reliably)

```sh
$ git clone https://github.com/NyaomiDEV/AMDFriend
$ cd AMDFriend
$ yarn
$ yarn build && yarn start "/path/to/your/library.dylib"
```

## License

Refer to the LICENSE file.

## Credits

Tomnic, Tomnic and Tomnic again. You don't know him? He's [this guy](https://www.macos86.it/profile/69-tomnic/).