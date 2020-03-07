let request = {}
let mode = ''

// Class for all collision avoidance functions.
class Thinking {
    constructor (snake) {
        this.snake = snake
    }
    
    getSnake = function () {
        return this.snake
    }
    
    // Returns possible moves for given snake.
    snakeOptions = function () {
        let snake = getSnake()
        let possibilities = ['up', 'right', 'left', 'down']
        let x = snake.body[0].x
        let y = snake.body[0].y

        for (let other of request.board.snakes) {
            for (let i = 0; i < other.body.length; i++) {
                if (other.body[i].x == x + 1 && other.body[i].y == y) {
                    let rem = possibilities.indexOf('right')
                    if (rem >= 0) {
                        possibilities.splice(rem, 1)
                    }
                }
                if (other.body[i].x == x - 1 && other.body[i].y == y) {
                    let rem = possibilities.indexOf('left')
                    if (rem >= 0) {
                        possibilities.splice(rem, 1)
                    }
                }
                if (other.body[i].y == y + 1 && other.body[i].x == x) {
                    let rem = possibilities.indexOf('down')
                    if (rem >= 0) {
                        possibilities.splice(rem, 1)
                    }
                }
                if (other.body[i].y == y - 1 && other.body[i].x == x) {
                    let rem = possibilities.indexOf('up')
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
            let rem = possibilities.indexOf('up')
            if (rem >= 0) {
                possibilities.splice(rem, 1)
            }
        } else if (y == request.board.height - 1) {
            let rem = possibilities.indexOf('down')
            if (rem >= 0) {
                possibilities.splice(rem, 1)
            }
        }
        console.log(possibilities)
        return possibilities
    }

    snakeDirection = function () {
        let snake = getSnake()

        if (snake.body.length == 1) {
            return 'right'
        }
        let head = {
            x: snake.body[0].x,
            y: snake.body[0].y
        }
        let neck = {
            x: snake.body[1].x,
            y: snake.body[1].y
        }
        let vector = {
            x: head.x - neck.x,
            y: head.y - neck.y
        }

        if (vector.x > 0) {
            return 'right'
        } else if (vector.x < 0) {
            return 'left'
        } else if (vector.y < 0) {
            return 'up'
        } else if (vector.y > 0) {
            return 'down'
        }
    }

    avoidTraps = function () {
        let snake = getSnake()
    }

    avoidHeadOnCollisions = function () {
        let snake = getSnake()
    }
}
    // function heatMap () {
    //     for (let snake of request.board.snakes) {
            
    //     }
    // }

class Feeling {
    // Returns a move going towards a given tile.
    // TODO: Add weights for wanted moves, return highest weighted one.
    moveTowards ({x, y}) {
        let want = []
        
        if (request.you.body[0].x < x) {
            if (want.indexOf('right') < 0) {
                want.push('right')
            }
        } else if (request.you.body[0].x > x) {
            if (want.indexOf('left') < 0) {
                want.push('left')
            }
        }

        if (request.you.body[0].y > y) {
            if (want.indexOf('up') < 0) {
                want.push('up')
            }
        } else if (request.you.body[0].y < y){
            if (want.indexOf('down') < 0) {
                want.push('down')
            }
        }

        return want
    }

    moveAway ({x, y}) {
        let want = []
        
        if (request.you.body[0].x > x) {
            if (want.indexOf('right') < 0) {
                want.push('right')
            }
        } else if (request.you.body[0].x < x) {
            if (want.indexOf('left') < 0) {
                want.push('left')
            }
        }

        if (request.you.body[0].y < y) {
            if (want.indexOf('up') < 0) {
                want.push('up')
            }
        } else if (request.you.body[0].y > y){
            if (want.indexOf('down') < 0) {
                want.push('down')
            }
        }

        return want
    }
}

// Will return the best behavior mode for the situation. For example, attack, defense, grow, etc.
function mood () {
    // Logic goes here
    mode = 'general'
}

function brain () {
    let think = []
    let thinking = new Thinking(request.you)
    
    think.push(thinking.avoidHeadOnCollisions())
    think.push(thinking.avoidTraps())
    think.push(thinking.snakeOptions())
    think.push(thinking.snakeDirection())

    console.log(think)
    // Removing impossible moves.
    for (let i = 0; i < result.length; i++) {
        let rem = possible.indexOf(result[i])
        if (rem < 0) {
            result.splice(i, 1)
            i--
        }
    }
}

module.exports = function (apiRequest) {
    request = apiRequest
    brain()
    return Thinking(request.you).snakeOptions()[0]
}
