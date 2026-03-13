'use client'

import { memo } from 'react'

interface ArticleContentProps {
  content: string | null
}

// Parse and render Tiptap JSON content
function ArticleContent({ content }: ArticleContentProps) {
  if (!content) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No content available.
      </div>
    )
  }

  // Try to parse as JSON (Tiptap format)
  let parsedContent
  try {
    parsedContent = JSON.parse(content)
  } catch {
    // If not JSON, treat as HTML
    return (
      <div
        className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-pre:bg-muted prose-pre:p-4 prose-img:rounded-lg prose-blockquote:border-l-primary"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Render JSON content recursively
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-pre:bg-muted prose-pre:p-4 prose-img:rounded-lg prose-blockquote:border-l-primary">
      {renderNode(parsedContent)}
    </div>
  )
}

function renderNode(node: any): React.ReactNode {
  if (!node) return null

  // Handle text nodes
  if (node.type === 'text') {
    let text = node.text || ''

    // Apply marks (bold, italic, etc.)
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        switch (mark.type) {
          case 'bold':
            text = `<strong>${text}</strong>`
            break
          case 'italic':
            text = `<em>${text}</em>`
            break
          case 'code':
            text = `<code>${text}</code>`
            break
          case 'strike':
            text = `<s>${text}</s>`
            break
          case 'link':
            text = `<a href="${mark.attrs?.href || '#'}" target="_blank" rel="noopener noreferrer">${text}</a>`
            break
        }
      })
    }

    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  // Handle block nodes
  const children = node.content ? node.content.map((child: any, i: number) => (
    <span key={i}>{renderNode(child)}</span>
  )) : null

  switch (node.type) {
    case 'doc':
    case 'paragraph':
      return <p>{children}</p>
    case 'heading':
      const HeadingTag = `h${node.attrs?.level || 1}` as keyof JSX.IntrinsicElements
      return <HeadingTag>{children}</HeadingTag>
    case 'bulletList':
      return <ul>{children}</ul>
    case 'orderedList':
      return <ol>{children}</ol>
    case 'listItem':
      return <li>{children}</li>
    case 'blockquote':
      return <blockquote>{children}</blockquote>
    case 'codeBlock':
      return (
        <pre>
          <code>{children}</code>
        </pre>
      )
    case 'hardBreak':
      return <br />
    case 'horizontalRule':
      return <hr />
    case 'image':
      return (
        <img
          src={node.attrs?.src}
          alt={node.attrs?.alt || ''}
          title={node.attrs?.title}
        />
      )
    default:
      return children
  }
}

export default memo(ArticleContent)