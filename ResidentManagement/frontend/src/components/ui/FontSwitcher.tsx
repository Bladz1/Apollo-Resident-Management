'use client';

import { useState, useEffect } from 'react';

const FONT_COMBOS = {
  'Inter + Be Vietnam Pro (Hành chính hiện đại)': 'font-combo-1',
  'Nunito Sans + Be Vietnam Pro (Thân thiện công dân)': 'font-combo-2',
  'Public Sans + Be Vietnam Pro (Cổng dân cư)': 'font-combo-3',
  'Quicksand + Be Vietnam Pro (Dịch vụ công)': 'font-combo-4',
  'Manrope + IBM Plex Sans (Quản trị - Tech)': 'font-combo-5',
} as const;

type FontComboKey = (typeof FONT_COMBOS)[keyof typeof FONT_COMBOS];

export default function FontSwitcher() {
  const [active, setActive] = useState<FontComboKey>('font-combo-1');

  useEffect(() => {
    const comboClasses = Object.values(FONT_COMBOS);
    document.body.classList.remove(...comboClasses);
    document.body.classList.add(active);
  }, [active]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[280px] rounded-2xl border border-gray-700 bg-gray-900/80 p-4 text-sm shadow-lg backdrop-blur-md">
      <p className="mb-2 text-gray-300 font-semibold text-xs tracking-wider uppercase">
        Font Combo Tester
      </p>
      <div className="flex flex-col gap-2">
        {Object.entries(FONT_COMBOS).map(([label, value]) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={`rounded-md px-3 py-2 text-left transition-colors duration-200 ${
              active === value
                ? 'bg-yellow-400 text-black font-semibold shadow'
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
