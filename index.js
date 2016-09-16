#!/usr/bin/env node

var fs = require('fs')
    , program = require('commander')
    , baudio = require('baudio')
    , musicbits = require('musicbits')
    , Instrument = musicbits.Instrument
    , Piano = musicbits.Piano
    , Flute = musicbits.Flute

var file = ''

program
    .version('0.2.0')
    .option('-i --instrument <instrument>', 'instrument to use (piano or flute)', /^(piano|flute)$/i, 'piano')
    .option('-d --duration <duration>', 'duration of a full length note (in seconds)', parseFloat, 0.3)
    .option('-o --outfile <outfile>', 'save output to outfile, don\'t play it directly')
    .arguments('<file>')
    .action(function(f) {
        file = f
    })
    .parse(process.argv)


if (!file) {
    program.help()
}

if (isNaN(program.duration)) {
    console.error('Duration must be a valid decimal number.')
    program.help()
}
try {
    var text = fs.readFileSync(file).toString()
}
catch (e) {
    if (e.code === 'ENOENT') {
        console.error("Error: File '" + file + "' not found.")
    } else {
        console.error('error:', e.message)
    }
    process.exit(1)
}

var melody = parseText(text)

switch (program.instrument) {
    case 'flute':
        var instrument = new Flute(program.duration)
        break
    case 'piano':
        var instrument = new Piano(program.duration)
        break
    default:
        var instrument = new Piano(program.duration)
        break
}

instrument.play(melody)

var endIndex = 0
var startIndex = 0

instrument.on('end', function() {
    endIndex = 1
})

var b = baudio(function(t) {
    if (startIndex < 4400 ) {
        startIndex++
        return 0
    }
    if (endIndex && endIndex < 16000) {
        endIndex++
        if (endIndex == 16000) {
            this.end()
        }
        return 0
    }
    return instrument.value(t)
})

var sox = null

if (program.outfile) {
    sox = b.record(program.outfile)
}
else {
    sox = b.play()
}

sox.stderr.on('data', function (data) {
    console.error(data.toString())
})

sox.on('exit', function (code) {
    if (code !== 0) {
        console.log('Error: sox did not exit normally!')
        process.exit(code)
    }
})

b.on('error', function (error) {
    console.error(error.message)
})

function parseText(text) {
    var inputLines = text.split('\n')
    var melody = []
    for (var i = 0; i < inputLines.length; ++i) {
        var line = inputLines[i]
        if (!line.trim()) {
            continue
        }
        var input = line.split(/\s+/)
        if (input.length === 1) {
            melody.push(parseVal(input[0]))
        }
        else if (input.length === 2) {
            melody.push([parseVal(input[0]), parseDuration(input[1])])
        }
        else {
            throw new Error('Line ' + i + ' has more than two values.')
        }
    }
    return melody
}

function parseVal(input) {
    if (input == 's') {
        return 0
    }
    else if (isNaN(+input)) {
        return new Error('Input', input, 'is not a number.')
    }
    else {
        return +input
    }
}

function parseDuration(duration) {
    if (isNaN(+duration)) {
        return new Error('Duration', duration, 'is not a number.')
    }
    else {
        return +duration
    }
}
