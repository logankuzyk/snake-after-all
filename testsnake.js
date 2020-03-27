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
            {"x": 10, "y": 0}, {'x': 9, 'y':0}, {"x": 8, "y": 0}, {'x': 7, 'y':0}, {'x': 6, 'y':0}, {'x': 5, 'y':0}, {'x': 4, 'y':0}, {'x': 3, 'y':0}, {'x': 3, 'y':1}, {'x': 3, 'y':2}, {'x': 3, 'y':3}, {'x': 3, 'y':4}, {'x': 2, 'y':4}, {'x': 1, 'y':4}, {'x': 0, 'y':4}, {'x': 0, 'y':5}, {'x': 0, 'y':6}, {'x': 0, 'y':7}, {'x': 0, 'y':8}

          ],
          "shout": "Hello my name is Sneky Snek"
        },
        // {
        //   "id": "snake-id-string",
        //   "name": "Sneky Snek",
        //   "health": 90,
        //   "body": [
        //     {'x':8 , 'y': 8}, {'x':7,'y':8}
        //   ],
        //   "shout": "Hello my name is Sneky Snek"
        // },
      ]
    },
    "you": {
      "id": "snake-id-string",
      "name": "Sneky Snek",
      "health": 90,
      "body": [
        // {"x": 10, "y": 1}, {"x": 10, "y": 2}, {"x": 9, "y": 2}
        {"x": 10, "y": 0}, {'x': 9, 'y':0}, {"x": 8, "y": 0}, {'x': 7, 'y':0}, {'x': 6, 'y':0}, {'x': 5, 'y':0}, {'x': 4, 'y':0}, {'x': 3, 'y':0}, {'x': 3, 'y':1}, {'x': 3, 'y':2}, {'x': 3, 'y':3}, {'x': 3, 'y':4}, {'x': 2, 'y':4}, {'x': 1, 'y':4}, {'x': 0, 'y':4}, {'x': 0, 'y':5}, {'x': 0, 'y':6}, {'x': 0, 'y':7}, {'x': 0, 'y':8}
      ],
      "shout": "Hello my name is Sneky Snek"
    }
  }

snake(request)