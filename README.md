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
  -i --instrument <instrument>  instrument to use (piano or flute)
  -d --duration <duration>      duration of a full length note (in seconds)
  -o --outfile <outfile>        save output to outfile, don't play it directly
```

## Data file
The data file should look like this:
```
40
41
42 2
43 0.5
44 0.5
45
```
This will mean:
- play note 40 for one note duration
- play note 41 for one note duration
- play note 42 for two note durations
- play note 43 for half note duration
- play note 44 for half note duration
- play note 45 for one note duration

The note numbers correspond to piano key frequencies, where key 40 is the middle C. [Wikipedia: Piano key frequencies](https://en.wikipedia.org/wiki/Piano_key_frequencies)
