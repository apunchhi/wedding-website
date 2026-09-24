export const QUIZ_DATA = {
  title: "Are You Amar or Ananya?",
  intro:
    "Amar and Ananya are like Yin and Yang: different in all the right ways, and better together.\nTake our quiz to find out which half of this couple is your personality twin.",
  questions: [
    {
      id: "q1",
      prompt: "You suddenly have a completely free Saturday. What's the move?",
      answers: [
        {
          id: "q1-ananya",
          text: "Text a friend to coordinate a Workout x Lunch x Window-Shopping session. Once scheduled, the activity goes into your Google Calendar.",
          score: 1,
        },
        {
          id: "q1-shared",
          text: "Pursue your dream of becoming a DJ and spend the afternoon trying to mix Beto’s Horns by Fred again with literally anything.",
          score: 0,
        },
        {
          id: "q1-amar",
          text: "Look up a math proof that you’ve been meaning to read so you can appreciate the aesthetics of numbers. Peace at last.",
          score: -1,
        },
      ],
    },
    {
      id: "q2",
      prompt:
        "At an Italian restaurant with friends in the West Village, you’re most likely to be…",
      answers: [
        {
          id: "q2-ananya",
          text: "Telling a story that somehow has the whole table involved, with a dirty martini (extra olives) in hand.",
          score: 1,
        },
        {
          id: "q2-shared",
          text: "Trying to convince the person next to you that we should have skipped this restaurant because “Italian in the West Village is all smoke and mirrors.”",
          score: 0,
        },
        {
          id: "q2-amar",
          text: "Wondering aloud whether there’s an arbitrage opportunity between the price of a dirty martini and the number of olives you can request for free.",
          score: -1,
        },
      ],
    },
    {
      id: "q3",
      prompt: "You become interested in a new topic. What happens next?",
      answers: [
        {
          id: "q3-ananya",
          text: "You immediately need to experience it, talk about it, and pull in others with similarly interested individuals so you can learn from them.",
          score: 1,
        },
        {
          id: "q3-shared",
          text: "Thirty minutes later, you’re no longer discussing the topic. You’re discussing why humans like learning things in the first place.",
          score: 0,
        },
        {
          id: "q3-amar",
          text: "You emerge from a research hole with 14 tabs open and enough knowledge to start taking questions from anyone else who is curious.",
          score: -1,
        },
      ],
    },
    {
      id: "q4",
      prompt: "You’re about to go on vacation. What’s your approach?",
      answers: [
        {
          id: "q4-ananya",
          text: "You put everything you need on your bed in 20 minutes, but you have no idea how to fit all of this stuff into a carry-on.",
          score: 1,
        },
        {
          id: "q4-shared",
          text: "You lament about having to leave Mr. Cat behind three weeks in advance. You do most of the actual preparation two hours before you leave.",
          score: 0,
        },
        {
          id: "q4-amar",
          text: "You have no idea what to bring, but fitting those items into a suitcase? You started spatially optimizing for you and your travel buddies the moment you booked the flights for everyone.",
          score: -1,
        },
      ],
    },
    {
      id: "q5",
      prompt:
        "Your friends are about to get married and you’re sitting in the audience. What’s your reaction?",
      answers: [
        {
          id: "q5-ananya",
          text: "Tears of utter happiness. Your eyes are leaking before the officiant has had a chance to start the ceremony. You turn to the person next to you to say, “I just love them so much.”",
          score: 1,
        },
        {
          id: "q5-shared",
          text: "You’re thrilled to witness the ceremony, but equally thrilled about the dance floor situation that will follow.",
          score: 0,
        },
        {
          id: "q5-amar",
          text: "You quietly take in the special moment. You’ve had tissues in your pocket because you knew they’d come in handy when everyone else started crying.",
          score: -1,
        },
      ],
    },
  ],
  results: {
    ananya: {
      title: "Team Ananya",
      text: "Social, witty, and a little goofy, you know how to light up a room. You’re a natural connector and are happiest when you’re bringing your friends together. You have a real verve for life and an endless curiosity about people, ideas, or whatever you’ve thrown yourself into.",
    },
    blend: {
      title: "A Perfect Blend!",
      text: "Congrats! You’ve somehow managed to get the best of both of us: Ananya’s warmth and curiosity with Amar’s insight and thoughtfulness. You have the qualities we admire most in each other.",
    },
    amar: {
      title: "Team Amar",
      text: "Cool, calm, and always paying attention. You’re deeply knowledgeable, and always happy to share what you know. A thoughtful friend and natural teacher, you’re the person people trust for good advice and can always count on.",
    },
  },
};
