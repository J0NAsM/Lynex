"use client";

import { useState } from "react";

type Faq = readonly [question: string, answer: string];

export function FaqList({ items }: { items: readonly Faq[] }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="faq-list">
      {items.map(([question, answer], index) => {
        const isOpen = openFaq === index;
        const panelId = `faq-panel-${index}`;

        return (
          <div className={`faq-item ${isOpen ? "faq-open" : ""}`} key={question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span>{question}</span>
                <b aria-hidden="true">{isOpen ? "−" : "+"}</b>
              </button>
            </h3>
            <div id={panelId} hidden={!isOpen}>
              <p>{answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

