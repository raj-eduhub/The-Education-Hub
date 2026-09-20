// Narration for the authored visuals, kept apart from the drawings themselves.
//
// The synthesis script has to produce exactly the beats the player asks for, and
// it runs in plain Node where a .jsx file cannot be imported. Holding the words
// in a plain module means one definition serves both, rather than the script
// guessing at what the player will request and silently missing a beat.
export const visualNarration = {
  "y7-maths-number": [
    {
      id: "subtracting-a-negative",
      speech: "Put it on a number line. Subtracting moves you left, so starting at 3 and subtracting 5 "
        + "takes you to minus 2. Subtracting a negative reverses that direction, so 3 subtract negative 5 "
        + "moves five places to the right and lands on 8. It is a direction, not a trick.",
    },
    {
      id: "adding-negatives",
      speech: "Be careful with the rule about two minus signs. Adding a negative still moves you left. "
        + "Starting at minus 3 and adding negative 4 moves four places further left, to minus 7. Not 7.",
    },
  ],
  "y7-science-particles": [
    {
      id: "three-states",
      speech: "Here are the three arrangements. In a solid the particles touch and sit in a regular "
        + "pattern, vibrating on the spot. In a liquid they still touch but the pattern is gone, so they "
        + "slide past each other. In a gas they are far apart and moving quickly in all directions. The "
        + "mark scheme wants both things: how close they are, and how ordered.",
    },
    {
      id: "what-changes",
      speech: "One thing the exam checks: when a substance melts, the particles themselves do not change. "
        + "Melting ice does not change the water molecules. What changes is how much energy they have and "
        + "how they are arranged. That is why a change of state is physical, and why it can be reversed.",
    },
  ],
  "y8-maths-percentages": [
    {
      id: "up-then-down",
      speech: "A twenty per cent rise followed by a twenty per cent fall does not bring you back. "
        + "One hundred pounds rises to one hundred and twenty. Twenty per cent of one hundred and twenty "
        + "is twenty four, so you fall to ninety six. Multiplying by 1 point 2 and then by 0 point 8 is "
        + "multiplying by 0 point 9 6. The fall comes off a bigger number than the rise went on to.",
    },
    {
      id: "reversing",
      speech: "To reverse a percentage, undo the multiplier. If eighty pounds becomes ninety six after "
        + "adding twenty per cent, going back means dividing by 1 point 2, not subtracting twenty per cent. "
        + "Taking twenty per cent off ninety six gives seventy six pounds eighty, which is the wrong answer.",
    },
  ],
  "y9-maths-pythagoras": [
    {
      id: "three-four-five",
      speech: "Pythagoras is a statement about areas. Draw a square on each side of a 3, 4, 5 triangle. "
        + "The square on the side of 3 has nine cells, the square on the side of 4 has sixteen, and the "
        + "square on the longest side has twenty five. Nine plus sixteen equals twenty five. You can count them.",
    },
    {
      id: "add-or-subtract",
      speech: "Decide whether to add or subtract before you start. Find the right angle. The side facing "
        + "it is the longest, the hypotenuse. If that is the side you want, add the squares. If you want "
        + "one of the shorter sides, subtract. Your answer must come out smaller than the hypotenuse, "
        + "so check that it does.",
    },
  ],
  "y10-maths-number": [
    {
      id: "error-interval",
      speech: "Here is what that interval looks like. The measurement reads 4 point 6 centimetres, "
        + "but the true value lies anywhere in the shaded band. The filled circle at 4 point 5 5 "
        + "means the value can be exactly that. The hollow circle at 4 point 6 5 means it never is: "
        + "anything that far up would have rounded to 4 point 7 instead.",
    },
    {
      id: "standard-form",
      speech: "Standard form is just the decimal point moving. Start at 4700 and move the point left "
        + "one place at a time. Each hop makes the number ten times smaller, so the power of ten goes "
        + "up by one to keep the value the same. Stop when one non-zero digit is left in front of the "
        + "point: 4 point 7 times ten cubed.",
    },
  ],
};

export function visualNarrationFor(topicId) {
  return visualNarration[topicId] ?? [];
}
