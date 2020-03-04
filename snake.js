var request = {}

function possibleMoves () {
    possibilities = ['up', 'right', 'down', 'left']
    let x = request.you.body[0].x
    let y = request.you.body[0].y

    // Checks surround blocks to see if occupied by snake bodies.
    for (let snake of request.board.snakes) {
        for (let i = 0; i < snake.body.length; i++) {
            if (snake.body[i].x == x + 1) {
                let rem = possibilities.indexOf('right')
                if (rem >= 0) {
                    possibilities.splice(rem, 1)
                }
            }
            if (snake.body[i].x == x - 1) {
                let rem = possibilities.indexOf('left')
                if (rem >= 0) {
                    possibilities.splice(rem, 1)
                }
            }
            if (snake.body[i].y == y + 1) {
                let rem = possibilities.indexOf('up')
                if (rem >= 0) {
                    possibilities.splice(rem, 1)
                }
            }
            if (snake.body[i].y == y - 1) {
                let rem = possibilities.indexOf('down')
                if (rem >= 0) {
                    possibilities.splice(rem, 1)
                }
            }
        }
    }
    
    if (x == 0) {
        let rem = possibilities.indexOf('left')
        if (rem >= 0) {
            possibilities.splice(rem, 1)
        }
    } else if (x == request.board.width - 1) {
        let rem = possibilities.indexOf('right')
        if (rem >= 0) {
            possibilities.splice(rem, 1)
        }
    }

    if (y == 0) {
        let rem = possibilities.indexOf('down')
        if (rem >= 0) {
            possibilities.splice(rem, 1)
        }
    } else if (y == request.board.height - 1) {
        let rem = possibilities.indexOf('up')
        if (rem >= 0) {
            possibilities.splice(rem, 1)
        }
    }
    
    return possibilities
}

function decide () {
    let options = possibleMoves()
    let want = []

    process.stdout.write(options)
    process.stdout.write(want)

    for (let nug of request.board.food) {
        if (request.you.body[0].x < nug.x) {
            if (want.indexOf('right') < 0) {
                want.push('right')
            }
        } else if (request.you.body[0].x > nug.x) {
            if (want.indexOf('left') < 0) {
                want.push('left')
            }
        }

        if (request.you.body[0].y < nug.y) {
            if (want.indexOf('up') < 0) {
                want.push('up')
            }
        } else if (request.you.body[0].y > nug.y){
            if (want.indexOf('down') < 0) {
                want.push('down')
            }
        }
    }

    let move = 'left'

    for (let dir of options) {
        if (want.indexOf(dir) >= 0) {
            move = dir
        }
    }

    return move
}

module.exports = function (apiRequest) {
    request = apiRequest
    let move = decide()
    process.stdout.write(move)
    return move
}