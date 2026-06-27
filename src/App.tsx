import { useMemo, useState } from 'react'
import { questions } from './questions'
import { hashSeed, mulberry32, shuffle } from './random'
import Sprig from './Sprig'
import './App.css'

const QUESTIONS_PER_SHEET = 16

function buildSheets(seed: string, count: number): string[][] {
  const rng = mulberry32(hashSeed(seed))
  const sheets: string[][] = Array.from({ length: count }, () => [])

  // Phase 1: round-robin all questions to guarantee every one appears
  const order = shuffle(questions, rng)
  for (let i = 0; i < order.length; i++) {
    sheets[i % count].push(order[i])
  }

  // Phase 2: fill remaining slots, no duplicates within a sheet
  for (const sheet of sheets) {
    const used = new Set(sheet)
    for (const q of shuffle(questions, rng)) {
      if (sheet.length >= QUESTIONS_PER_SHEET) break
      if (!used.has(q)) {
        sheet.push(q)
        used.add(q)
      }
    }
  }

  // Shuffle each sheet so guaranteed questions aren't always first
  for (let i = 0; i < sheets.length; i++) {
    sheets[i] = shuffle(sheets[i], rng)
  }

  return sheets
}

function App() {
  const [sheetCount, setSheetCount] = useState(40)
  const [seed, setSeed] = useState('Hochzeit')

  const sheets = useMemo(() => buildSheets(seed, sheetCount), [seed, sheetCount])

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-inner">
          <span className="toolbar-title">Hochzeits-Autogrammjagd</span>
          <label className="field">
            <span>Blätter</span>
            <input
              type="number"
              min={1}
              max={500}
              value={sheetCount}
              onChange={(e) =>
                setSheetCount(
                  Math.max(1, Math.min(500, Number(e.target.value) || 1)),
                )
              }
            />
          </label>
          <label className="field">
            <span>Seed</span>
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="primary"
            onClick={() => window.print()}
          >
            Drucken
          </button>
        </div>
      </div>

      <main className="sheets">
        {sheets.map((sheet, i) => (
          <article key={i} className="sheet">
            <div className="sheet-frame">
              <header className="sheet-header">
                <Sprig className="sheet-sprig" />
                <p className="sheet-eyebrow">Hochzeit · Maike &amp; Kenny</p>
                <h1 className="sheet-title">Autogrammjagd</h1>
                <p className="sheet-name">
                  <span className="sheet-name-label">Name</span>
                  <span className="sheet-name-line" />
                </p>
              </header>

              <div className="sheet-body">
                <p className="sheet-instr">
                  Finde zu jeder Beschreibung eine passende Person auf der
                  Hochzeit und lass dir von ihr ein Autogramm geben. Jede Person
                  darf auf diesem Blatt nur einmal unterschreiben.
                </p>
                <ol className="grid">
                  {sheet.map((q, j) => (
                    <li key={j} className="item">
                      <span className="item-num">{j + 1}</span>
                      <div className="item-content">
                        <span className="item-text">{q}</span>
                        <span className="signature" />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <footer className="sheet-footer">
                <span className="footer-rule" />
                <span className="footer-mark">
                  Blatt {i + 1} <span className="footer-of">/</span>{' '}
                  {sheets.length}
                </span>
                <span className="footer-rule" />
              </footer>
            </div>
          </article>
        ))}
      </main>
    </>
  )
}

export default App
