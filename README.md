# sangeet
Plays notes from a file.

## Install
To install, just:
```sh
$ npm install -g sangeet
```
However, [sox](https://sox.sourceforge.org) is also required for sangeet to work.

You can build this from source, or use a prebuilt package if it is available.

```sh
$ sudo apt-get install sox # Ubuntu-like
$ sudo yum install sox # Fedora-like
```

## Usage
```
Usage: sangeet [options] <file>

Options:

  -h, --help                    output usage information
  -V, --version                 output the version number
  -i --instrument <instrument>  The instrument to use (piano or flute)
  -d --duration <duration>      The duration of a full length note (in seconds)
```
