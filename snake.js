let request = {}
let requestText = ''
let mode = ''
let maxIterations = 5

// Thinking methods are for life-saving moves and cannot be ignored. snakeOptions prevents immediate death, the others prevent death within the next few turns.
class Thinking {
    constructor () {
    }

    // Returns possible moves for given snake.
    snakeOptions = function (snake, apiRequest) {
        let possibilities = ['up', 'right', 'left', 'down']
        let x = snake.body[0].x
        let y = snake.body[0].y

        for (let other of apiRequest.board.snakes) {
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
        } else if (x == apiRequest.board.width - 1) {
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
        } else if (y == apiRequest.board.height - 1) {
            let rem = possibilities.indexOf('down')
            if (rem >= 0) {
                possibilities.splice(rem, 1)
            }
        }

        return possibilities
    }

    simulateHelper = function (apiRequest, move, iterations) {
        let simRequest = JSON.parse(apiRequest)
        let snake = simRequest.you
        let head = snake.body[0]
        iterations++
        if (iterations == maxIterations + 1) {
            return 0
        }
        for (let other of simRequest.board.snakes) {
            if (other.body.length == 0) {
                break
            } else if (other.body[0].x == head.x && other.body[0].y == head.y) {
                // "Other" is actually my snake.
                if (move == 'right') {
                    other.body.unshift({x: head.x + 1, y: head.y})
                } else if (move == 'left') {
                    other.body.unshift({x: head.x - 1, y: head.y})
                } else if (move == 'up') {
                    other.body.unshift({x: head.x, y: head.y - 1})
                } else if (move == 'down') {
                    other.body.unshift({x: head.x, y: head.y + 1})
                }
            }
            let x = other.body[other.body.length - 1].x
            let y = other.body[other.body.length - 1].y
            // simRequest.board.possibilities[x][y]--
            other.body.pop()
        }
        
        // Delete tail of own snake.
        let x = snake.body[snake.body.length - 1].x
        let y = snake.body[snake.body.length - 1].y
        // simRequest.board.possibilities[x][y]--
        snake.body.pop()

        // Moves head to given move.
        if (move == 'right') {
            snake.body.unshift({x: head.x + 1, y: head.y})
        } else if (move == 'left') {
            snake.body.unshift({x: head.x - 1, y: head.y})
        } else if (move == 'up') {
            snake.body.unshift({x: head.x, y: head.y - 1})
        } else if (move == 'down') {
            snake.body.unshift({x: head.x, y: head.y + 1})
        }

        // Check if snake moved off the board or ran out of options.
        if (0 > snake.body[0].x || snake.body[0].x >= simRequest.board.width) {
            return 0
        } else if (0 > snake.body[0].y || snake.body[0].y >= simRequest.board.height) {
            return 0
        }

        for (let move of this.probabilityFlow(simRequest)) {
            let newRequest = JSON.stringify(simRequest)
            return 1 + this.simulateHelper(newRequest, move, 0)
        }

        return 0
    }

    // Makes decision between simulated directions.
    simulate = function (apiRequest) {
        let nextRequest = JSON.parse(apiRequest)
        let result = {right: 0, left: 0, up: 0, down: 0}
        let final = []
        for (let move of this.probabilityFlow(nextRequest)) {
            // console.log('simulating ' + move)
            result[move] = this.simulateHelper(apiRequest, move, 0)
            // console.log(result[move])
        }

        let max = Math.max(result.right, result.left, result.up, result.down)
        if (result['right'] == max) {
            final.push('right')
        } if (result['left'] == max) {
            final.push('left')
        } if (result['up'] == max) {
            final.push('up')
        } if (result['down'] == max) {
            final.push('down')
        }
        console.log(result)
        return final
    }
    
    // Updates occupied tiles of board to have 100% probability.
    updateProbabilities = function (apiRequest) {
        for (let snakes of apiRequest.board.snakes) {
            for (let tile of snakes.body) {
                let x = tile.x
                let y = tile.y

                apiRequest.board.possibilities[x][y]++
            }
        }
    }
    // Returns list of moves that are least likely to collide.
    probabilityFlow = function (apiRequest) {
        let snake = apiRequest.you
        this.updateProbabilities(apiRequest)
        for (let other of apiRequest.board.snakes) {
            // Ignoring probablity of own snake moving to a tile.
            if (other.body.length == 0) {
                continue
            }
            if (other.body[0].x == snake.body[0].x && other.body[0].y == snake.body[0].y) {
                continue
            }

            let head = other.body[0]
            for (let possibility of this.snakeOptions(other, apiRequest)) {
                let count = this.snakeOptions(other, apiRequest).length
                if (possibility == 'right') {
                    apiRequest.board.possibilities[head.x + 1][head.y] += 1/count
                } else if (possibility == 'left') {
                    apiRequest.board.possibilities[head.x - 1][head.y] += 1/count
                } else if (possibility == 'up') {
                    apiRequest.board.possibilities[head.x][head.y - 1] += 1/count
                } else if (possibility == 'down') {
                    apiRequest.board.possibilities[head.x][head.y + 1] += 1/count
                }
            }
        }
        let right = 1
        let left = 1
        let up = 1
        let down = 1
        for (let option of this.snakeOptions(snake, apiRequest)) {
            if (option == 'right') {
                right = apiRequest.board.possibilities[snake.body[0].x + 1][snake.body[0].y]
            } else if (option == 'left') {
                left = apiRequest.board.possibilities[snake.body[0].x - 1][snake.body[0].y]
            } else if (option == 'up') {
                up = apiRequest.board.possibilities[snake.body[0].x][snake.body[0].y - 1]
            } else if (option == 'down') {
                down = apiRequest.board.possibilities[snake.body[0].x][snake.body[0].y + 1]
            }
        }

        // console.log('right ' + right)
        // console.log('left ' + left)
        // console.log('up ' + up)
        // console.log('down ' + down)
        

        let min = ''
        let options = []
        
        min = Math.min(right, left, up, down)
        if (right == min) {
            options.push('right')
        } if (left == min) {
            options.push('left')
        } if (up == min) {
            options.push('up')
        } if (down == min) {
            options.push('down')
        }        
        // TODO: make sure probabilities are only being edited once per turn simulation.        

        if (min >= 1) {
            return []
        }
        return options
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

function closestFood () {
    let x = request.you.body[0].x
    let y = request.you.body[0].y
    let minDistance = 100 // TODO: make this unhard coded.
    let minFood = {}

    for (let food of request.board.food) {
        let deltax = food.x - x
        let deltay = food.y - y
        // console.log(Math.sqrt(deltax**2 + deltay**2))
        if (Math.sqrt(deltax**2 + deltay**2) < minDistance) {
            // console.log(food)
            minFood = food
        }
    }
    // console.log('closest food is ' + minDistance + " away " + minFood.x + " " + minFood.y)
    
    if (minDistance == 100) {
        return request.board.food[0]
    }

    return minFood
}

function brain () {
    let think = {left: 0, right: 0, up: 0, down: 0} // Moves that can be made in order to stay alive.
    let feel = {left: 0, right: 0, up: 0, down: 0} // Moves that the snake wants to make depending on strategy.
    let thinking = new Thinking(request.you)
    let feeling = new Feeling()

    for (let move of feeling.moveTowards(closestFood())) {
        let i = feel[move]
        if (i >= 0) {
            feel[move]++
        } else {
            feel[move] = 1
        }
    }

    // for (let move of feeling.snakeDirection(request.you)) {
    //     feel[move]++
    // }

    // for (let move of thinking.snakeOptions(request.you)) {
    //     let i = think[move]
    //     if (i >= 0) {
    //         think[move]++
    //     } else {
    //         think[move] = 1
    //     }
    // }

    for (let move of thinking.simulate(requestText)) {
        let i = think[move]
        if (i >= 0) {
            think[move]++
        } else {
            think[move] = 1
        }
    }

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
    let max = Math.max(feel.right, feel.left, feel.up, feel.down)
    
    // console.log(think)
    // console.log(feel)

    for (let move of Object.keys(feel)) {
        if (feel[move] == max) {
            return move
        }
    }
}

module.exports = function (apiRequest) {
    request = apiRequest
    request.board.possibilities = []
    // console.log(request.you.body[0])
    console.time('now')
    for (let i = 0; i < request.board.width; i++) {
        request.board.possibilities.push([])
        for (let j = 0; j < request.board.width; j++) {
            request.board.possibilities[i][j] = 0
        }
    }
    requestText = JSON.stringify(request)
    let message = brain()
    // console.log(request.you.body[0])
    console.log(message)
    console.timeEnd('now')
    return message
}
