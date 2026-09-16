import Dexie, { type Table } from "dexie";

export interface StoredReading {
  id?: number;
  uuid: string;
  createdAt: Date;
  spreadType: string;
  question: string;
  cards: Array<{
    id: string;
    name: string;
    position: string;
    isReversed: boolean;
  }>;
  reflectionNotes?: string;
  tags?: string[];
}

export class SanctuaryDatabase extends Dexie {
  readings!: Table<StoredReading>;

  constructor() {
    super("SanctuaryTarotDB");
    this.version(1).stores({
      readings: "++id, uuid, createdAt, spreadType",
    });
  }
}

export const db = new SanctuaryDatabase();
