#!/usr/bin/env node

var fs = require('fs')
    , program = require('commander')
    , baudio = require('baudio')
    , Instrument = require('musicbits').Instrument

var file = ''

program
    .version('0.0.1')
    .option('-i --instrument <instrument>', 'The instrument to use (piano or flute)', /^(piano|flute)$/i, 'piano')
    .option('-d --duration <duration>', 'The duration of a full length note (in seconds)', parseFloat, 0.3)
    .arguments('<file>')
    .action(function(f) {
        file = f
    })
    .parse(process.argv)


if ( !file ) {
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
    console.error('error:', e.message)
    process.exit(1)
}
var melody = parseText(text)

var instrument = new Instrument(melody, program.instrument, program.duration)

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
    return instrument.value(t);
})

if (process.stdout.isTTY) {
    b.play()
}
else {
    b.pipe(process.stdout)
}

function parseText(text) {
    var inputLines = text.split('\n')
    var melody = []
    for (var i = 0; i < inputLines.length; ++i) {
        var line = inputLines[i]
        if ( !line ) {
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
            return new Error('Line has more than two values.')
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
