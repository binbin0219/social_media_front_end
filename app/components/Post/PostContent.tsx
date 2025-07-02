import React, { useState } from 'react';

function PostContent({ content }: { content: string }) {
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 200;

    const shouldTruncate = content.length > MAX_LENGTH;
    const displayedContent = expanded ? content : content.slice(0, MAX_LENGTH);

    return (
        <div>
            <p
                className="post-content"
                style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
            >
                {displayedContent}
                {!expanded && shouldTruncate && <span>...</span>}
            </p>

            {shouldTruncate && (
                <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-500 hover:underline mt-2"
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
}

export default PostContent;
