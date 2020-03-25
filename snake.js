let request = {}
let requestText = ''
let mode = ''
let maxIterations = 6 // Number of move iterations to be performed.
let iterations = 0
let storage = []
let newStorage = []

// Thinking methods are for life-saving moves and cannot be ignored. snakeOptions prevents immediate death, the others prevent death within the next few turns.
class Thinking {
    constructor () {
    }

    logProbabilities = function (apiRequest) {
        for (let y = 0; y < apiRequest.board.width; y++) {
            let line = ''
            for (let x = 0; x < apiRequest.board.height; x++) {
                if (apiRequest.board.possibilities[x][y] != 0) {
                    line += apiRequest.board.possibilities[x][y].toFixed(2) + ' '
                } else {
                    line += '     '
                }
            }
            console.log(line)
        }
        console.log('')
    }

    // Returns possible moves for given snake.
    snakeOptions = function (coord, apiRequest) {
        let possibilities = ['up', 'right', 'left', 'down']
        let x = coord.x
        let y = coord.y

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

    simulateHelper = function (apiRequest, move) {
        let simRequest = JSON.parse(apiRequest)
        let snake = simRequest.you
        let head = snake.body[0]
        iterations++

        head = simRequest.you.body[0]
        let prob = simRequest.board.possibilities[head.x][head.y]
        if (iterations > maxIterations) {
            // console.log("returning " + prob)
            return prob
        }
        this.updateProbs(simRequest)
        // Current problems: probability not changing when snake moves. Snake moves backwards into itself when at size 2.
        for (let other of simRequest.board.snakes) {
            if (other.body.length == 1) {
                continue
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

                // Moved into self.
                if (other.body[0].x == other.body[2].x && other.body[0].y == other.body[2].y) {
                    return 1
                }
            }
            let x = other.body[other.body.length - 1].x
            let y = other.body[other.body.length - 1].y
            if (simRequest.board.possibilities[x][y] != 0) {
                simRequest.board.possibilities[x][y]--
            }
            other.body.pop()
        }
        
        // Updates snake body at request.you
        if (move == 'right') {
            snake.body.unshift({x: head.x + 1, y: head.y})
        } else if (move == 'left') {
            snake.body.unshift({x: head.x - 1, y: head.y})
        } else if (move == 'up') {
            snake.body.unshift({x: head.x, y: head.y - 1})
        } else if (move == 'down') {
            snake.body.unshift({x: head.x, y: head.y + 1})
        }
        snake.body.pop()
        // Check if snake moved off the board.
        if (0 > snake.body[0].x || snake.body[0].x >= simRequest.board.width) {
            return 1
        } else if (0 > snake.body[0].y || snake.body[0].y >= simRequest.board.height) {
            return 1
        }
        let result = {right: 1, left: 1, up: 1, down: 1}
        let newRequest = JSON.stringify(simRequest)
        for (let move of this.probabilityFlow(simRequest)) {
            // console.log('simulating ' + move)
            result[move] = this.simulateHelper(newRequest, move)
            // console.log(result[move])
        }
        // Logic for returning the move that sums to the least amount of probability.
        console.log(result)
        let min = Math.min(result.right, result.left, result.up, result.down)
        // return simRequest.board.possibilities[snake.body[0].x][snake.body[0].y] - 1 + min
        return prob + min

    }

    // Makes decision between simulated directions.
    simulate = function (apiRequest) {
        let result = {right: 0, left: 0, up: 0, down: 0}
        let final = []
        // let currentRequest = JSON.parse(apiRequest)
        // this.updateProbs(currentRequest)

        for (let move of ['left', 'right', 'up', 'down']) {
            // console.log('simulating ' + move)
            // console.log(move)
            iterations = 0
            result[move] = this.simulateHelper(apiRequest, move)
            // console.log(result[move])
        }

        let min = Math.min(result.right, result.left, result.up, result.down)
        if (result['right'] == min) {
            final.push('right')
        } if (result['left'] == min) {
            final.push('left')
        } if (result['up'] == min) {
            final.push('up')
        } if (result['down'] == min) {
            final.push('down')
        }
        console.log(result)
        return final
    }
    
    // Moves probabilities forward a move.
    // TODO: make it so that it only adds probability score to outer layer of blocks.
    // simulateHelper is the only other recursive function now, step should be checked compared to simulateHelper's iterations. Therefore iterations should be made global.
    // Doesn't update probability of coordinate itself but the 'free' ones around it.
    updateProbsHelper = function (coord, lastCoord, apiRequest) {
        let moves = [{x: coord.x + 1, y: coord.y}, {x: coord.x - 1, y: coord.y}, {x: coord.x, y: coord.y + 1}, {x: coord.x, y: coord.y - 1}]
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].x == lastCoord.x && moves[i].y == lastCoord.y || moves[i].x >= apiRequest.board.width || moves[i].y >= apiRequest.board.height || moves[i].x < 0 || moves[i].y < 0) {
                let rem = i
                if (rem >= 0) {
                    moves.splice(rem, 1)
                    i--
                }
            }
        }

        for (let move of moves) {
            // console.log(move)
            apiRequest.board.possibilities[move.x][move.y] += apiRequest.board.possibilities[coord.x][coord.y] * 1/moves.length
            newStorage.push([move, coord])
        }
    }
    
    updateProbs = function (apiRequest) {
        this.currentProbs(apiRequest)
        if (iterations <= 1) {
            for (let other of apiRequest.board.snakes) {
                let i = 0
                //might need to add something about snakes being longer than 2
                if (other.body.length < 2 || other.body[0].x == apiRequest.you.body[0].x && other.body[0].y == apiRequest.you.body[0].y) {
                    continue
                } else {
                    this.updateProbsHelper(other.body[0], other.body[1], apiRequest)
                }
            }
        } else {
            for (let member of storage) {
                this.updateProbsHelper(member[0], member[1], apiRequest)
            }
        }
        // Dumps newStorage into storage and resets newStorage.
        storage = []
        for (let i = 0; i < newStorage.length; i++) {
            storage[i] = newStorage[i]
        }
        newStorage = []
        this.logProbabilities(apiRequest)
    }

    // Updates occupied tiles of board to have 100% probability.
    currentProbs = function (apiRequest) {
        for (let other of apiRequest.board.snakes) {
            for (let tile of other.body) {
                let x = tile.x
                let y = tile.y

                if (apiRequest.board.possibilities[x][y] != 1) {
                    apiRequest.board.possibilities[x][y]++
                }
            }
        }
    }
    
    // Returns list of moves that are least likely to collide.
    probabilityFlow = function (apiRequest) {
        let snake = apiRequest.you
        // this.currentProbs(apiRequest)
        // this.updateProbs(apiRequest)
            
        let right = 1
        let left = 1
        let up = 1
        let down = 1
        for (let option of this.snakeOptions(snake.body[0], apiRequest)) {
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

        if (min >= 1/3) {
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

    // moveAway ({x, y}) {
    //     let want = []
        
    //     if (request.you.body[0].x > x) {
    //         if (want.indexOf('right') < 0) {
    //             want.push('right')
    //         }
    //     } else if (request.you.body[0].x < x) {
    //         if (want.indexOf('left') < 0) {
    //             want.push('left')
    //         }
    //     }

    //     if (request.you.body[0].y < y) {
    //         if (want.indexOf('up') < 0) {
    //             want.push('up')
    //         }
    //     } else if (request.you.body[0].y > y){
    //         if (want.indexOf('down') < 0) {
    //             want.push('down')
    //         }
    //     }

    //     return want
    // }

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
