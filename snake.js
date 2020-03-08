let request = {}
let mode = ''

// Thinking methods are for life-saving moves and cannot be ignored. snakeOptions prevents immediate death, the others prevent death within the next few turns.
class Thinking {
    constructor (snake) {
        this.snake = snake
    }

    getSnake = function () {
        return this.snake
    }
    
    // Returns possible moves for given snake.
    snakeOptions = function (snake) {
        let possibilities = ['up', 'right', 'left', 'down']
        let x = snake.body[0].x
        let y = snake.body[0].y

        for (let other of request.board.snakes) {
            for (let i = 0; i < other.body.length; i++) {
                if (other.body[i].x == x + 1 && other.body[i].y == y) {
                    if (request.board.width > (x + 1) >= 0) {
                        request.board.possibilities[x + 1][y] = 1
                    }
                    let rem = possibilities.indexOf('right')
                    if (rem >= 0) {
                        possibilities.splice(rem, 1)
                    }
                }
                if (other.body[i].x == x - 1 && other.body[i].y == y) {
                    if (request.board.width > (x - 1) >= 0) {
                        request.board.possibilities[x - 1][y] = 1
                    }
                    let rem = possibilities.indexOf('left')
                    if (rem >= 0) {
                        possibilities.splice(rem, 1)
                    }
                }
                if (other.body[i].y == y + 1 && other.body[i].x == x) {
                    if (request.board.width > (y + 1) >= 0) {
                        request.board.possibilities[x][y + 1] = 1
                    }
                    let rem = possibilities.indexOf('down')
                    if (rem >= 0) {
                        possibilities.splice(rem, 1)
                    }
                }
                if (other.body[i].y == y - 1 && other.body[i].x == x) {
                    if (request.board.width > (y - 1) >= 0) {
                        request.board.possibilities[x][y - 1] = 1
                    }
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

        return possibilities
    }

    avoidTraps = function () {
        let snake = this.getSnake()
    }

    // Returns list of moves that are least likely to collide.
    probabilityFlow = function () {
        let snake = this.getSnake()

        for (let other of request.board.snakes) {
            // Ignoring probablity of own snake moving to a tile.
            if (other.body[0].x == snake.body[0].x && other.body[0].y == snake.body[0].y) {
                break
            }
            let head = other.body[0]
            for (let possibility of this.snakeOptions(other)) {
                let count = this.snakeOptions(other).length
                if (possibility == 'right') {
                    request.board.possibilities[head.x + 1][head.y] += 1/count
                } else if (possibility == 'left') {
                    request.board.possibilities[head.x - 1][head.y] += 1/count
                } else if (possibility == 'up') {
                    request.board.possibilities[head.x][head.y - 1] += 1/count
                } else if (possibility == 'down') {
                    request.board.possibilities[head.x][head.y + 1] += 1/count
                }
            }
        }
        
        let right = 1
        let left = 1
        let up = 1
        let down = 1

        for (let option of this.snakeOptions(snake)) {
            if (option == 'right') {
                right = request.board.possibilities[snake.body[0].x + 1][snake.body[0].y]
            } else if (option == 'left') {
                left = request.board.possibilities[snake.body[0].x - 1][snake.body[0].y]
            } else if (option == 'up') {
                up = request.board.possibilities[snake.body[0].x][snake.body[0].y - 1]
            } else if (option == 'down') {
                down = request.board.possibilities[snake.body[0].x][snake.body[0].y + 1]
            }
        }

        console.log('right ' + right)
        console.log('left ' + left)
        console.log('up ' + up)
        console.log('down ' + down)

        let min = ''
        let result = []
        
        if (right < left) {
           min = right
        } else if (left < up) {
            min = left
        } else if (up < down) {
            min = up
        } else if (down < right) {
            min = down
        }

        if (right == min) {
            result.push('right')
        } if (left == min) {
            result.push('left')
        } if (up == min) {
            result.push('up')
        } if (down == min) {
            result.push('down')
        }
        console.log('probflow chooses ' + result)
        return result
    }
}

// Feeling methods return suggestions. The only consquence of ignoring feeling methods is worse strategy, not death.
class Feeling {
    // Returns a move going towards a given tile.
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

    snakeDirection = function (snake) {
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
            return ['right']
        } else if (vector.x < 0) {
            return ['left']
        } else if (vector.y < 0) {
            return ['up']
        } else if (vector.y > 0) {
            return ['down']
        }
    }
}

// Will return the best behavior mode for the situation. For example, attack, defense, grow, etc.
function mood () {
    // Logic goes here
    mode = 'general'
}

function brain () {
    let think = {left: 0, right: 0, up: 0, down: 0} // Moves that can be made in order to stay alive.
    let feel = {left: 0, right: 0, up: 0, down: 0} // Moves that the snake wants to make depending on strategy.
    let thinking = new Thinking(request.you)
    let feeling = new Feeling()

    for (let move of feeling.moveTowards(request.board.food[0])) {
        let i = feel[move]
        if (i >= 0) {
            feel[move]++
        } else {
            feel[move] = 1
        }
    }

    for (let move of feeling.snakeDirection(request.you)) {
        feel[move]++
    }

    // for (let move of thinking.snakeOptions(request.you)) {
    //     let i = think[move]
    //     if (i >= 0) {
    //         think[move]++
    //     } else {
    //         think[move] = 1
    //     }
    // }

    for (let move of thinking.probabilityFlow()) {
        let i = think[move]
        if (i >= 0) {
            think[move]++
        } else {
            think[move] = 1
        }
    }

    // for (let move in thinking.avoidTraps()) {
    //     let i = think[move]
    //     if (i >= 0) {
    //         think[move]++
    //     } else {
    //         think[move] = 1
    //     }
    // }

    // Removing suicidal moves.
    for (let move in feel) {
        let rem = think[move]
        if (rem == 0) {
            feel[move] = 0
        } else {
            feel[move]++
        }
    }

    // Finding most popular non suicidal move. (One with the most "votes")
    let max = ''
    if (feel.left > feel.right) {
        max = 'left'
    } else if (feel.right > feel.up) {
        max = 'right'
    } else if (feel.up > feel.down) {
        max = 'up'
    } else if (feel.down > feel.left) {
        max = 'down'
    }
    console.log(think)
    console.log(feel)
    return max
}

module.exports = function (apiRequest) {
    request = apiRequest
    request.board.possibilities = []
    for (let i = 0; i < request.board.width; i++) {
        request.board.possibilities.push([])
        for (let j = 0; j < request.board.width; j++) {
            request.board.possibilities[i][j] = 0
        }
    }
    let message = brain()
    console.log(message)
    return message
}
