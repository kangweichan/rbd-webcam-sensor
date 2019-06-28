import { colors } from "@atlaskit/theme";

const jake = {
  id: "1",
  name: "Jake",
  url: "http://adventuretime.wikia.com/wiki/Jake",
  avatarUrl: "/static/media/jake-min.png",
  colors: {
    soft: colors.Y50,
    hard: colors.Y200
  }
};

const BMO = {
  id: "2",
  name: "BMO",
  url: "http://adventuretime.wikia.com/wiki/BMO",
  avatarUrl: "/static/media/bmo-min.png",
  colors: {
    soft: colors.G50,
    hard: colors.G200
  }
};

const finn = {
  id: "3",
  name: "Finn",
  url: "http://adventuretime.wikia.com/wiki/Finn",
  avatarUrl: "/static/finn-min.png",
  colors: {
    soft: colors.B50,
    hard: colors.B200
  }
};

const princess = {
  id: "4",
  name: "Princess bubblegum",
  url: "http://adventuretime.wikia.com/wiki/Princess_Bubblegum",
  avatarUrl: "/static/media/princess-min.png",
  colors: {
    soft: colors.P50,
    hard: colors.P200
  }
};

export const quotes = [
  {
    id: "4",
    content: "Is that where creativity comes from? From sad biz?",
    author: finn
  },
  {
    id: "5",
    content: "Homies help homies. Always",
    author: finn
  },
  {
    id: "6",
    content: "Responsibility demands sacrifice",
    author: princess
  },
  {
    id: "7",
    content: "That's it! The answer was so simple, I was too smart to see it!",
    author: princess
  },
  {
    id: "8",
    content: "People make mistakes. It’s a part of growing up",
    author: finn
  },
  {
    id: "9",
    content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
    author: finn
  },
  {
    id: "10",
    content: "I should not have drunk that much tea!",
    author: princess
  },
  {
    id: "11",
    content: "Please! I need the real you!",
    author: princess
  },
  {
    id: "12",
    content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    author: princess
  }
];

export const initialItems = () => {
  let quotesObject = {};
  quotes.forEach(quote => {
    quotesObject[quote.id] = quote;
  });

  return {
    quotes: quotesObject,
    columns: {
      "column-1": {
        id: "column-1",
        title: "Finn",
        quoteIds: ["4", "5", "8", "9"]
      },
      "column-2": {
        id: "column-2",
        title: "Princess bubblegum",
        quoteIds: ["6", "7", "10", "11", "12"]
      }
    },
    columnOrder: ["column-1", "column-2"]
  };
};
