'use client';

import React from 'react';

interface StaticSeatingMapProps {
  hoveredCategory: string | null;
  onHoverCategory: (category: string | null) => void;
  onSelectCategory: (category: string) => void;
  eventType?: 'WTA' | 'ATP';
  soldOutCategories?: string[];
}

// Gray color for sold out sections (same as inactive stadium areas)
const SOLD_OUT_COLOR = '#86868b';

// Маппинг секций к категориям для WTA (Women's Day) - 3 категории
const WTA_SECTION_TO_CATEGORY: Record<string, string> = {
  's_33': 'prime-a',
  's_34': 'prime-a',
  's_35': 'prime-a',
  's_36': 'prime-a',
  's_37': 'prime-a',
  's_38': 'prime-a',
  's_39': 'prime-b',
  's_40': 'prime-b',
  's_41': 'prime-b',
  's_42': 'prime-b',
  's_77': 'grandstand',
  's_78': 'grandstand',
};

// Маппинг секций к категориям для ATP (Men's Day) - 4 категории
const ATP_SECTION_TO_CATEGORY: Record<string, string> = {
  // Prime A
  's_33': 'prime-a',
  's_34': 'prime-a',
  's_35': 'prime-a',
  's_36': 'prime-a',
  's_37': 'prime-a',
  's_38': 'prime-a',
  // Prime B
  's_39': 'prime-b',
  's_40': 'prime-b',
  's_41': 'prime-b',
  's_42': 'prime-b',
  // Grandstand Lower
  's_43': 'grandstand-lower',
  's_44': 'grandstand-lower',
  's_45': 'grandstand-lower',
  's_46': 'grandstand-lower',
  's_47': 'grandstand-lower',
  's_48': 'grandstand-lower',
  's_49': 'grandstand-lower',
  's_50': 'grandstand-lower',
  's_51': 'grandstand-lower',
  's_52': 'grandstand-lower',
  // Grandstand Upper
  's_53': 'grandstand-upper',
  's_54': 'grandstand-upper',
};

// Единый синий цвет для всех секторов (как в оригинале Ticketmaster)
const SECTION_COLOR = '#4A69BD';

// Цвета для карточек категорий (экспортируем для EventSelection)
const CATEGORY_COLORS: Record<string, string> = {
  'prime-a': '#4A69BD',
  'prime-b': '#4A69BD',
  'grandstand': '#4A69BD',
  'grandstand-lower': '#4A69BD',
  'grandstand-upper': '#4A69BD',
};

// URL фоновых изображений (локальные копии для надежной загрузки на мобильных)
const WTA_BACKGROUND_URL = '/images/wta-seating-bg.png';
const ATP_BACKGROUND_URL = '/images/atp-seating-bg.png';

const StaticSeatingMap: React.FC<StaticSeatingMapProps> = ({
  hoveredCategory,
  onHoverCategory,
  onSelectCategory,
  eventType = 'WTA',
  soldOutCategories = [],
}) => {
  const sectionToCategory = eventType === 'ATP' ? ATP_SECTION_TO_CATEGORY : WTA_SECTION_TO_CATEGORY;
  const backgroundUrl = eventType === 'ATP' ? ATP_BACKGROUND_URL : WTA_BACKGROUND_URL;

  // Helper to check if a category is sold out
  const isCategorySoldOut = (category: string): boolean => {
    return soldOutCategories.includes(category);
  };

  const handleMouseEnter = (sectionId: string) => {
    const category = sectionToCategory[sectionId];
    // Don't hover sold out sections
    if (category && !isCategorySoldOut(category)) {
      onHoverCategory(category);
    }
  };

  const handleMouseLeave = () => {
    onHoverCategory(null);
  };

  // Touch handler для мобильных устройств - подсветка при касании
  const handleTouchStart = (sectionId: string) => {
    const category = sectionToCategory[sectionId];
    // Don't hover sold out sections
    if (category && !isCategorySoldOut(category)) {
      onHoverCategory(category);
    }
  };

  const handleClick = (sectionId: string) => {
    const category = sectionToCategory[sectionId];
    // Don't allow clicking sold out sections
    if (category && !isCategorySoldOut(category)) {
      onSelectCategory(category);
    }
  };

  const getSectionStyle = (sectionId: string): React.CSSProperties => {
    const category = sectionToCategory[sectionId];
    const isSoldOut = category ? isCategorySoldOut(category) : false;
    const isHovered = hoveredCategory === category && !isSoldOut;
    const isOtherHovered = hoveredCategory !== null && hoveredCategory !== category && !isSoldOut;

    return {
      fill: isSoldOut ? SOLD_OUT_COLOR : SECTION_COLOR,
      cursor: isSoldOut ? 'not-allowed' : 'pointer',
      transition: 'filter 0.2s ease, opacity 0.2s ease',
      filter: isHovered ? 'brightness(1.12) saturate(1.1)' : 'none',
      opacity: isSoldOut ? 0.5 : (isOtherHovered ? 0.5 : 1),
    };
  };

  // Рендер WTA схемы (Women's Day)
  if (eventType === 'WTA') {
    return (
      <div className="w-full">
        <svg
          data-component="svg"
          viewBox="0 0 10240 7680"
          aria-hidden="true"
          className="w-full h-auto"
          style={{
            maxHeight: '520px',
            backgroundImage: `url("${backgroundUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <g className="seats"></g>
          <g className="polygons">
            <path
              data-component="svg__section"
              data-section-id="s_38"
              data-section-name="PRIME A EAST 2"
              d="M3191.21,5082.99C3506.79,5154.67,3816.31,5224.97,4125.83,5295.27C4433.56,5325.23,4741.29,5355.2,5049.02,5385.16C5049.02,5313.99,5049.02,5242.82,5049.02,5171.65C4752.33,5142.76,4455.65,5113.88,4158.96,5084.99C3858.78,5016.81,3558.59,4948.63,3251.36,4878.85L3251.36,4878.85C3231.31,4946.9,3211.26,5014.95,3191.21,5082.99Z"
              style={getSectionStyle('s_38')}
              onMouseEnter={() => handleMouseEnter('s_38')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_38')}
              onClick={() => handleClick('s_38')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_37"
              data-section-name="PRIME A EAST 1"
              d="M5329.13,5387.67C5645.44,5356.87,5961.75,5326.07,6278.05,5295.27C6590.82,5224.23,6903.59,5153.2,7222.61,5080.74C7202.56,5012.69,7182.5,4944.64,7162.45,4876.59C6851.75,4947.16,6548.33,5016.07,6244.91,5084.99C5939.65,5114.71,5634.39,5144.43,5329.13,5174.16L5329.13,5174.16C5329.13,5245.33,5329.13,5316.5,5329.13,5387.67Z"
              style={getSectionStyle('s_37')}
              onMouseEnter={() => handleMouseEnter('s_37')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_37')}
              onClick={() => handleClick('s_37')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_39"
              data-section-name="PRIME B NORTH 1"
              d="M7412.23,2912.16C7663.68,2912.16,7915.13,2912.16,8166.58,2912.16C8166.58,2782.24,8166.58,2652.33,8166.58,2522.41C7944.64,2230.66,7722.7,1938.91,7502.48,1649.41C7409.18,1966.02,7315.89,2282.64,7222.6,2599.25C7244.59,2604.23,7266.58,2609.2,7288.58,2614.18C7329.8,2668.36,7371.02,2722.55,7412.23,2776.73L7412.23,2776.73C7412.23,2821.88,7412.23,2867.02,7412.23,2912.16Z"
              style={getSectionStyle('s_39')}
              onMouseEnter={() => handleMouseEnter('s_39')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_39')}
              onClick={() => handleClick('s_39')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_34"
              data-section-name="PRIME A WEST 2"
              d="M5201.91,2500.15C5201.91,2429.3,5201.91,2358.45,5201.91,2287.6C5228.26,2287.6,5254.6,2287.6,5280.95,2287.6C5613.32,2319.97,5945.69,2352.33,6278.05,2384.69C6590.82,2455.73,6903.59,2526.77,7222.61,2599.23C7202.56,2667.28,7182.5,2735.34,7162.45,2803.39C6851.75,2732.82,6548.33,2663.91,6244.91,2594.99C5920.23,2563.38,5595.55,2531.77,5270.88,2500.15L5270.88,2500.15C5247.89,2500.15,5224.9,2500.15,5201.91,2500.15Z"
              style={getSectionStyle('s_34')}
              onMouseEnter={() => handleMouseEnter('s_34')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_34')}
              onClick={() => handleClick('s_34')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_78"
              data-section-name="GRANDSTAND EAST"
              d="M4150.99,5297.73C4142.6,5296.91,4134.21,5296.1,4125.82,5295.28C3816.31,5224.98,3506.8,5154.68,3191.23,5083.01C3095.28,5408.62,2999.34,5734.24,2903.39,6059.86C3037.32,6090.28,3187.5,6124.4,3321.64,6154.87C3260.87,6406.31,3200.11,6657.75,3139.35,6909.19C3371.43,6961.9,3605.39,7015.04,3839.36,7068.18C4238.2,7107.01,4637.04,7145.85,5035.88,7184.68C5146.59,7184.68,5257.3,7184.68,5368.0,7184.68C5766.85,7145.85,6165.69,7107.01,6564.53,7068.18C6798.48,7015.04,7032.43,6961.9,7264.5,6909.2C7203.74,6657.76,7142.97,6406.32,7082.21,6154.88C7206.29,6126.7,7351.72,6093.66,7475.79,6065.48C7484.69,6053.8,7493.58,6042.13,7502.47,6030.45C7409.19,5713.88,7315.91,5397.31,7222.63,5080.74C6903.6,5153.2,6590.83,5224.24,6278.05,5295.28C6258.1,5297.22,6238.15,5299.16,6218.21,5301.1C5999.28,5322.41,5780.35,5343.72,5561.42,5365.03C5483.93,5372.57,5406.45,5380.1,5328.96,5387.64C5328.96,5501.69,5328.96,5615.74,5328.96,5729.78C5302.77,5729.78,5075.05,5729.78,5048.86,5729.78C5048.86,5614.89,5048.86,5500.0,5048.86,5385.1C4971.45,5377.56,4894.04,5370.05,4816.63,5362.51L4816.63,5362.51C4594.75,5340.92,4372.87,5319.32,4150.99,5297.73Z"
              style={getSectionStyle('s_78')}
              onMouseEnter={() => handleMouseEnter('s_78')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_78')}
              onClick={() => handleClick('s_78')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_33"
              data-section-name="PRIME A WEST 1"
              d="M3251.37,2801.13C3231.31,2733.08,3211.26,2665.02,3191.21,2596.97C3506.79,2525.29,3816.31,2454.99,4125.83,2384.69C4458.2,2352.33,4790.57,2319.97,5122.93,2287.6C5149.26,2287.6,5175.58,2287.6,5201.91,2287.6C5201.91,2358.45,5201.91,2429.3,5201.91,2500.15C5178.94,2500.15,5155.97,2500.15,5133.0,2500.15C4808.32,2531.77,4483.64,2563.38,4158.96,2594.99L4158.96,2594.99C3858.78,2663.17,3558.6,2731.35,3251.37,2801.13Z"
              style={getSectionStyle('s_33')}
              onMouseEnter={() => handleMouseEnter('s_33')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_33')}
              onClick={() => handleClick('s_33')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_77"
              data-section-name="GRANDSTAND WEST"
              d="M7082.21,1525.12C7142.97,1273.68,7203.74,1022.24,7264.5,770.805C7032.43,718.097,6798.48,664.96,6564.53,611.824C6165.69,572.989,5766.85,534.154,5368.0,495.319C5257.3,495.319,5146.59,495.319,5035.88,495.319C4637.04,534.154,4238.2,572.989,3839.36,611.824C3605.39,664.963,3371.43,718.102,3139.35,770.814C3200.11,1022.25,3260.87,1273.69,3321.64,1525.13C3201.23,1552.48,3023.61,1592.77,2903.38,1620.08C2999.33,1945.71,3095.28,2271.34,3191.23,2596.97C3506.8,2525.3,3816.31,2455.0,4125.83,2384.7C4134.21,2383.89,5020.83,2297.53,5122.92,2287.59C5175.59,2287.59,5228.26,2287.59,5280.94,2287.59C5374.44,2296.7,6258.1,2382.76,6278.05,2384.7C6590.82,2455.74,6903.6,2526.78,7222.63,2599.24C7315.92,2282.63,7409.21,1966.02,7502.5,1649.41C7493.63,1637.77,7484.77,1626.13,7475.91,1614.48L7475.91,1614.48C7351.55,1586.24,7206.57,1553.37,7082.21,1525.12Z"
              style={getSectionStyle('s_77')}
              onMouseEnter={() => handleMouseEnter('s_77')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_77')}
              onClick={() => handleClick('s_77')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_36"
              data-section-name="PRIME A NORTH 2"
              d="M7222.65,5080.89C7244.57,5075.93,7266.49,5070.98,7288.41,5066.03C7329.69,5011.77,7370.96,4957.51,7412.24,4903.25C7412.24,4548.83,7412.24,4194.42,7412.24,3840.0C7342.06,3840.0,7271.89,3840.0,7201.72,3840.0C7201.72,4182.57,7201.72,4525.15,7201.72,4867.72C7188.63,4870.67,7175.54,4873.62,7162.45,4876.56L7162.45,4876.56C7182.51,4944.67,7202.58,5012.78,7222.65,5080.89Z"
              style={getSectionStyle('s_36')}
              onMouseEnter={() => handleMouseEnter('s_36')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_36')}
              onClick={() => handleClick('s_36')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_35"
              data-section-name="PRIME A NORTH 1"
              d="M7162.43,2803.44C7182.49,2735.38,7202.55,2667.31,7222.6,2599.24C7244.6,2604.22,7266.59,2609.2,7288.58,2614.17C7329.8,2668.36,7371.02,2722.54,7412.24,2776.73C7412.24,3131.15,7412.24,3485.57,7412.24,3839.99C7342.06,3839.99,7271.89,3839.99,7201.72,3839.99C7201.72,3497.46,7201.72,3154.92,7201.72,2812.38L7201.72,2812.38C7188.62,2809.4,7175.53,2806.42,7162.43,2803.44Z"
              style={getSectionStyle('s_35')}
              onMouseEnter={() => handleMouseEnter('s_35')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_35')}
              onClick={() => handleClick('s_35')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_41"
              data-section-name="PRIME B NORTH 3"
              d="M8166.55,3839.98C8166.55,4149.25,8166.55,4458.53,8166.55,4767.8C7915.11,4767.8,7663.68,4767.8,7412.24,4767.8C7412.24,4458.53,7412.24,4149.25,7412.24,3839.98L7412.24,3839.98C7663.68,3839.98,7915.11,3839.98,8166.55,3839.98Z"
              style={getSectionStyle('s_41')}
              onMouseEnter={() => handleMouseEnter('s_41')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_41')}
              onClick={() => handleClick('s_41')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_40"
              data-section-name="PRIME B NORTH 2"
              d="M8166.55,2912.18C8166.55,3221.45,8166.55,3530.71,8166.55,3839.98C7915.11,3839.98,7663.68,3839.98,7412.24,3839.98C7412.24,3530.71,7412.24,3221.45,7412.24,2912.18L7412.24,2912.18C7663.68,2912.18,7915.11,2912.18,8166.55,2912.18Z"
              style={getSectionStyle('s_40')}
              onMouseEnter={() => handleMouseEnter('s_40')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_40')}
              onClick={() => handleClick('s_40')}
            />
            <path
              data-component="svg__section"
              data-section-id="s_42"
              data-section-name="PRIME B NORTH 4"
              d="M7222.66,5080.89C7315.93,5397.44,7409.2,5713.98,7502.47,6030.52C7722.69,5741.03,7944.64,5449.27,8166.58,5157.52C8166.58,5027.61,8166.58,4897.71,8166.58,4767.8C7915.13,4767.8,7663.68,4767.8,7412.23,4767.8C7412.23,4812.95,7412.23,4858.1,7412.23,4903.26C7370.96,4957.52,7329.68,5011.78,7288.4,5066.04L7288.4,5066.04C7266.49,5070.99,7244.57,5075.94,7222.66,5080.89Z"
              style={getSectionStyle('s_42')}
              onMouseEnter={() => handleMouseEnter('s_42')}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart('s_42')}
              onClick={() => handleClick('s_42')}
            />
          </g>
          <g className="labels" style={{ pointerEvents: 'none' }}>
            <text data-component="svg__label" data-label-id="s_38" transform="rotate(9,4179,5100)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="4179" y="5100">PRIME A EAST 2</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_37" transform="rotate(-7,6281,5086)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="6281" y="5086">PRIME A EAST 1</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_39" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="7694" y="2380">PRIME B</tspan>
              <tspan dy="2em" x="7694" y="2380">NORTH 1</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_34" transform="rotate(8,6228,2424)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="6228" y="2424">PRIME A WEST 2</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_78" fontSize="197" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="5202" y="6145">GRANDSTAND</tspan>
              <tspan dy="2em" x="5202" y="6145">EAST</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_33" transform="rotate(-9,4165,2420)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="4165" y="2420">PRIME A WEST 1</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_77" fontSize="197" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="5202" y="1162">GRANDSTAND</tspan>
              <tspan dy="2em" x="5202" y="1162">WEST</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_36" transform="rotate(90,7375,4398)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="7375" y="4398">PRIME A NORTH 2</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_35" transform="rotate(90,7375,3260)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="7375" y="3260">PRIME A NORTH 1</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_41" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="7789" y="4170">PRIME B</tspan>
              <tspan dy="2em" x="7789" y="4170">NORTH 3</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_40" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="7789" y="3243">PRIME B</tspan>
              <tspan dy="2em" x="7789" y="3243">NORTH 2</tspan>
            </text>
            <text data-component="svg__label" data-label-id="s_42" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
              <tspan dy="1em" x="7709" y="4999">PRIME B</tspan>
              <tspan dy="2em" x="7709" y="4999">NORTH 4</tspan>
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Рендер ATP схемы (Men's Day) - 4 категории
  return (
    <div className="w-full">
      <svg
        data-component="svg"
        viewBox="0 0 10240 7680"
        aria-hidden="true"
        className="w-full h-auto"
        style={{
          maxHeight: '520px',
          backgroundImage: `url("${backgroundUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <g className="seats"></g>
        <g className="polygons">
          {/* Prime A секции */}
          <path
            data-component="svg__section"
            data-section-id="s_38"
            data-section-name="PRIME A EAST 2"
            d="M3191.21,5082.99C3506.79,5154.67,3816.31,5224.97,4125.83,5295.27C4433.56,5325.23,4741.29,5355.2,5049.02,5385.16C5049.02,5313.99,5049.02,5242.82,5049.02,5171.65C4752.33,5142.76,4455.65,5113.88,4158.96,5084.99C3858.78,5016.81,3558.59,4948.63,3251.36,4878.85L3251.36,4878.85C3231.31,4946.9,3211.26,5014.95,3191.21,5082.99Z"
            style={getSectionStyle('s_38')}
            onMouseEnter={() => handleMouseEnter('s_38')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_38')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_37"
            data-section-name="PRIME A EAST 1"
            d="M5329.13,5387.67C5645.44,5356.87,5961.75,5326.07,6278.05,5295.27C6590.82,5224.23,6903.59,5153.2,7222.61,5080.74C7202.56,5012.69,7182.5,4944.64,7162.45,4876.59C6851.75,4947.16,6548.33,5016.07,6244.91,5084.99C5939.65,5114.71,5634.39,5144.43,5329.13,5174.16L5329.13,5174.16C5329.13,5245.33,5329.13,5316.5,5329.13,5387.67Z"
            style={getSectionStyle('s_37')}
            onMouseEnter={() => handleMouseEnter('s_37')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_37')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_34"
            data-section-name="PRIME A WEST 2"
            d="M5201.91,2500.15C5201.91,2429.3,5201.91,2358.45,5201.91,2287.6C5228.26,2287.6,5254.6,2287.6,5280.95,2287.6C5613.32,2319.97,5945.69,2352.33,6278.05,2384.69C6590.82,2455.73,6903.59,2526.77,7222.61,2599.23C7202.56,2667.28,7182.5,2735.34,7162.45,2803.39C6851.75,2732.82,6548.33,2663.91,6244.91,2594.99C5920.23,2563.38,5595.55,2531.77,5270.88,2500.15L5270.88,2500.15C5247.89,2500.15,5224.9,2500.15,5201.91,2500.15Z"
            style={getSectionStyle('s_34')}
            onMouseEnter={() => handleMouseEnter('s_34')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_34')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_33"
            data-section-name="PRIME A WEST 1"
            d="M3251.37,2801.13C3231.31,2733.08,3211.26,2665.02,3191.21,2596.97C3506.79,2525.29,3816.31,2454.99,4125.83,2384.69C4458.2,2352.33,4790.57,2319.97,5122.93,2287.6C5149.26,2287.6,5175.58,2287.6,5201.91,2287.6C5201.91,2358.45,5201.91,2429.3,5201.91,2500.15C5178.94,2500.15,5155.97,2500.15,5133.0,2500.15C4808.32,2531.77,4483.64,2563.38,4158.96,2594.99L4158.96,2594.99C3858.78,2663.17,3558.6,2731.35,3251.37,2801.13Z"
            style={getSectionStyle('s_33')}
            onMouseEnter={() => handleMouseEnter('s_33')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_33')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_36"
            data-section-name="PRIME A NORTH 2"
            d="M7222.65,5080.89C7244.57,5075.93,7266.49,5070.98,7288.41,5066.03C7329.69,5011.77,7370.96,4957.51,7412.24,4903.25C7412.24,4548.83,7412.24,4194.42,7412.24,3840.0C7342.06,3840.0,7271.89,3840.0,7201.72,3840.0C7201.72,4182.57,7201.72,4525.15,7201.72,4867.72C7188.63,4870.67,7175.54,4873.62,7162.45,4876.56L7162.45,4876.56C7182.51,4944.67,7202.58,5012.78,7222.65,5080.89Z"
            style={getSectionStyle('s_36')}
            onMouseEnter={() => handleMouseEnter('s_36')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_36')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_35"
            data-section-name="PRIME A NORTH 1"
            d="M7162.43,2803.44C7182.49,2735.38,7202.55,2667.31,7222.6,2599.24C7244.6,2604.22,7266.59,2609.2,7288.58,2614.17C7329.8,2668.36,7371.02,2722.54,7412.24,2776.73C7412.24,3131.15,7412.24,3485.57,7412.24,3839.99C7342.06,3839.99,7271.89,3839.99,7201.72,3839.99C7201.72,3497.46,7201.72,3154.92,7201.72,2812.38L7201.72,2812.38C7188.62,2809.4,7175.53,2806.42,7162.43,2803.44Z"
            style={getSectionStyle('s_35')}
            onMouseEnter={() => handleMouseEnter('s_35')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_35')}
          />

          {/* Prime B секции */}
          <path
            data-component="svg__section"
            data-section-id="s_39"
            data-section-name="PRIME B NORTH 1"
            d="M7412.23,2912.16C7663.68,2912.16,7915.13,2912.16,8166.58,2912.16C8166.58,2782.24,8166.58,2652.33,8166.58,2522.41C7944.64,2230.66,7722.7,1938.91,7502.48,1649.41C7409.18,1966.02,7315.89,2282.64,7222.6,2599.25C7244.59,2604.23,7266.58,2609.2,7288.58,2614.18C7329.8,2668.36,7371.02,2722.55,7412.23,2776.73L7412.23,2776.73C7412.23,2821.88,7412.23,2867.02,7412.23,2912.16Z"
            style={getSectionStyle('s_39')}
            onMouseEnter={() => handleMouseEnter('s_39')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_39')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_40"
            data-section-name="PRIME B NORTH 2"
            d="M8166.55,2912.18C8166.55,3221.45,8166.55,3530.71,8166.55,3839.98C7915.11,3839.98,7663.68,3839.98,7412.24,3839.98C7412.24,3530.71,7412.24,3221.45,7412.24,2912.18L7412.24,2912.18C7663.68,2912.18,7915.11,2912.18,8166.55,2912.18Z"
            style={getSectionStyle('s_40')}
            onMouseEnter={() => handleMouseEnter('s_40')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_40')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_41"
            data-section-name="PRIME B NORTH 3"
            d="M8166.55,3839.98C8166.55,4149.25,8166.55,4458.53,8166.55,4767.8C7915.11,4767.8,7663.68,4767.8,7412.24,4767.8C7412.24,4458.53,7412.24,4149.25,7412.24,3839.98L7412.24,3839.98C7663.68,3839.98,7915.11,3839.98,8166.55,3839.98Z"
            style={getSectionStyle('s_41')}
            onMouseEnter={() => handleMouseEnter('s_41')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_41')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_42"
            data-section-name="PRIME B NORTH 4"
            d="M7222.66,5080.89C7315.93,5397.44,7409.2,5713.98,7502.47,6030.52C7722.69,5741.03,7944.64,5449.27,8166.58,5157.52C8166.58,5027.61,8166.58,4897.71,8166.58,4767.8C7915.13,4767.8,7663.68,4767.8,7412.23,4767.8C7412.23,4812.95,7412.23,4858.1,7412.23,4903.26C7370.96,4957.52,7329.68,5011.78,7288.4,5066.04L7288.4,5066.04C7266.49,5070.99,7244.57,5075.94,7222.66,5080.89Z"
            style={getSectionStyle('s_42')}
            onMouseEnter={() => handleMouseEnter('s_42')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('s_42')}
          />

          {/* Grandstand Lower секции */}
          <path
            data-component="svg__section"
            data-section-id="s_43"
            data-section-name="GRANDSTAND WEST LOWER 1"
            d="M2903.38,1620.08C3256.11,1539.96,3609.76,1459.64,3963.4,1379.32C3970.75,1378.61,3978.09,1377.89,3985.43,1377.18C4040.61,1712.2,4095.8,2047.23,4150.98,2382.25C4142.6,2383.07,4134.21,2383.89,4125.83,2384.7C3816.31,2455.0,3506.8,2525.3,3191.23,2596.97L3191.23,2596.97C3095.28,2271.34,2999.33,1945.71,2903.38,1620.08Z"
            style={getSectionStyle('s_43')}
            onMouseEnter={() => handleMouseEnter('s_43')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_43')}
            onClick={() => handleClick('s_43')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_44"
            data-section-name="GRANDSTAND WEST LOWER 2"
            d="M4767.94,1300.99C4507.11,1326.39,4246.28,1351.79,3985.46,1377.18C4040.64,1712.21,4095.82,2047.23,4151.01,2382.25C4372.88,2360.65,4594.75,2339.04,4816.62,2317.44L4816.62,2317.44C4800.39,1978.62,4784.17,1639.81,4767.94,1300.99Z"
            style={getSectionStyle('s_44')}
            onMouseEnter={() => handleMouseEnter('s_44')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_44')}
            onClick={() => handleClick('s_44')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_45"
            data-section-name="GRANDSTAND WEST LOWER 3"
            d="M4816.65,2317.41C4800.43,1978.6,4784.2,1639.79,4767.97,1300.98C4869.83,1291.07,4971.69,1281.15,5073.54,1271.23C5159.13,1271.23,5244.71,1271.23,5330.29,1271.23C5423.57,1280.31,5516.85,1289.39,5610.12,1298.48C5593.9,1637.29,5577.67,1976.1,5561.44,2314.91C5467.94,2305.8,5374.44,2296.7,5280.94,2287.59C5228.26,2287.59,5175.59,2287.59,5122.92,2287.59L5122.92,2287.59C5020.83,2297.53,4918.74,2307.47,4816.65,2317.41Z"
            style={getSectionStyle('s_45')}
            onMouseEnter={() => handleMouseEnter('s_45')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_45')}
            onClick={() => handleClick('s_45')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_46"
            data-section-name="GRANDSTAND WEST LOWER 4"
            d="M6383.78,1373.81C6125.9,1348.7,5868.01,1323.59,5610.12,1298.48C5593.9,1637.29,5577.67,1976.1,5561.44,2314.91C5780.37,2336.22,5999.3,2357.54,6218.24,2378.86L6218.24,2378.86C6273.42,2043.84,6328.6,1708.82,6383.78,1373.81Z"
            style={getSectionStyle('s_46')}
            onMouseEnter={() => handleMouseEnter('s_46')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_46')}
            onClick={() => handleClick('s_46')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_47"
            data-section-name="GRANDSTAND WEST LOWER 5"
            d="M6383.76,1373.79C6402.68,1375.64,6421.61,1377.48,6440.53,1379.32C6785.66,1457.71,7130.78,1536.1,7475.91,1614.48C7484.77,1626.13,7493.63,1637.77,7502.5,1649.41C7409.21,1966.02,7315.92,2282.63,7222.63,2599.24C6903.6,2526.78,6590.82,2455.74,6278.05,2384.7C6258.1,2382.76,6238.15,2380.82,6218.21,2378.87L6218.21,2378.87C6273.39,2043.85,6328.57,1708.82,6383.76,1373.79Z"
            style={getSectionStyle('s_47')}
            onMouseEnter={() => handleMouseEnter('s_47')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_47')}
            onClick={() => handleClick('s_47')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_48"
            data-section-name="GRANDSTAND EAST LOWER 1"
            d="M6383.75,6306.14C6402.68,6304.3,6421.6,6302.46,6440.53,6300.61C6785.62,6222.24,7130.71,6143.86,7475.79,6065.48C7484.69,6053.8,7493.58,6042.13,7502.47,6030.45C7409.19,5713.88,7315.91,5397.31,7222.63,5080.74C6903.6,5153.2,6590.83,5224.24,6278.05,5295.28C6258.1,5297.22,6238.16,5299.17,6218.21,5301.11L6218.21,5301.11C6273.39,5636.12,6328.57,5971.13,6383.75,6306.14Z"
            style={getSectionStyle('s_48')}
            onMouseEnter={() => handleMouseEnter('s_48')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_48')}
            onClick={() => handleClick('s_48')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_49"
            data-section-name="GRANDSTAND EAST LOWER 2"
            d="M6218.21,5301.1C5999.28,5322.42,5780.35,5343.73,5561.42,5365.05C5577.65,5703.86,5593.88,6042.68,5610.1,6381.49C5867.99,6356.38,6125.87,6331.27,6383.76,6306.16L6383.76,6306.16C6328.57,5971.14,6273.39,5636.12,6218.21,5301.1Z"
            style={getSectionStyle('s_49')}
            onMouseEnter={() => handleMouseEnter('s_49')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_49')}
            onClick={() => handleClick('s_49')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_50"
            data-section-name="GRANDSTAND EAST LOWER 3"
            d="M5048.86,5385.1C5048.86,5524.4,5048.86,5673.51,5048.86,5729.78C5075.05,5729.78,5302.77,5729.78,5328.96,5729.78C5328.96,5673.85,5328.96,5526.21,5328.96,5387.64C5406.45,5380.1,5483.94,5372.55,5561.43,5365.01C5577.66,5703.82,5593.88,6042.63,5610.11,6381.45C5516.85,6390.53,5423.59,6399.61,5330.32,6408.69C5244.74,6408.69,5159.16,6408.69,5073.58,6408.69C4971.7,6398.77,4869.83,6388.85,4767.95,6378.93C4784.18,6040.12,4800.41,5701.3,4816.64,5362.49L4816.64,5362.49C4894.05,5370.03,4971.45,5377.56,5048.86,5385.1Z"
            style={getSectionStyle('s_50')}
            onMouseEnter={() => handleMouseEnter('s_50')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_50')}
            onClick={() => handleClick('s_50')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_51"
            data-section-name="GRANDSTAND EAST LOWER 4"
            d="M4816.62,5362.53C4594.75,5340.93,4372.87,5319.33,4150.99,5297.72C4095.81,5632.74,4040.63,5967.76,3985.45,6302.79C4246.28,6328.18,4507.11,6353.58,4767.94,6378.98L4767.94,6378.98C4784.17,6040.16,4800.4,5701.35,4816.62,5362.53Z"
            style={getSectionStyle('s_51')}
            onMouseEnter={() => handleMouseEnter('s_51')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_51')}
            onClick={() => handleClick('s_51')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_52"
            data-section-name="GRANDSTAND EAST LOWER 5"
            d="M2903.39,6059.86C3256.12,6139.97,3609.76,6220.29,3963.41,6300.61C3970.75,6301.33,3978.09,6302.04,3985.44,6302.76C4040.62,5967.75,4095.8,5632.74,4150.98,5297.73C4142.59,5296.91,4134.21,5296.1,4125.83,5295.28C3816.31,5224.98,3506.8,5154.68,3191.23,5083.01L3191.23,5083.01C3095.28,5408.62,2999.34,5734.24,2903.39,6059.86Z"
            style={getSectionStyle('s_52')}
            onMouseEnter={() => handleMouseEnter('s_52')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_52')}
            onClick={() => handleClick('s_52')}
          />

          {/* Grandstand Upper секции */}
          <path
            data-component="svg__section"
            data-section-id="s_54"
            data-section-name="GRANDSTAND WEST UPPER"
            d="M5073.57,1271.27C4703.51,1307.31,4333.45,1343.34,3963.38,1379.37C3749.4,1427.97,3535.42,1476.58,3321.64,1525.13C3260.87,1273.69,3200.11,1022.25,3139.35,770.814C3371.43,718.102,3605.39,664.963,3839.36,611.824C4238.2,572.989,4637.04,534.154,5035.88,495.319C5146.59,495.319,5257.3,495.319,5368.0,495.319C5766.85,534.154,6165.69,572.989,6564.53,611.824C6798.48,664.96,7032.43,718.096,7264.5,770.805C7203.74,1022.24,7142.97,1273.68,7082.21,1525.12C6868.45,1476.57,6654.48,1427.97,6440.51,1379.37C6070.44,1343.34,5700.38,1307.31,5330.32,1271.27L5330.32,1271.27C5244.74,1271.27,5159.15,1271.27,5073.57,1271.27Z"
            style={getSectionStyle('s_54')}
            onMouseEnter={() => handleMouseEnter('s_54')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_54')}
            onClick={() => handleClick('s_54')}
          />
          <path
            data-component="svg__section"
            data-section-id="s_53"
            data-section-name="GRANDSTAND EAST UPPER"
            d="M5073.57,6408.73C4703.51,6372.69,4333.45,6336.66,3963.38,6300.63C3749.4,6252.03,3535.42,6203.43,3321.64,6154.87C3260.87,6406.31,3200.11,6657.75,3139.35,6909.19C3371.43,6961.9,3605.39,7015.04,3839.36,7068.18C4238.2,7107.01,4637.04,7145.85,5035.88,7184.68C5146.59,7184.68,5257.3,7184.68,5368.0,7184.68C5766.85,7145.85,6165.69,7107.01,6564.53,7068.18C6798.48,7015.04,7032.43,6961.9,7264.5,6909.2C7203.74,6657.76,7142.97,6406.32,7082.21,6154.88C6868.45,6203.43,6654.48,6252.03,6440.51,6300.63C6070.44,6336.66,5700.38,6372.69,5330.32,6408.73L5330.32,6408.73C5244.74,6408.73,5159.15,6408.73,5073.57,6408.73Z"
            style={getSectionStyle('s_53')}
            onMouseEnter={() => handleMouseEnter('s_53')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart('s_53')}
            onClick={() => handleClick('s_53')}
          />
        </g>

        {/* Labels для ATP */}
        <g className="labels" style={{ pointerEvents: 'none' }}>
          {/* Prime A labels */}
          <text data-component="svg__label" data-label-id="s_38" transform="rotate(9,4179,5100)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="4179" y="5100">PRIME A EAST 2</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_37" transform="rotate(-7,6281,5086)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="6281" y="5086">PRIME A EAST 1</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_34" transform="rotate(8,6228,2424)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="6228" y="2424">PRIME A WEST 2</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_33" transform="rotate(-9,4165,2420)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="4165" y="2420">PRIME A WEST 1</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_36" transform="rotate(90,7375,4398)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="7375" y="4398">PRIME A NORTH 2</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_35" transform="rotate(90,7375,3260)" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="7375" y="3260">PRIME A NORTH 1</tspan>
          </text>

          {/* Prime B labels */}
          <text data-component="svg__label" data-label-id="s_39" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="7694" y="2380">PRIME B</tspan>
            <tspan dy="2em" x="7694" y="2380">NORTH 1</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_40" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="7789" y="3243">PRIME B</tspan>
            <tspan dy="2em" x="7789" y="3243">NORTH 2</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_41" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="7789" y="4170">PRIME B</tspan>
            <tspan dy="2em" x="7789" y="4170">NORTH 3</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_42" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="7709" y="4999">PRIME B</tspan>
            <tspan dy="2em" x="7709" y="4999">NORTH 4</tspan>
          </text>

          {/* Grandstand Lower labels */}
          <text data-component="svg__label" data-label-id="s_43" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="3527" y="1854">GS WEST</tspan>
            <tspan dy="2em" x="3527" y="1854">LOWER 1</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_44" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="4419" y="1684">GS WEST</tspan>
            <tspan dy="2em" x="4419" y="1684">LOWER 2</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_45" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="5188" y="1662">GS WEST</tspan>
            <tspan dy="2em" x="5188" y="1662">LOWER 3</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_46" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="5959" y="1691">GS WEST</tspan>
            <tspan dy="2em" x="5959" y="1691">LOWER 4</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_47" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="6860" y="1854">GS WEST</tspan>
            <tspan dy="2em" x="6860" y="1854">LOWER 5</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_48" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="6860" y="5561">GS EAST</tspan>
            <tspan dy="2em" x="6860" y="5561">LOWER 1</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_49" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="5972" y="5709">GS EAST</tspan>
            <tspan dy="2em" x="5972" y="5709">LOWER 2</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_50" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="5188" y="5920">GS EAST</tspan>
            <tspan dy="2em" x="5188" y="5920">LOWER 3</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_51" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="4400" y="5706">GS EAST</tspan>
            <tspan dy="2em" x="4400" y="5706">LOWER 4</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_52" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="3527" y="5560">GS EAST</tspan>
            <tspan dy="2em" x="3527" y="5560">LOWER 5</tspan>
          </text>

          {/* Grandstand Upper labels */}
          <text data-component="svg__label" data-label-id="s_54" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="5201" y="779">GRANDSTAND</tspan>
            <tspan dy="2em" x="5201" y="779">WEST UPPER</tspan>
          </text>
          <text data-component="svg__label" data-label-id="s_53" fontSize="118" fill="#FFFFFF" fontWeight="600" textAnchor="middle">
            <tspan dy="1em" x="5201" y="6621">GRANDSTAND</tspan>
            <tspan dy="2em" x="5201" y="6621">EAST UPPER</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};

// Экспортируем цвета и маппинги для синхронизации с EventSelection
export { CATEGORY_COLORS, WTA_SECTION_TO_CATEGORY, ATP_SECTION_TO_CATEGORY };
export default StaticSeatingMap;
