import Dexie from 'dexie';

export interface Document {
  id?: number;
  [key: string]: any;
}

class MyAppDatabase extends Dexie {
  documents: Dexie.Table<Document, number>;

  constructor() {
    super('LoginDatabase');
    this.version(1).stores({
      documents: '++id'
    });
    this.documents = this.table('documents');
  }
}

class LastUserRemebered extends Dexie {
  documents: Dexie.Table<Document, number>;
  constructor() {
    super('LastUserRemebered');
    this.version(1).stores({
      documents: '++id'
    });
    this.documents = this.table('documents');
  }
}






class ReportsDatabase extends Dexie {
  documents: Dexie.Table<Document, number>;
  constructor() {
    super('ReportsDatabase');
    this.version(1).stores({
      documents: '++id'
    });
    this.documents = this.table('documents');
  }
}

const isClient = typeof window !== 'undefined' && !!(window as any).indexedDB;

export const db = isClient ? new MyAppDatabase() : (null as unknown as MyAppDatabase);
export const reportsdb = isClient ? new ReportsDatabase() : (null as unknown as ReportsDatabase);
export const lastuserremebered = isClient ? new LastUserRemebered() : (null as unknown as LastUserRemebered);
