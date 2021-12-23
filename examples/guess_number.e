log('Mini game Guess number')

playing = true

target = random(9) + 1

guess = 0

while(_ => (playing && target !== guess), _ => (
    guess && guess < target && alert('Too smol!')
    guess && guess > target && alert('Too big!')
    guess = 🔢('Please enter your guess:')
    guess || (playing = false)
))

guess === target && alert('You win!')