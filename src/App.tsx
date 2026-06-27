import { useMemo, useState } from 'react'
import { questions } from './questions'
import { hashSeed, mulberry32, shuffle, randomSeed } from './random'
import './App.css'

const QUESTIONS_PER_SHEET = 16

function buildSheets(seed: string, count: number): string[][] {
  const rng = mulberry32(hashSeed(seed))
  return Array.from({ length: count }, () =>
    shuffle(questions, rng).slice(0, QUESTIONS_PER_SHEET),
  )
}

function App() {
  const [sheetCount, setSheetCount] = useState(40)
  const [seed, setSeed] = useState(() => randomSeed())

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
          <button type="button" onClick={() => setSeed(randomSeed())}>
            Neu mischen
          </button>
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
            <header className="sheet-header">
              <h1 className="sheet-title">Hochzeits-Autogrammjagd</h1>
              <p className="sheet-sub">Wildniscamp am Falkenstein</p>
            </header>
            <div className="sheet-divider">
              <span className="sheet-divider-mark">❧</span>
            </div>
            <div className="sheet-meta">Blatt {i + 1} / {sheets.length}</div>
            <ol className="grid">
              {sheet.map((q, j) => (
                <li key={j} className="item">
                  <span className="item-text">{q}</span>
                  <span className="signature" />
                </li>
              ))}
            </ol>
          </article>
        ))}
      </main>
    </>
  )
}

export default App
