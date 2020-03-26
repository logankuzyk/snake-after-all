const snake = require('./snake')

let request = {
    "game": {
      "id": "game-id-string"
    },
    "turn": 4,
    "board": {
      "height": 11,
      "width": 11,
      "food": [
        {'x': 3, 'y': 8}
      ],
      "snakes": [
        {
          "id": "snake-id-string",
          "name": "Sneky Snek",
          "health": 90,
          "body": [
            {"x": 9, "y": 9}, {'x': 10, 'y':9}, {"x": 10, "y": 10},{"x": 9, "y": 10},{"x": 8, "y": 10},{"x": 8, "y": 9},{"x": 8, "y": 8},{"x": 8, "y": 7},{"x": 8, "y": 7},{"x": 8, "y": 6},{"x": 8, "y": 5},

          ],
          "shout": "Hello my name is Sneky Snek"
        },
        {
          "id": "snake-id-string",
          "name": "Sneky Snek",
          "health": 90,
          "body": [
            {'x':4 , 'y': 5}, {'x':4,'y':5}
          ],
          "shout": "Hello my name is Sneky Snek"
        },
      ]
    },
    "you": {
      "id": "snake-id-string",
      "name": "Sneky Snek",
      "health": 90,
      "body": [
        // {"x": 10, "y": 1}, {"x": 10, "y": 2}, {"x": 9, "y": 2}
        {"x": 9, "y": 9}, {'x': 10, 'y':9}, {"x": 10, "y": 10},{"x": 9, "y": 10},{"x": 8, "y": 10},{"x": 8, "y": 9},{"x": 8, "y": 8},{"x": 8, "y": 7},{"x": 8, "y": 7},{"x": 8, "y": 6},{"x": 8, "y": 5},
      ],
      "shout": "Hello my name is Sneky Snek"
    }
  }

snake(request)