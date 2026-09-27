# Pitch copy

Kept for reuse in a pitch, a deck or a rewritten site section. This was the
"What's inside" section of the Y7to11.AI website and has been removed from the
page; it is preserved here rather than deleted because the writing is worth
keeping even where the numbers in it are not.

**Check the figures before using any of this.** Several were true when the copy
was written and are not true now, and a pitch is the worst place to be caught
with a stale number. Current figures are at the bottom.

---

## One subscription, everything they need.

Not a question bank and not a chatbot, but the whole way through a topic, from
being taught it to proving they know it.

**Every topic, properly taught**
212 topics across seven subjects, each with a written explanation and the key
ideas set out plainly, not a heading and a question.

**Lessons explained**
Each topic is talked through a step at a time in a natural British voice, 2,324
passages in all, so a tired fourteen-year-old can follow it without having to
read a page of text.

**Worked examples, with the steps shown**
651 of them, one for every learning outcome, showing how the answer is reached,
not just what it is.

**Practice and real exam questions**
Over 8,500 questions matched to your child's exam board and tier, with mark
schemes on the exam ones so they learn how marks are actually awarded.

**A tutor that explains, not answers**
They can ask "but why?" as many times as it takes, in their own words. It
refuses to simply hand over the answer, and refuses to be talked off topic.

**It brings back what they got wrong**
The exact question they missed returns days later, on a schedule, not a fresh
one on the same topic. It drops out once they get it right.

**A daily goal that fits your child**
Fifteen minutes' work, converted into a number of questions from how long their
own answers actually take. Streaks for turning up, and only answered questions
count.

**Progress you can actually check**
Topics covered, accuracy and where they are weakest, all from marked work, never
from what a child says about themselves.

**They set the pace, not a timetable**
Nothing runs to the clock. A lesson can be paused, gone back over and played
again as many times as it takes, at eleven at night if that is when it finally
clicks. Nobody is waiting, and going over it five times costs no more than once.

**It keeps getting better, at no extra cost**
Lessons live in one place rather than in a book or an app you have to update, so
an improvement simply arrives next time your child opens it. Every change is
re-checked against the specification automatically, and new topics are included.
There is no upgrade to buy.

**Every year, not only the exam years**
Most revision products begin when the GCSEs do. This covers all five, so a Year
8 can build the habit while a Year 11 works straight from the specification.

**Their board and their tier**
AQA or Edexcel, chosen per subject from Year 9, and Foundation or Higher from
Year 10 in Maths and Science, so the work matches the paper they will sit.

---

## Built for a child to use on their own, safely.

Removed from the website as the "The things you'd want to ask about" section.
Worth keeping: it is the only place the safeguarding behaviour, the refusal
rules and the no-surprise-bills promise were written down for a parent.

**If something worrying is said, an adult finds out**
Everything a child writes is screened before it goes anywhere. A message that
raises a safeguarding concern is answered by pointing them to a trusted adult,
recorded, and emailed to you. The alert names your child, never what they
wrote, which stays behind a sign-in.

**It won't just do the homework**
It refuses to hand over an answer, and refuses to be talked out of the subject
it's teaching, including by a child who's worked out how to ask nicely.

**Fifteen minutes, not two hours**
A daily goal sized from how long that child's own answers actually take,
between 4 and 25 questions. Only answered questions count. Opening the app
doesn't.

**It won't tell you they're doing fine when they aren't**
Progress is recorded from marked work, never self-reported. Before there's
enough evidence, it says so rather than inventing an encouraging score.

**No surprise bills, ever**
One monthly price. Usage is capped internally so heavy use can't cost you more,
and reading lessons is never limited, however long the evening goes on.

**You set it up, not them**
A parent or guardian registers, confirms their email address and enters the
child's year with consent. The year is locked afterwards, so nobody quietly
drops into easier work.

**And one thing we won't claim**
Y7to11.AI is new. We can't show you a grade-improvement statistic, because we
don't have one yet, and the ones you'll see elsewhere in this market are mostly
unaudited. We'd rather tell you that than invent it.

What we can show you is exactly what's inside: every topic, every subject,
every year, written against the published specification, and a cancel button
that works on the first month.

**One line in this is now out of date.** "A parent or guardian registers,
confirms their email address and enters the child's year" describes the old
flow. Sign-up no longer takes a password or an email confirmation step: the
account is created from the website, payment follows, and the password is set
from a one-time link emailed afterwards, which is what proves the address. The
year is still derived from the date of birth and still locked.

---

## What the numbers are now

Measured on 21 September 2026. Regenerate with `npm run content:coverage` and
`npm run validate:curriculum`.

| Claim in the copy | Then | Now |
| --- | --- | --- |
| Topics | 212 | **237** |
| Subjects | seven | seven, unchanged |
| Spoken passages | 2,324 | **17,928** stored, of which 2,676 are the lessons and the rest are the worked examples, which the copy did not claim at all |
| Worked examples | 651 | **1,294** stored, against a target of about 1,724 |
| Practice and exam questions | "over 8,500" | **7,179** stored, against a target of 9,380 |
| Learning outcomes | not claimed | 1,453 |

Two of those need care rather than a straight swap.

"Over 8,500 questions" is the one to fix first: 7,179 are stored, so the claim
is higher than the product currently holds. The rest generate on first request,
which is true but is not the same as having them.

"One for every learning outcome" is not true of the worked examples yet either:
1,294 of about 1,724, so roughly three quarters of outcomes have one.

And a claim the copy does not make, which matters more than any of the above:
of 10,065 stored rows, **2 have been reviewed by a teacher**. Everything about
how the content is produced is accurate; nothing here should imply it has been
checked by a person.
