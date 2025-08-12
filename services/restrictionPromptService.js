/**
 * Service for handling placeholder replacement in prompts
 * Used by all LLM services to ensure consistent placeholder handling
 */
class RestrictionPromptService {
  /**
   * Process placeholders in a prompt by replacing them with actual data
   * @param {string} prompt - The original prompt that may contain placeholders
   * @param {Array} existingTags - Array of existing tags
   * @param {Array|string} existingCorrespondentList - List of existing correspondents
   * @param {Object} config - Configuration object (unused but kept for compatibility)
   * @returns {string} - Prompt with placeholders replaced
   */
  static processRestrictionsInPrompt(prompt, existingTags, existingCorrespondentList, config) {
    // Backward compatible: Document Types kommen aus config.documentTypes ODER 4. Argument
    const existingDocumentTypes =
      (config && config.documentTypes) ||
      (Array.isArray(arguments[3]) ? arguments[3] : undefined);
    return this._replacePlaceholders(
      prompt,
      existingTags,
      existingCorrespondentList,
      existingDocumentTypes
    );
  }

  /**
   * Replace placeholders in the prompt with actual data
   * @param {string} prompt - The original prompt
   * @param {Array} existingTags - Array of existing tags
   * @param {Array|string} existingCorrespondentList - List of existing correspondents
   * @param {Array} existingDocumentTypes - Array of existing document types
   * @returns {string} - Prompt with placeholders replaced
   */
  static _replacePlaceholders(prompt, existingTags, existingCorrespondentList, existingDocumentTypes) {
    let processedPrompt = prompt;

    // Replace %RESTRICTED_TAGS% placeholder
    if (processedPrompt.includes('%RESTRICTED_TAGS%')) {
      const tagsList = this._formatTagsList(existingTags);
      processedPrompt = processedPrompt.replace(/%RESTRICTED_TAGS%/g, tagsList);
    }

    // Replace %RESTRICTED_CORRESPONDENTS% placeholder
    if (processedPrompt.includes('%RESTRICTED_CORRESPONDENTS%')) {
      const correspondentsList = this._formatCorrespondentsList(existingCorrespondentList);
      processedPrompt = processedPrompt.replace(/%RESTRICTED_CORRESPONDENTS%/g, correspondentsList);
    }

    // Replace %RESTRICTED_DOCUMENT_TYPES% placeholder
    if (processedPrompt.includes('%RESTRICTED_DOCUMENT_TYPES%')) {
      const docTypesList = this._formatDocumentTypesList(existingDocumentTypes);
      processedPrompt = processedPrompt.replace(/%RESTRICTED_DOCUMENT_TYPES%/g, docTypesList);
    }

    return processedPrompt;
  }

  /**
   * Format tags list into a comma-separated string
   * @param {Array} existingTags - Array of existing tags
   * @returns {string} - Comma-separated list of tag names or empty string
   */
  static _formatTagsList(existingTags) {
    if (!Array.isArray(existingTags) || existingTags.length === 0) {
      return '';
    }

    return existingTags
      .filter(tag => tag && tag.name)
      .map(tag => tag.name)
      .join(', ');
  }

  /**
   * Format correspondents list into a comma-separated string
   * @param {Array|string} existingCorrespondentList - List of existing correspondents
   * @returns {string} - Comma-separated list of correspondent names or empty string
   */
  static _formatCorrespondentsList(existingCorrespondentList) {
    if (!existingCorrespondentList) {
      return '';
    }

    if (typeof existingCorrespondentList === 'string') {
      return existingCorrespondentList.trim();
    }

    if (Array.isArray(existingCorrespondentList)) {
      return existingCorrespondentList
        .filter(Boolean)
        .map(correspondent => {
          if (typeof correspondent === 'string') return correspondent;
          return correspondent?.name || '';
        })
        .filter(name => name.length > 0)
        .join(', ');
    }

    return '';
  }

  /**
   * Format document types list into a comma-separated string
   * @param {Array} existingDocumentTypes - Array of {id,name} or strings
   * @returns {string}
   */
  static _formatDocumentTypesList(existingDocumentTypes) {
    if (!existingDocumentTypes || !Array.isArray(existingDocumentTypes) || existingDocumentTypes.length === 0) {
      return '';
    }
    return existingDocumentTypes
      .map(dt => (typeof dt === 'string' ? dt : dt?.name))
      .filter(Boolean)
      .join(', ');
  }
}

module.exports = RestrictionPromptService;
