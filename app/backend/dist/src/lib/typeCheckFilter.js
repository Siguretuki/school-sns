export const isPublished = (data) => data.publishedAt !== null;
export const isStatusString = (data) => data.status === 'DRAFT' || data.status === 'PUBLISHED';
