import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinochleComponent } from './pinochle.component';
import { Ranks, Player, Suits, MeldTypes, MeldPoints, RankNames } from './types';

describe('PinochleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PinochleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PinochleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  let component: PinochleComponent;
  let fixture: ComponentFixture<PinochleComponent>;

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('tests if melding is calculated correctly', () => {
    it('should calculate book and 9`s correctly', () => {
      const player = {
        hand: [
          { rank: Ranks.Ace, suit: Suits.Hearts },
          { rank: Ranks.Ten, suit: Suits.Hearts },
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },
          { rank: Ranks.Jack, suit: Suits.Hearts },
          { rank: Ranks.Nine, suit: Suits.Hearts },
          { rank: Ranks.Nine, suit: Suits.Hearts },

          // additional book should not count
          { rank: Ranks.Ace, suit: Suits.Spades },
          { rank: Ranks.Ten, suit: Suits.Spades },
          { rank: Ranks.King, suit: Suits.Spades },
          { rank: Ranks.Queen, suit: Suits.Spades },
          { rank: Ranks.Jack, suit: Suits.Spades },
        ],
        melds: [],
        potentialMeld: 0,
        name: 'Test Book Player',
        score: 0,
      } as Player;

      component.players = [player];
      component.calculatePotentialMelds();
      component.determinePlayerDesiredTrump();
      expect(player.desiredTrump).toEqual(Suits.Hearts);
      expect(player.melds).toContain(MeldTypes.Book);
      expect(player.melds).toContain(MeldTypes.Dix);
      expect(player.melds).toContain(MeldTypes.Marriage); // in second book
      expect(player.potentialMeld).toEqual(MeldPoints.Book + MeldPoints.Dix * 2 + MeldPoints.Marriage);
    });

    it('should calculate the strongest book', () => {
      const player = {
        hand: [
          { rank: Ranks.Ace, suit: Suits.Spades },
          { rank: Ranks.Ten, suit: Suits.Spades },
          { rank: Ranks.King, suit: Suits.Spades },
          { rank: Ranks.Queen, suit: Suits.Spades },
          { rank: Ranks.Jack, suit: Suits.Spades },
          { rank: Ranks.Jack, suit: Suits.Spades },

          // stronger meld book in spades
          { rank: Ranks.Ace, suit: Suits.Hearts },
          { rank: Ranks.Ten, suit: Suits.Hearts },
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },
          { rank: Ranks.Jack, suit: Suits.Hearts },
        ],
        melds: [],
        potentialMeld: 0,
        name: 'Test Strongest Book Player',
        score: 0,
      } as Player;

      component.players = [player];
      component.calculatePotentialMelds();
      component.determinePlayerDesiredTrump();
      expect(player.desiredTrump).toEqual(Suits.Hearts);
      expect(player.melds).toContain(MeldTypes.Book);
      expect(player.potentialMeld).toEqual(MeldPoints.Book + MeldPoints.Marriage * 2);
    });

    it('should calculate double book correctly', () => {
      const player = {
        hand: [
          { rank: Ranks.Ace, suit: Suits.Hearts },
          { rank: Ranks.Ace, suit: Suits.Hearts },
          { rank: Ranks.Ten, suit: Suits.Hearts },
          { rank: Ranks.Ten, suit: Suits.Hearts },
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },
          { rank: Ranks.Jack, suit: Suits.Hearts },
          { rank: Ranks.Jack, suit: Suits.Hearts },
        ],
        melds: [],
        potentialMeld: 0,
        name: 'Test Double Book Player',
        score: 0,
      } as Player;

      component.players = [player];
      component.calculatePotentialMelds();
      component.determinePlayerDesiredTrump();
      expect(player.desiredTrump).toEqual(Suits.Hearts);
      expect(player.melds).toContain(MeldTypes.DoubleBook);
      expect(player.potentialMeld).toEqual(MeldPoints.DoubleBook);
    });

    it('should calculate 4 suited melds correctly', () => {
      const ranksToTest = [Ranks.Ace, Ranks.Ten, Ranks.King, Ranks.Queen, Ranks.Jack, Ranks.Nine];

      const players = ranksToTest.map((rank) => ({
        hand: [Suits.Spades, Suits.Hearts, Suits.Diamonds, Suits.Clubs].map((suit) => ({ rank, suit })),
        melds: [],
        potentialMeld: 0,
        name: `Test ${RankNames[rank]} Player`,
        score: 0,
      })) as Player[];

      component.players = players;
      component.calculatePotentialMelds();
      expect(players[0].potentialMeld).toEqual(MeldPoints.Aces);
      expect(players[0].melds).toContain(MeldTypes.Aces);
      expect(players[1].potentialMeld).toEqual(0);
      expect(players[1].melds).toEqual([]);
      expect(players[2].potentialMeld).toEqual(MeldPoints.Kings);
      expect(players[2].melds).toContain(MeldTypes.Kings);
      expect(players[3].potentialMeld).toEqual(MeldPoints.Queens);
      expect(players[3].melds).toContain(MeldTypes.Queens);
      expect(players[4].potentialMeld).toEqual(MeldPoints.Jacks);
      expect(players[4].melds).toContain(MeldTypes.Jacks);
      expect(players[5].potentialMeld).toEqual(0);
      expect(players[5].melds).toEqual([]);
    });

    it('should calculate 8 suited melds correctly', () => {
      const ranksToTest = [Ranks.Ace, Ranks.Ten, Ranks.King, Ranks.Queen, Ranks.Jack, Ranks.Nine];

      const players = ranksToTest.map((rank) => ({
        hand: [
          { rank, suit: Suits.Spades },
          { rank, suit: Suits.Spades },
          { rank, suit: Suits.Hearts },
          { rank, suit: Suits.Hearts },
          { rank, suit: Suits.Diamonds },
          { rank, suit: Suits.Diamonds },
          { rank, suit: Suits.Clubs },
          { rank, suit: Suits.Clubs },
        ],
        melds: [],
        potentialMeld: 0,
        name: `Test double ${RankNames[rank]}s Player`,
        score: 0,
      })) as Player[];

      component.players = players;
      component.calculatePotentialMelds();
      expect(players[0].potentialMeld).toEqual(MeldPoints.DoubleAces);
      expect(players[0].melds).toContain(MeldTypes.DoubleAces);
      expect(players[1].potentialMeld).toEqual(0);
      expect(players[1].melds).toEqual([]);
      expect(players[2].potentialMeld).toEqual(MeldPoints.DoubleKings);
      expect(players[2].melds).toContain(MeldTypes.DoubleKings);
      expect(players[3].potentialMeld).toEqual(MeldPoints.DoubleQueens);
      expect(players[3].melds).toContain(MeldTypes.DoubleQueens);
      expect(players[4].potentialMeld).toEqual(MeldPoints.DoubleJacks);
      expect(players[4].melds).toContain(MeldTypes.DoubleJacks);
      expect(players[5].potentialMeld).toEqual(0);
      expect(players[5].melds).toEqual([]);
    });

    it('should calculate pinochle and double pinochle melds correctly', () => {
      const players = [
        {
          hand: [
            { rank: Ranks.Queen, suit: Suits.Spades },
            { rank: Ranks.Jack, suit: Suits.Diamonds },
          ],
          melds: [],
          potentialMeld: 0,
          name: 'Test Pinochle Player',
          score: 0,
        },
        {
          hand: [
            { rank: Ranks.Queen, suit: Suits.Spades },
            { rank: Ranks.Queen, suit: Suits.Spades },
            { rank: Ranks.Jack, suit: Suits.Diamonds },
            { rank: Ranks.Jack, suit: Suits.Diamonds },
          ],
          melds: [],
          potentialMeld: 0,
          name: 'Test Double Pinochle Player',
          score: 0,
        },
        {
          hand: [
            { rank: Ranks.Queen, suit: Suits.Hearts },
            { rank: Ranks.Queen, suit: Suits.Hearts },
            { rank: Ranks.Queen, suit: Suits.Clubs },
            { rank: Ranks.Queen, suit: Suits.Clubs },
            { rank: Ranks.Queen, suit: Suits.Diamonds },
            { rank: Ranks.Queen, suit: Suits.Diamonds },
            { rank: Ranks.Jack, suit: Suits.Spades },
            { rank: Ranks.Jack, suit: Suits.Spades },
            { rank: Ranks.Jack, suit: Suits.Hearts },
            { rank: Ranks.Jack, suit: Suits.Hearts },
            { rank: Ranks.Jack, suit: Suits.Clubs },
            { rank: Ranks.Jack, suit: Suits.Clubs },
          ],
          melds: [],
          potentialMeld: 0,
          name: 'Test No Pinochle Player',
          score: 0,
        },
      ] as Player[];

      component.players = players;
      component.calculatePotentialMelds();
      expect(players[0].potentialMeld).toEqual(MeldPoints.Pinochle);
      expect(players[0].melds).toContain(MeldTypes.Pinochle);
      expect(players[1].potentialMeld).toEqual(MeldPoints.DoublePinochle);
      expect(players[1].melds).toContain(MeldTypes.DoublePinochle);
      expect(players[2].potentialMeld).toEqual(0);
      expect(players[2].melds).toEqual([]);
    });

    it('should calculate round robin correctly', () => {
      const player = {
        hand: [
          { rank: Ranks.King, suit: Suits.Spades },
          { rank: Ranks.Queen, suit: Suits.Spades },
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },
          { rank: Ranks.King, suit: Suits.Clubs },
          { rank: Ranks.Queen, suit: Suits.Clubs },
          { rank: Ranks.King, suit: Suits.Diamonds },
          { rank: Ranks.Queen, suit: Suits.Diamonds },
        ],
        melds: [],
        potentialMeld: 0,
        name: 'Test Round Robin Player',
        score: 0,
      } as Player;

      component.players = [player];
      component.calculatePotentialMelds();
      expect(player.melds).toContain(MeldTypes.RoundRobin);
      expect(player.potentialMeld).toEqual(MeldPoints.RoundRobin);
    });

    it('should count marriages correctly (with and without trump)', () => {
      const player = {
        hand: [
          { rank: Ranks.King, suit: Suits.Spades },
          { rank: Ranks.Queen, suit: Suits.Spades },
          { rank: Ranks.King, suit: Suits.Spades },
          { rank: Ranks.Queen, suit: Suits.Spades },
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },
          { rank: Ranks.King, suit: Suits.Diamonds },
          { rank: Ranks.Queen, suit: Suits.Diamonds },
          { rank: Ranks.King, suit: Suits.Diamonds },
          { rank: Ranks.Queen, suit: Suits.Diamonds },

          // desired trump
          { rank: Ranks.Ten, suit: Suits.Spades },
        ],
        melds: [],
        potentialMeld: 0,
        name: 'Test Marriage Player',
        score: 0,
      } as Player;

      component.trump = Suits.Spades;
      component.players = [player];
      component.calculatePotentialMelds();
      component.determinePlayerDesiredTrump();
      expect(player.desiredTrump).toEqual(Suits.Spades);
      expect(player.melds).toContain(MeldTypes.TrumpMarriage);
      expect(player.melds).toContain(MeldTypes.Marriage);
      expect(player.potentialMeld).toEqual(MeldPoints.TrumpMarriage * 2 + MeldPoints.Marriage * 4);

      component.trump = null; // Reset trump
      component.calculatePotentialMelds();
      component.determinePlayerDesiredTrump();
      expect(player.desiredTrump).toEqual(Suits.Spades);
      expect(player.melds).toContain(MeldTypes.Marriage);
      expect(player.potentialMeld).toEqual(MeldPoints.Marriage * 6);
    });

    it('should calculate dix meld correctly', () => {
      const player = {
        hand: [
          { rank: Ranks.Nine, suit: Suits.Spades },
          { rank: Ranks.Nine, suit: Suits.Hearts },
          { rank: Ranks.Nine, suit: Suits.Clubs },
          { rank: Ranks.Nine, suit: Suits.Diamonds },
          { rank: Ranks.Nine, suit: Suits.Spades },
          { rank: Ranks.Nine, suit: Suits.Hearts },
          { rank: Ranks.Nine, suit: Suits.Clubs },
          { rank: Ranks.Nine, suit: Suits.Diamonds },
        ],
        melds: [],
        potentialMeld: 0,
        name: 'Test Dix Player',
        score: 0,
      } as Player;

      component.trump = Suits.Spades; // Set trump to any suit
      component.players = [player];
      component.calculatePotentialMelds();
      expect(player.melds).toContain(MeldTypes.Dix);
      expect(player.potentialMeld).toEqual(MeldPoints.Dix * 2);
    });

    it('should calculate mixed melds correctly', () => {
      const player = {
        hand: [
          // book - 150
          { rank: Ranks.Ace, suit: Suits.Spades },
          { rank: Ranks.Ten, suit: Suits.Spades },
          { rank: Ranks.King, suit: Suits.Spades },
          { rank: Ranks.Queen, suit: Suits.Spades },
          { rank: Ranks.Jack, suit: Suits.Spades },

          // second book marriage - 20
          { rank: Ranks.King, suit: Suits.Spades },

          // aces - 100
          { rank: Ranks.Ace, suit: Suits.Hearts },
          { rank: Ranks.Ace, suit: Suits.Clubs },
          { rank: Ranks.Ace, suit: Suits.Diamonds },

          // pinochle - 40
          { rank: Ranks.Jack, suit: Suits.Diamonds },

          // marriage - 20
          { rank: Ranks.King, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },

          // dix - 10
          { rank: Ranks.Nine, suit: Suits.Spades },

          // additional cards - 0
          { rank: Ranks.Nine, suit: Suits.Hearts },
          { rank: Ranks.Nine, suit: Suits.Clubs },
        ],
        melds: [],
        potentialMeld: 0,
        name: 'Test Mixed Meld Player',
        score: 0,
      } as Player;

      component.players = [player];
      component.calculatePotentialMelds();
      component.determinePlayerDesiredTrump();
      expect(player.desiredTrump).toEqual(Suits.Spades);
      expect(player.melds).toContain(MeldTypes.Book);
      expect(player.melds).toContain(MeldTypes.Aces);
      expect(player.melds).toContain(MeldTypes.Pinochle);
      expect(player.melds).toContain(MeldTypes.Marriage);
      expect(player.melds).toContain(MeldTypes.Dix);
      expect(player.potentialMeld).toEqual(
        MeldPoints.Book + MeldPoints.Aces + MeldPoints.Pinochle + MeldPoints.Marriage * 2 + MeldPoints.Dix
      );
    });

    it('should calculate no melds correctly', () => {
      const player = {
        hand: [
          { rank: Ranks.Ace, suit: Suits.Spades },
          { rank: Ranks.Ten, suit: Suits.Spades },
          { rank: Ranks.King, suit: Suits.Spades },
          { rank: Ranks.Nine, suit: Suits.Spades },
          { rank: Ranks.Ten, suit: Suits.Hearts },
          { rank: Ranks.Queen, suit: Suits.Hearts },
          { rank: Ranks.Ace, suit: Suits.Clubs },
          { rank: Ranks.Queen, suit: Suits.Clubs },
          { rank: Ranks.Queen, suit: Suits.Clubs },
          { rank: Ranks.Jack, suit: Suits.Clubs },
          { rank: Ranks.Nine, suit: Suits.Clubs },
          { rank: Ranks.Jack, suit: Suits.Diamonds },
        ],
        melds: [],
        potentialMeld: 0,
        name: 'Test No Melds Player',
        score: 0,
      } as Player;

      component.players = [player];
      component.calculatePotentialMelds();
      component.determinePlayerDesiredTrump();
      expect(player.desiredTrump).toEqual(Suits.Clubs);
      expect(player.melds).toEqual([]);
      expect(player.potentialMeld).toEqual(0);
    });
  });

  describe('tests edge cases', () => {
    it('should handle empty hands correctly', () => {
      const player = {
        hand: [],
        melds: [],
        potentialMeld: 0,
        name: 'Test Empty Hand Player',
        score: 0,
      } as Player;

      component.players = [player];
      component.calculatePotentialMelds();
      expect(player.melds).toEqual([]);
      expect(player.potentialMeld).toEqual(0);
    });

    it('should handle no players correctly', () => {
      component.players = [];
      component.calculatePotentialMelds();
      expect(component.players.length).toEqual(0);
    });
  });
});
