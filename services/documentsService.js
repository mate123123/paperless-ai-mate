// services/documentsService.js
const paperlessService = require('./paperlessService');

class DocumentsService {
  constructor() {
    this.tagCache = new Map();
    this.correspondentCache = new Map();
    this.documentTypeCache = new Map();
  }

  async getTagNames() {
    if (this.tagCache.size === 0) {
      const tags = await paperlessService.getTags();
      tags.forEach(tag => {
        this.tagCache.set(tag.id, tag.name);
      });
    }
    return Object.fromEntries(this.tagCache);
  }

  async getCorrespondentNames() {
    if (this.correspondentCache.size === 0) {
      const correspondents = await paperlessService.listCorrespondentsNames();
      correspondents.forEach(corr => {
        this.correspondentCache.set(corr.id, corr.name);
      });
    }
    return Object.fromEntries(this.correspondentCache);
  }
async getDocumentTypeNames() {
   if (this.documentTypeCache.size === 0) {
      const types = await paperlessService.listDocumentTypesNames();
      types.forEach(t => this.documentTypeCache.set(t.id, t.name));
    }
    return Object.fromEntries(this.documentTypeCache);
  }
  async getDocumentsWithMetadata() {
    const [documents, tagNames, correspondentNames] = await Promise.all([
      async getDocumentsWithMetadata() {
      const [documents, tagNames, correspondentNames, documentTypeNames] = await Promise.all([
      paperlessService.getDocuments(),
      this.getTagNames(),
      this.getCorrespondentNames()
         this.getCorrespondentNames(),
     this.getDocumentTypeNames()
    ]);

    // Sort documents by created date (newest first)
    documents.sort((a, b) => new Date(b.created) - new Date(a.created));

    return {
      documents,
      tagNames,
      correspondentNames,
      documentTypeNames,
      paperlessUrl: process.env.PAPERLESS_API_URL.replace('/api', '')
    };
  }
}

module.exports = new DocumentsService();
