import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api.js';
import { MENU as FALLBACK_MENU } from '@/data/hotel.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Group a flat list of API menu items into ordered sections:
//   [{ category, items: [{ name, price, desc, type }] }]
// Section order follows first appearance (the API already sorts by sort_order).
function groupBySection(items) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.section)) map.set(item.section, []);
    map.get(item.section).push({
      name: item.name,
      price: item.price,
      desc: item.description || undefined,
      type: item.type,
    });
  }
  return Array.from(map, ([category, list]) => ({ category, items: list }));
}

export default function MenuSection() {
  const [menu, setMenu] = useState(FALLBACK_MENU);
  // Which accordion sections are expanded (by category name). First one open by default.
  const [open, setOpen] = useState(() => (FALLBACK_MENU[0] ? [FALLBACK_MENU[0].category] : []));

  // Load the live menu; keep the static fallback if the API is unavailable/empty.
  useEffect(() => {
    let cancelled = false;
    api
      .getMenu()
      .then((res) => {
        const grouped = groupBySection(res.data || []);
        if (!cancelled && grouped.length) {
          setMenu(grouped);
          setOpen([grouped[0].category]);
        }
      })
      .catch(() => {
        /* keep the fallback menu */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="menu" className="lp-section lp-section--tint">
      <div className="lp-container">
        <div className="lp-section-head">
          <span className="lp-eyebrow">Our Menu</span>
          <h2 className="lp-heading">Freshly cooked, honestly priced</h2>
          <p>
            From sizzling starters to our signature Subhedar Special Thali — every dish is made to
            order.
          </p>
        </div>

        <Accordion
          type="multiple"
          value={open}
          onValueChange={setOpen}
          className="lp-menu-accordion"
        >
          {menu.map((cat) => (
            <AccordionItem
              key={cat.category}
              value={cat.category}
              className={`lp-acc-item${
                cat.category.toLowerCase().includes('veg dish') ? ' lp-acc-item--veg' : ''
              }`}
            >
              <AccordionTrigger className="lp-acc-header">
                <span className="lp-acc-title">{cat.category}</span>
                <span className="lp-acc-count">{cat.items.length}</span>
              </AccordionTrigger>
              <AccordionContent className="lp-acc-panel-inner">
                {cat.items.map((item, i) => (
                  <div key={i} className="lp-menu-item">
                    <div className="lp-menu-item-info">
                      <div className="lp-menu-item-name">
                        {item.type && (
                          <span
                            className={`lp-veg ${item.type === 'veg' ? 'lp-veg--veg' : 'lp-veg--nonveg'}`}
                            title={item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                            aria-label={item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                          >
                            <span className="lp-veg-dot" />
                          </span>
                        )}
                        {item.name}
                        {item.serves && (
                          <span className="lp-menu-item-serves">{item.serves}</span>
                        )}
                      </div>
                      {item.desc && <div className="lp-menu-item-desc">{item.desc}</div>}
                    </div>
                    <div className="lp-menu-item-price">{item.price}</div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
