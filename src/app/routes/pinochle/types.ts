export enum Suits {
  Spades = '♠️',
  Hearts = '♥️',
  Clubs = '♣️',
  Diamonds = '♦️',
}

export enum Team {
  We = 1,
  They = 2,
}

export enum Ranks {
    Ace = 'A',
    Ten = '10',
    King = 'K',
    Queen = 'Q',
    Jack = 'J',
    Nine = '9',
}

// Utility to get display names for ranks
export const RankNames: Record<Ranks, string> = {
  [Ranks.Ace]: 'Ace',
  [Ranks.Ten]: 'Ten',
  [Ranks.King]: 'King',
  [Ranks.Queen]: 'Queen',
  [Ranks.Jack]: 'Jack',
  [Ranks.Nine]: 'Nine',
};

export interface Card {
  rank: Ranks;
  suit: Suits;
}

export interface Player {
  name: string;
  hand: Card[];
  score: number;
  potentialMeld: number;
  team?: Team;
  melds: MeldTypes[];
  desiredTrump?: Suits;
}

export enum MeldPoints {
  Pinochle = 40,
  DoublePinochle = 300,
  Marriage = 20,
  TrumpMarriage = 40,
  Book = 150, // Book plus trump marriage is 150
  DoubleBook = 1500,
  Aces = 100,
  DoubleAces = 1000,
  Kings = 80,
  DoubleKings = 800,
  Queens = 60,
  DoubleQueens = 600,
  Jacks = 40,
  DoubleJacks = 400,
  RoundRobin = 240,
  Dix = 10,
}

export enum MeldTypes {
  Pinochle = 'Pinochle',
  DoublePinochle = 'Double Pinochle',
  Marriage = 'Marriage',
  TrumpMarriage = 'Trump Marriage',
  Book = 'Book',
  DoubleBook = 'Double Book',
  Aces = 'Aces',
  DoubleAces = 'Double Aces',
  Kings = 'Kings',
  DoubleKings = 'Double Kings',
  Queens = 'Queens',
  DoubleQueens = 'Double Queens',
  Jacks = 'Jacks',
  DoubleJacks = 'Double Jacks',
  RoundRobin = 'Round Robin',
  Dix = 'Dix',
}