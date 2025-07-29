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

export const db = new MyAppDatabase();
export const reportsdb = new  ReportsDatabase();
export const lastuserremebered= new  LastUserRemebered();