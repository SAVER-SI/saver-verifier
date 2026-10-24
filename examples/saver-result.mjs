// Shared result validation; no wallet SDK, network calls or credentials.
export function validateResult(r) {
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const exactKeys = (value, keys) => object(value) &&
    Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
  const invalid = () => { throw Error('Invalid SAVER result; do not authorize another payment.'); };
  if (!exactKeys(r, ['schemaVersion','requestId','status','confidence','explanation','domain','timestamp','confidenceType','evidence','sources']) ||
      r.schemaVersion !== '2.0' || r.confidenceType !== 'model_assessed' ||
      !['supported','contradicted','mixed','insufficient_evidence'].includes(r.status) ||
      !Number.isFinite(r.confidence) || r.confidence < 0 || r.confidence > 1 ||
      !text(r.requestId) || !text(r.domain) || !text(r.explanation) ||
      typeof r.timestamp !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(r.timestamp) ||
      !Number.isFinite(Date.parse(r.timestamp)) ||
      !Array.isArray(r.sources) || !Array.isArray(r.evidence) || r.evidence.length > 10) invalid();
  const sourceIds = new Set(), evidenceIds = new Set();
  for (const source of r.sources) {
    if (!exactKeys(source, ['id','title','url']) || !text(source.id) || sourceIds.has(source.id) ||
        typeof source.title !== 'string' || typeof source.url !== 'string') invalid();
    let url;
    try { url = new URL(source.url); } catch { invalid(); }
    if (!['https:','http:'].includes(url.protocol) || !url.hostname || url.username || url.password) invalid();
    sourceIds.add(source.id);
  }
  for (const item of r.evidence) {
    if (!exactKeys(item, ['id','text','relation','sourceIds']) || !text(item.id) || evidenceIds.has(item.id) ||
        !text(item.text) || !['supports','contradicts','context'].includes(item.relation) ||
        !Array.isArray(item.sourceIds) || !item.sourceIds.length ||
        new Set(item.sourceIds).size !== item.sourceIds.length ||
        item.sourceIds.some(id => !text(id) || !sourceIds.has(id))) invalid();
    evidenceIds.add(item.id);
  }
  const supports = r.evidence.some(item => item.relation === 'supports');
  const contradicts = r.evidence.some(item => item.relation === 'contradicts');
  if ((r.status === 'supported' && !supports) || (r.status === 'contradicted' && !contradicts) ||
      (r.status === 'mixed' && (!supports || !contradicts))) invalid();
  return r;
}
