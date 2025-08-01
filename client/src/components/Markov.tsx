import ReactMarkdown from 'react-markdown'

export function RecipeRenderer({ recipeText }: { recipeText: string }) {
  return (
    <div className="prose prose-sm text-muted-foreground">
      <ReactMarkdown>{recipeText}</ReactMarkdown>
    </div>
  )
}
