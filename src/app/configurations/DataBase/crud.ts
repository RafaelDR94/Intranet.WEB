import { db, Document } from './/bases';

function handleError(error: any, operation: string): never {
  console.error(`Error ${operation}:`, error);
  throw error;
}

export async function createDocument(doc: Document, customDb?: any): Promise<number | undefined> {
  try {
    const dbInstance = customDb || db;
    const id = await dbInstance.documents.add(doc);
    return id;
  } catch (err) {
    handleError(err, 'creando documento');
  }
}

export async function readAllDocuments(customDb?: any): Promise<Document[]> {
  try {
    const dbInstance = customDb || db;
    const docs = await dbInstance.documents.toArray();
    return docs ?? [];
  } catch (err) {
    handleError(err, 'leyendo todos los documentos');
  }
}

export async function readDocumentById(docId: number, customDb?: any): Promise<Document> {
  try {
    const dbInstance = customDb || db;
    const doc = await dbInstance.documents.get(docId);
    if (doc) {

      return doc;
    } else {
      throw new Error(`Documento con ID ${docId} no encontrado`);
    }
  } catch (err) {
    handleError(err, `leyendo documento con ID ${docId}`);
  }
}

export async function updateDocumentById(docId: number, updatedFields: Partial<Document>, customDb?: any): Promise<void> {
  try {
    const dbInstance = customDb || db;
    await dbInstance.documents.update(docId, updatedFields);
  } catch (err) {
    handleError(err, `actualizando documento con ID ${docId}`);
  }
}

export async function deleteDocument(docId: number, customDb?: any): Promise<void> {
  try {
    const dbInstance = customDb || db;

    await dbInstance.documents.delete(docId);

  } catch (err) {
    handleError(err, `eliminando documento con ID ${docId}`);
  }
}
