import questionsMarkdown from '../questions.md?raw'

export function parseQuestions(markdown: string): string[] {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
}

export const questions = parseQuestions(questionsMarkdown)
