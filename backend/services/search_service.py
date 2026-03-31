"""Search service – Plan C: keyword split + match."""


def search_keyword(question: str, documents: list[dict], equipment_type: str | None = None, top_k: int = 3) -> list[dict]:
    """Split question into keywords and score each document by keyword hit count."""
    # Filter by equipment_type first if provided
    if equipment_type:
        documents = [d for d in documents if d['equipment_type'] == equipment_type]

    if not documents:
        return []

    keywords = list(set(question.replace('？', '').replace('?', '').replace('，', ' ').replace('、', ' ').split()))
    keywords = [k for k in keywords if len(k) > 0]

    scored: list[tuple[dict, float, str]] = []
    for doc in documents:
        text = doc['title'] + ' ' + doc['content']
        hits = sum(1 for kw in keywords if kw in text)
        if hits == 0:
            continue
        score = round(hits / max(len(keywords), 1), 2)
        # Extract relevant snippet around the first matching keyword
        snippet = _extract_snippet(doc['content'], keywords)
        scored.append((doc, score, snippet))

    scored.sort(key=lambda x: x[1], reverse=True)
    results = []
    for doc, score, snippet in scored[:top_k]:
        results.append({
            'document_id': doc['id'],
            'title': doc['title'],
            'relevant_snippet': snippet,
            'relevance_score': score,
        })
    return results


def _extract_snippet(content: str, keywords: list[str], window: int = 80) -> str:
    """Extract a text snippet around the first keyword match."""
    for kw in keywords:
        idx = content.find(kw)
        if idx != -1:
            start = max(0, idx - window)
            end = min(len(content), idx + len(kw) + window)
            snippet = content[start:end]
            if start > 0:
                snippet = '...' + snippet
            if end < len(content):
                snippet = snippet + '...'
            return snippet
    return content[:160] + ('...' if len(content) > 160 else '')
