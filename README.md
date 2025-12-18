# Quick Name Speller Game

A fun, interactive game where players must quickly identify the highlighted square's name before time runs out!

## Features

### Game Modes
- **Solo Game**: Play alone and try to beat your high score
- **Player vs Player**: Compete against another player
- **Team vs Team**: Form teams and compete

### Difficulty Levels
- **Easy**: 2 seconds per square, 5 points
- **Medium**: 1.5 seconds per square, 10 points
- **Hard**: 1 second per square, 15 points

### Settings
- Language selection (Portuguese/English)
- Customizable points per difficulty
- Toggle score display
- Manual points entry mode

## How to Play

1. Select your game mode from the main menu
2. Enter player/team names
3. Choose difficulty and number of rounds (solo mode)
4. Wait for the countdown (3, 2, 1...)
5. Watch as squares get highlighted
6. Click the correct animal name before the highlight moves
7. Earn points for correct answers
8. View final scores at the end

## Game Mechanics

- The game displays a 3x2 grid of images (6 squares total)
- All images in a round show the same animal
- A golden highlight moves from left to right, top to bottom
- Players must click the correct name button while the square is highlighted
- The highlight speed depends on the selected difficulty
- Correct answers earn points, wrong answers give no points

## Files Structure

```
quick-name-speller/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── game.js            # Game logic
├── config.json        # Configuration
├── data/              # Image assets
│   └── pt/            # Portuguese images
│       └── to/        # 'to' sound endings
│           ├── gato.jpg
│           ├── pato.jpg
│           └── sapo.jpg
└── sounds/            # Audio files (to be added)
    ├── background.mp3
    ├── start.mp3
    ├── correct.mp3
    └── wrong.mp3
```

## Adding Sounds

To add audio effects, place the following MP3 files in the `sounds/` folder:
- `background.mp3` - Background music (plays during game)
- `start.mp3` - Countdown start sound
- `correct.mp3` - Correct answer sound
- `wrong.mp3` - Wrong answer sound

You can create or download free sound effects from websites like:
- [Freesound.org](https://freesound.org)
- [Zapsplat.com](https://zapsplat.com)
- [Mixkit.co](https://mixkit.co)

## Future Enhancements

- Additional image categories
- More languages
- Leaderboard system
- Sound effects customization
- Mobile app version
- Multiplayer online mode

## Browser Compatibility

Works best in modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Running the Game

Simply open `index.html` in your web browser. No server required!

For a better experience with audio, you may want to use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve
```

Then open http://localhost:8000 in your browser.

## License

Free to use and modify for personal and educational purposes.
