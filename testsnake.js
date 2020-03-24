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
            {"x": 1, "y": 0}, {'x': 0, 'y':0},
          ],
          "shout": "Hello my name is Sneky Snek"
        },
        {
          "id": "snake-id-string",
          "name": "Sneky Snek",
          "health": 90,
          "body": [
            {'x':4 , 'y': 1}, {'x':4,'y':0}
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
        {"x": 1, "y": 0}, {'x': 0, 'y':0}
      ],
      "shout": "Hello my name is Sneky Snek"
    }
  }

snake(request)