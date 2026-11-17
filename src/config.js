/* ============================================================================
   EVERYTHING PERSONAL LIVES HERE.
   Edit the text, captions and photo paths below. No other file needs to change.

   Photos: put image files in /public/photos and write the path, for example
     photo: "/photos/first-meeting.jpg"
   Leave "" to show a soft placeholder until you add the real photograph.

   All the wording below is example text. Replace it with your own story.
   ========================================================================== */

export const config = {
  herName: "Shreya",
  yourName: "Srikant",

  // Optional. Leave "" and the QR page uses the live address of the site.
  // Set it (for example "https://shreya-for-you.vercel.app") to force one.
  siteUrl: "",

  // Optional. "" plays a soft built-in melody. Or put an mp3 in /public/music
  // and write "/music/our-song.mp3".
  musicSrc: "",

  // PAGE 1
  welcome: {
    line1: "Hey Shreya... ❤️",
    line2: "Someone has something special for you.",
    cardText: "For Shreya",
    button: "Open Your Surprise"
  },

  // PAGE 2
  greeting: {
    eyebrow: "A little message for you",
    line: "This little corner of the internet was created just for you.",
    button: "Continue Our Story"
  },

  // PAGE 3  (icon: sparkles | message | heart | star)
  story: {
    title: "The Story Behind Us",
    hint: "Tap each card to open a memory",
    items: [
      {
        kicker: "Chapter One",
        title: "The Day We Met",
        date: "Add your date",
        icon: "sparkles",
        photo: "",
        text: "Some moments change everything without announcing themselves. That day, I had no idea I was meeting my favourite person in the world."
      },
      {
        kicker: "Chapter Two",
        title: "Our First Conversation",
        date: "Add your date",
        icon: "message",
        photo: "",
        text: "It began with a few simple words and somehow never really stopped. Hours felt like minutes, and I did not want it to end."
      },
      {
        kicker: "Chapter Three",
        title: "Our Favourite Memories",
        date: "Add your date",
        icon: "heart",
        photo: "",
        text: "The shared laughs, the silly jokes, the quiet evenings. Small things that stayed in my heart long after they were over."
      },
      {
        kicker: "Chapter Four",
        title: "Unforgettable Moments",
        date: "Add your date",
        icon: "star",
        photo: "",
        text: "Somewhere between all those ordinary days, I realised you were the one I wanted every single day with."
      }
    ],
    button: "Read My Letter"
  },

  // PAGE 4
  letter: {
    hint: "Break the seal",
    to: "My dearest Shreya,",
    paragraphs: [
      "From the moment you walked into my life, everything quietly began to make sense. I never knew a smile could feel like home until I met yours.",
      "You turn my ordinary days into stories I never want to end. With you, even silence feels like the sweetest conversation.",
      "You are my calm on the loudest days and my laughter on the hardest ones. I love the way you care, the way you laugh, and the way you make me want to be better.",
      "I do not need a perfect life. I only need you beside me in it."
    ],
    closing: "Forever yours,",
    signature: "Srikant",
    button: "See Our Memories"
  },

  // PAGE 5  (caption = shown on the polaroid, note = on the back,
  //          hidden = the secret message revealed by the button)
  memories: {
    title: "A World of Memories",
    revealLabel: "Reveal a hidden message",
    items: [
      { photo: "", caption: "Us, being us", date: "Add your date", note: "One of my favourite days.", hidden: "This is the day I realised I could happily be silly with you forever." },
      { photo: "", caption: "That smile", date: "Add your date", note: "The one I think about all the time.", hidden: "Your smile is the first thing I look for and the last thing I forget." },
      { photo: "", caption: "Our little adventure", date: "Add your date", note: "We got a bit lost. Best part.", hidden: "I would happily get lost anywhere, as long as it is with you." },
      { photo: "", caption: "A quiet moment", date: "Add your date", note: "No words needed.", hidden: "Peace, to me, looks a lot like sitting next to you." },
      { photo: "", caption: "Just because", date: "Add your date", note: "No reason. Every reason.", hidden: "I do not need a special day to feel lucky. Every day with you is one." }
    ],
    button: "There Is One More Thing"
  },

  // PAGE 6
  gift: {
    hint: "Tap the gift",
    message: "If I could choose one person to create beautiful memories with, I would choose you again and again.",
    button: "Go To The Garden"
  },

  // PAGE 7
  proposal: {
    name: "Shreya ❤️",
    paragraph:
      "Some people enter our lives and make everything more beautiful. You are one of those people. I don't know what the future holds, but I know I would love to create beautiful memories with you.",
    question: "SHREYA, WILL YOU BE MINE? ❤️",
    yes: "YES, FOREVER! ❤️",
    moment: "I NEED A MOMENT 🥺",
    momentMessage: "Take your time, Shreya. Your feelings matter. ❤️",
    momentBack: "Back to the question",
    yesTitle: "You just made this moment unforgettable! ❤️",
    yesSub: "Here's to all the beautiful memories waiting for us.",
    yesButton: "One Last Page"
  },

  // PAGE 8
  final: {
    message: "Thank you for being a beautiful part of my story, Shreya.",
    replay: "Replay the Experience"
  },

  // QR PAGE (open the site at  /#/qr  to see it)
  qr: {
    title: "Scan this little surprise for Shreya ❤️"
  }
};
