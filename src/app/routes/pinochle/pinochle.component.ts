import { Component } from '@angular/core';
import { Suits, Card, Ranks, Player, Team, MeldTypes, MeldPoints, RankNames } from './types';

// Counts the number of marriages (king and queen of the same suit); if of trump suit, counts as two
const marriageCount = (hand: Card[], bookSuit: Suits | null, trump: Suits | null): number[] => {
  let counts = [0, 0]; // [normal marriages, trump marriages]
  for (const suit of Object.values(Suits)) {
    const hasKing = hand.filter((card) => card.rank === Ranks.King && card.suit === suit);
    const hasQueen = hand.filter((card) => card.rank === Ranks.Queen && card.suit === suit);
    if (hasKing.length && hasQueen.length && suit !== bookSuit) {
      if (suit === trump) {
        counts[1] += hasKing.length; // only add kings to count marriages
      } else {
        counts[0] += hasKing.length;
      }
    }
  }
  return counts;
};

// Checks if two cards form a pinochle (Jack of Diamonds and Queen of Spades)
const hasPinochle = (hand: Card[]) => {
  const jacks = hand.filter((card) => card.rank === Ranks.Jack && card.suit === Suits.Diamonds);
  const queens = hand.filter((card) => card.rank === Ranks.Queen && card.suit === Suits.Spades);
  return jacks.length >= 1 && queens.length >= 1;
};

// Checks if the hand contains a double pinochle (two Jacks of Diamonds and two Queens of Spades)
const isDoublePinochle = (hand: Card[]) => {
  const jacks = hand.filter((card) => card.rank === Ranks.Jack && card.suit === Suits.Diamonds);
  const queens = hand.filter((card) => card.rank === Ranks.Queen && card.suit === Suits.Spades);
  return jacks.length === 2 && queens.length === 2;
};

// Checks if the hand contains a book (A, 10, K, Q, J in one suit)
const isBook = (hand: Card[]): Suits | null => {
  // For each suit, check if the hand contains all required ranks for that suit.
  let bookSuit: Suits[] = [];
  for (const suit of Object.values(Suits)) {
    const requiredRanks = [Ranks.Ace, Ranks.Ten, Ranks.King, Ranks.Queen, Ranks.Jack];
    // Check if every required rank is present in the current suit
    const hasAllRanks = requiredRanks.every((rank) => hand.some((card) => card.suit === suit && card.rank === rank));
    if (hasAllRanks) {
      // If all required ranks are found in this suit, the hand has a "book"
      bookSuit.push(suit);
    }
  }

  if (bookSuit.length === 0) {
    return null; // No book found
  }

  // otherwise, return the suit of the book with the most cards
  return bookSuit.reduce((prev, curr) => {
    const prevCount = hand.filter((card) => card.suit === prev).length;
    const currCount = hand.filter((card) => card.suit === curr).length;
    return prevCount > currCount ? prev : curr;
  });
};

// Checks if the hand contains a double book (two complete sets of books in two different suits)
const isDoubleBook = (hand: Card[]): Suits | null => {
  // For a double book, we need two of each Ace, Ten, King, Queen, and Jack in the same suit
  const requiredRanks = [Ranks.Ace, Ranks.Ten, Ranks.King, Ranks.Queen, Ranks.Jack];
  for (const suit of Object.values(Suits)) {
    const suitCards = hand.filter((card) => card.suit === suit);
    // Check if the suit has two of each required rank
    const hasTwoOfEach = requiredRanks.every((rank) => {
      return suitCards.filter((card) => card.rank === rank).length >= 2;
    });
    if (hasTwoOfEach) {
      return suit; // Found a double book in this suit
    }
  }
  return null; // No double book found
};

// Checks if the hand contains at least one Ace, King, Queen, or Jack of each suit
const isFourSuited = (hand: Card[], rank: Ranks) => {
  // Check if the hand contains at least one 'rank' of each suit
  const suits = [Suits.Hearts, Suits.Diamonds, Suits.Clubs, Suits.Spades];
  return suits.every((suit) => hand.some((card) => card.rank === rank && card.suit === suit));
};

// Checks if hand contains 8 cards of 'rank'
const isDoubleFourSuited = (hand: Card[], rank: Ranks) => {
  const cards = hand.filter((card) => card.rank === rank);
  return cards.length === 8;
};

// Check if the hand contains a round robin (four suits of Kings and Queens)
const isRoundRobin = (hand: Card[]) => {
  const suits = [Suits.Hearts, Suits.Diamonds, Suits.Clubs, Suits.Spades];
  return suits.every(
    (suit) =>
      hand.some((card) => card.rank === Ranks.King && card.suit === suit) &&
      hand.some((card) => card.rank === Ranks.Queen && card.suit === suit)
  );
};

// return the number of 9 in trump
const nineInTrump = (hand: Card[], trump: Suits | null): number => {
  return hand.filter((card) => card.rank === Ranks.Nine && card.suit === trump).length;
};

@Component({
  selector: 'app-pinochle',
  templateUrl: './pinochle.component.html',
  styleUrl: './pinochle.component.sass',
})
export class PinochleComponent {
  numberOfPlayers: number = 4;
  deck: Card[] = [];
  players: Player[] = [];
  trump: Suits | null = null; // Set this to the desired trump suit, if any
  dealer?: Player;
  under?: Player;
  bid: number = 0;

  constructor() {
    this.createDeck();
    this.startGame();
  }

  private startGame() {
    // this.initializePlayers();
    // this.startRound();
  }

  private initializePlayers() {
    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.players.push({
        name: `Player ${i}`,
        hand: [],
        score: 0,
        potentialMeld: 0,
        team: i % 2 === 0 ? Team.We : Team.They,
        melds: [],
      });
    }
  }

  private startRound() {
    this.dealCards();
    this.sortPlayerHands();
    this.calculatePotentialMelds();
    this.determinePlayerDesiredTrump();
  }

  private createDeck() {
    for (const suit of Object.values(Suits)) {
      for (const rank of Object.values(Ranks)) {
        //push two of each
        this.deck.push({ suit, rank }, { suit, rank });
      }
    }
  }

  private shuffleDeck() {
    this.deck = this.deck.sort(() => Math.random() - 0.5);
  }

  private dealCards() {
    this.shuffleDeck();
    // deal three cards to each player until the deck is empty
    while (this.deck.length > 0) {
      this.players.map((player) => {
        const cards = this.deck.splice(0, 3);
        player.hand.push(...cards);
      });
    }
  }

  private sortPlayerHands() {
    this.players.forEach((player) => {
      // sort by suit first, then by rank
      player.hand.sort((a, b) => {
        if (a.suit === b.suit) {
          return Object.values(Ranks).indexOf(a.rank) - Object.values(Ranks).indexOf(b.rank);
        }
        return Object.values(Suits).indexOf(a.suit) - Object.values(Suits).indexOf(b.suit);
      });
    });
  }

  /**
   * the player will choose the suit in this order:
   * 1. the suit of the book if they have one
   * 2. the suit closest to a book
   * 3. the suit with the most cards
   * 4. the suit with the most top cards (A, A, 10, 10, K) > (A, 10, 10, K, K) > (10, 10, K, K, Q), etc.
   * 5. the suit with the most marriages
   *  */
  determinePlayerDesiredTrump() {
    this.players.map((player) => {
      if (player.desiredTrump) {
        return player; // already set, has a book
      }
      let suitStats: { suit: Suits; delta: number; cards: Card[]; length: number }[] = [];
      // check for suit closest to a book
      for (const rank of Object.values(Ranks)) {
        if (rank === Ranks.Nine) continue; // skip Nines
        // separate cards by suit
        const { spades, hearts, clubs, diamonds } = player.hand.reduce<{
          spades: Card[];
          hearts: Card[];
          clubs: Card[];
          diamonds: Card[];
        }>(
          (acc, card) => {
            if (card.suit === Suits.Spades) acc.spades.push(card);
            else if (card.suit === Suits.Hearts) acc.hearts.push(card);
            else if (card.suit === Suits.Clubs) acc.clubs.push(card);
            else if (card.suit === Suits.Diamonds) acc.diamonds.push(card);
            return acc;
          },
          { spades: [], hearts: [], clubs: [], diamonds: [] }
        );

        // choose lowest delta, if ties push to closestBook
        suitStats = [
          { suit: Suits.Spades, delta: this.deltaBook(spades), cards: spades, length: spades.length },
          { suit: Suits.Hearts, delta: this.deltaBook(hearts), cards: hearts, length: hearts.length },
          { suit: Suits.Clubs, delta: this.deltaBook(clubs), cards: clubs, length: clubs.length },
          { suit: Suits.Diamonds, delta: this.deltaBook(diamonds), cards: diamonds, length: diamonds.length },
        ];
        suitStats.sort((a, b) => a.delta - b.delta || b.length - a.length); // sort by delta, then by length
      }
      console.log('suitStats', suitStats);
      player.desiredTrump = suitStats[0].suit; // set the desired trump to the suit with the lowest delta
      return player; // return the player with the desired trump set
    });
  }

  // expects all cards of the same suit
  private deltaBook(suitCards: Card[]): number {
    // calculate the delta to a book
    const requiredRanks = [Ranks.Ace, Ranks.Ten, Ranks.King, Ranks.Queen, Ranks.Jack];
    return requiredRanks.reduce((acc, rank) => {
      const count = suitCards.filter((card) => card.rank === rank).length;
      return acc + (count < 2 ? 2 - count : 0); // need at least two of each rank
    }, 0);
  }

  calculatePotentialMelds() {
    this.players.forEach((player) => {
      player.potentialMeld = 0;
      const bookSuit = isBook(player.hand);
      if (bookSuit) {
        if (isDoubleBook(player.hand)) {
          player.melds.push(MeldTypes.DoubleBook);
          player.potentialMeld += MeldPoints.DoubleBook;
        } else {
          // count the number of kings and queens in the book suit
          const kings = player.hand.filter((card) => card.rank === Ranks.King && card.suit === bookSuit).length;
          const queens = player.hand.filter((card) => card.rank === Ranks.Queen && card.suit === bookSuit).length;
          player.melds.push(MeldTypes.Book);
          player.potentialMeld += MeldPoints.Book;

          // add extra points for extra kings and queens in the book suit
          player.potentialMeld += (kings + queens - 2) * MeldPoints.Marriage;
        }
        player.desiredTrump = bookSuit; // Set the desired trump to the book suit
      }
      const isRoundRobinHand = isRoundRobin(player.hand);
      if (isRoundRobinHand) {
        player.melds.push(MeldTypes.RoundRobin);
        player.potentialMeld += MeldPoints.RoundRobin;
      }
      for (const rank of [Ranks.Ace, Ranks.King, Ranks.Queen, Ranks.Jack]) {
        if (isRoundRobinHand && rank === Ranks.King) continue; // skip Jacks for round robin
        if (isRoundRobinHand && rank === Ranks.Queen) continue; // skip Queens for round robin

        const rankName = RankNames[rank];
        if (isDoubleFourSuited(player.hand, rank)) {
          player.melds.push(MeldTypes[`Double${rankName}s` as keyof typeof MeldTypes]);
          player.potentialMeld += MeldPoints[`Double${rankName}s` as keyof typeof MeldPoints];
        } else if (isFourSuited(player.hand, rank)) {
          player.melds.push(MeldTypes[`${rankName}s` as keyof typeof MeldTypes]);
          player.potentialMeld += MeldPoints[`${rankName}s` as keyof typeof MeldPoints];
        }
      }
      if (hasPinochle(player.hand)) {
        if (isDoublePinochle(player.hand)) {
          player.melds.push(MeldTypes.DoublePinochle);
          player.potentialMeld += MeldPoints.DoublePinochle;
        } else {
          player.melds.push(MeldTypes.Pinochle);
          player.potentialMeld += MeldPoints.Pinochle;
        }
      }

      const trumpOrDesiredTrump = this.trump ? this.trump : player.desiredTrump || null;
      const dixCountz = nineInTrump(player.hand, trumpOrDesiredTrump);
      if (trumpOrDesiredTrump && dixCountz > 0) {
        player.melds.push(MeldTypes.Dix);
        player.potentialMeld += dixCountz * MeldPoints.Dix;
      }

      const marriages = marriageCount(
        player.hand,
        bookSuit,
        // if the player has a roundRobin and trump is not set, use anything
        this.trump ? this.trump : isRoundRobinHand ? Suits.Spades : null
      );

      if (marriages[0] > 0) {
        player.melds.push(MeldTypes.Marriage);
        player.potentialMeld += (isRoundRobinHand ? marriages[0] - 3 : marriages[0]) * MeldPoints.Marriage;
      }
      if (marriages[1] > 0) {
        player.melds.push(MeldTypes.TrumpMarriage);
        player.potentialMeld += (isRoundRobinHand ? marriages[1] - 1 : marriages[1]) * MeldPoints.TrumpMarriage;
      }
    });
  }

  playerHandDisplay(player: Player): string {
    if (!player || !player?.hand) {
      return '';
    }
    return player.hand.map((card) => `${card.rank}${card.suit}`).join(', ');
  }

  selectedCards: Card[] = [];
  selectCard(card: Card, event: MouseEvent) {
    const target = event.target as HTMLElement;

    // deselect if already selected
    if (target.classList.contains('selected')) {
      target.classList.remove('selected');
      this.selectedCards = this.selectedCards.filter((c) => c !== card);
      return;
    }

    // otherwise select the card
    if (this.selectedCards.length <= 3) {
      target.classList.add('selected');
      this.selectedCards.push(card);
    }
    // do something with the selected card
  }
}
