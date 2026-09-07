import { roundTo } from '../formatters';

export interface UnitCategory {
  id: string;
  name: string;
  units: { id: string; name: string; symbol: string; toBase: number | ((val: number) => number); fromBase: number | ((val: number) => number) }[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    units: [
      { id: 'meter', name: 'Meters', symbol: 'm', toBase: 1, fromBase: 1 },
      { id: 'kilometer', name: 'Kilometers', symbol: 'km', toBase: 1000, fromBase: 0.001 },
      { id: 'centimeter', name: 'Centimeters', symbol: 'cm', toBase: 0.01, fromBase: 100 },
      { id: 'millimeter', name: 'Millimeters', symbol: 'mm', toBase: 0.001, fromBase: 1000 },
      { id: 'mile', name: 'Miles', symbol: 'mi', toBase: 1609.344, fromBase: 1 / 1609.344 },
      { id: 'yard', name: 'Yards', symbol: 'yd', toBase: 0.9144, fromBase: 1 / 0.9144 },
      { id: 'foot', name: 'Feet', symbol: 'ft', toBase: 0.3048, fromBase: 1 / 0.3048 },
      { id: 'inch', name: 'Inches', symbol: 'in', toBase: 0.0254, fromBase: 1 / 0.0254 },
      { id: 'nautical_mile', name: 'Nautical Miles', symbol: 'nmi', toBase: 1852, fromBase: 1 / 1852 },
    ],
  },
  {
    id: 'weight',
    name: 'Weight / Mass',
    units: [
      { id: 'kilogram', name: 'Kilograms', symbol: 'kg', toBase: 1, fromBase: 1 },
      { id: 'gram', name: 'Grams', symbol: 'g', toBase: 0.001, fromBase: 1000 },
      { id: 'milligram', name: 'Milligrams', symbol: 'mg', toBase: 0.000001, fromBase: 1000000 },
      { id: 'pound', name: 'Pounds', symbol: 'lb', toBase: 0.45359237, fromBase: 1 / 0.45359237 },
      { id: 'ounce', name: 'Ounces', symbol: 'oz', toBase: 0.028349523125, fromBase: 1 / 0.028349523125 },
      { id: 'metric_ton', name: 'Metric Tons', symbol: 't', toBase: 1000, fromBase: 0.001 },
      { id: 'stone', name: 'Stones', symbol: 'st', toBase: 6.35029318, fromBase: 1 / 6.35029318 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    units: [
      {
        id: 'celsius',
        name: 'Celsius',
        symbol: '°C',
        toBase: (c: number) => c,
        fromBase: (c: number) => c,
      },
      {
        id: 'fahrenheit',
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (f: number) => ((f - 32) * 5) / 9,
        fromBase: (c: number) => (c * 9) / 5 + 32,
      },
      {
        id: 'kelvin',
        name: 'Kelvin',
        symbol: 'K',
        toBase: (k: number) => k - 273.15,
        fromBase: (c: number) => c + 273.15,
      },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    units: [
      { id: 'sq_meter', name: 'Square Meters', symbol: 'm²', toBase: 1, fromBase: 1 },
      { id: 'sq_kilometer', name: 'Square Kilometers', symbol: 'km²', toBase: 1000000, fromBase: 0.000001 },
      { id: 'sq_foot', name: 'Square Feet', symbol: 'sq ft', toBase: 0.092903, fromBase: 1 / 0.092903 },
      { id: 'sq_yard', name: 'Square Yards', symbol: 'sq yd', toBase: 0.836127, fromBase: 1 / 0.836127 },
      { id: 'acre', name: 'Acres', symbol: 'ac', toBase: 4046.8564224, fromBase: 1 / 4046.8564224 },
      { id: 'hectare', name: 'Hectares', symbol: 'ha', toBase: 10000, fromBase: 0.0001 },
      { id: 'sq_mile', name: 'Square Miles', symbol: 'sq mi', toBase: 2589988.11, fromBase: 1 / 2589988.11 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    units: [
      { id: 'liter', name: 'Liters', symbol: 'L', toBase: 1, fromBase: 1 },
      { id: 'milliliter', name: 'Milliliters', symbol: 'mL', toBase: 0.001, fromBase: 1000 },
      { id: 'cubic_meter', name: 'Cubic Meters', symbol: 'm³', toBase: 1000, fromBase: 0.001 },
      { id: 'gallon_us', name: 'Gallons (US)', symbol: 'gal (US)', toBase: 3.78541, fromBase: 1 / 3.78541 },
      { id: 'gallon_uk', name: 'Gallons (UK)', symbol: 'gal (UK)', toBase: 4.54609, fromBase: 1 / 4.54609 },
      { id: 'fluid_ounce', name: 'Fluid Ounces (US)', symbol: 'fl oz', toBase: 0.0295735, fromBase: 1 / 0.0295735 },
      { id: 'cup', name: 'Cups (US)', symbol: 'cup', toBase: 0.236588, fromBase: 1 / 0.236588 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    units: [
      { id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: 1, fromBase: 1 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: 1.60934, fromBase: 1 / 1.60934 },
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', toBase: 3.6, fromBase: 1 / 3.6 },
      { id: 'knot', name: 'Knots', symbol: 'kn', toBase: 1.852, fromBase: 1 / 1.852 },
      { id: 'fps', name: 'Feet per second', symbol: 'ft/s', toBase: 1.09728, fromBase: 1 / 1.09728 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    units: [
      { id: 'second', name: 'Seconds', symbol: 's', toBase: 1, fromBase: 1 },
      { id: 'millisecond', name: 'Milliseconds', symbol: 'ms', toBase: 0.001, fromBase: 1000 },
      { id: 'minute', name: 'Minutes', symbol: 'min', toBase: 60, fromBase: 1 / 60 },
      { id: 'hour', name: 'Hours', symbol: 'hr', toBase: 3600, fromBase: 1 / 3600 },
      { id: 'day', name: 'Days', symbol: 'day', toBase: 86400, fromBase: 1 / 86400 },
      { id: 'week', name: 'Weeks', symbol: 'wk', toBase: 604800, fromBase: 1 / 604800 },
      { id: 'month', name: 'Months (30 days)', symbol: 'mo', toBase: 2592000, fromBase: 1 / 2592000 },
      { id: 'year', name: 'Years (365 days)', symbol: 'yr', toBase: 31536000, fromBase: 1 / 31536000 },
    ],
  },
  {
    id: 'data',
    name: 'Data Storage',
    units: [
      { id: 'byte', name: 'Bytes', symbol: 'B', toBase: 1, fromBase: 1 },
      { id: 'kilobyte', name: 'Kilobytes (KB)', symbol: 'KB', toBase: 1024, fromBase: 1 / 1024 },
      { id: 'megabyte', name: 'Megabytes (MB)', symbol: 'MB', toBase: 1024 ** 2, fromBase: 1 / 1024 ** 2 },
      { id: 'gigabyte', name: 'Gigabytes (GB)', symbol: 'GB', toBase: 1024 ** 3, fromBase: 1 / 1024 ** 3 },
      { id: 'terabyte', name: 'Terabytes (TB)', symbol: 'TB', toBase: 1024 ** 4, fromBase: 1 / 1024 ** 4 },
      { id: 'petabyte', name: 'Petabytes (PB)', symbol: 'PB', toBase: 1024 ** 5, fromBase: 1 / 1024 ** 5 },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    units: [
      { id: 'pascal', name: 'Pascals', symbol: 'Pa', toBase: 1, fromBase: 1 },
      { id: 'bar', name: 'Bar', symbol: 'bar', toBase: 100000, fromBase: 0.00001 },
      { id: 'psi', name: 'Pounds per square inch', symbol: 'psi', toBase: 6894.757, fromBase: 1 / 6894.757 },
      { id: 'atmosphere', name: 'Atmospheres', symbol: 'atm', toBase: 101325, fromBase: 1 / 101325 },
      { id: 'torr', name: 'Torr / mmHg', symbol: 'Torr', toBase: 133.322, fromBase: 1 / 133.322 },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    units: [
      { id: 'joule', name: 'Joules', symbol: 'J', toBase: 1, fromBase: 1 },
      { id: 'kilojoule', name: 'Kilojoules', symbol: 'kJ', toBase: 1000, fromBase: 0.001 },
      { id: 'calorie', name: 'Calories (cal)', symbol: 'cal', toBase: 4.184, fromBase: 1 / 4.184 },
      { id: 'kilocalorie', name: 'Kilocalories (kcal)', symbol: 'kcal', toBase: 4184, fromBase: 1 / 4184 },
      { id: 'watt_hour', name: 'Watt-hours', symbol: 'Wh', toBase: 3600, fromBase: 1 / 3600 },
      { id: 'kilowatt_hour', name: 'Kilowatt-hours', symbol: 'kWh', toBase: 3600000, fromBase: 1 / 3600000 },
      { id: 'btu', name: 'British Thermal Units', symbol: 'BTU', toBase: 1055.06, fromBase: 1 / 1055.06 },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    units: [
      { id: 'watt', name: 'Watts', symbol: 'W', toBase: 1, fromBase: 1 },
      { id: 'kilowatt', name: 'Kilowatts', symbol: 'kW', toBase: 1000, fromBase: 0.001 },
      { id: 'horsepower', name: 'Horsepower (metric)', symbol: 'hp', toBase: 735.49875, fromBase: 1 / 735.49875 },
      { id: 'megawatt', name: 'Megawatts', symbol: 'MW', toBase: 1000000, fromBase: 0.000001 },
    ],
  },
  {
    id: 'angle',
    name: 'Angle',
    units: [
      { id: 'degree', name: 'Degrees', symbol: '°', toBase: 1, fromBase: 1 },
      { id: 'radian', name: 'Radians', symbol: 'rad', toBase: 180 / Math.PI, fromBase: Math.PI / 180 },
      { id: 'gradian', name: 'Gradians', symbol: 'grad', toBase: 0.9, fromBase: 10 / 9 },
      { id: 'arcminute', name: 'Arcminutes', symbol: "'", toBase: 1 / 60, fromBase: 60 },
    ],
  },
];

export function convertUnits(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number
): { result: number; formula: string } {
  if (isNaN(value)) return { result: 0, formula: '' };

  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return { result: value, formula: '' };

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return { result: value, formula: '' };

  let baseValue = 0;
  if (typeof fromUnit.toBase === 'function') {
    baseValue = fromUnit.toBase(value);
  } else {
    baseValue = value * fromUnit.toBase;
  }

  let result = 0;
  if (typeof toUnit.fromBase === 'function') {
    result = toUnit.fromBase(baseValue);
  } else {
    result = baseValue * toUnit.fromBase;
  }

  return {
    result: roundTo(result, 6),
    formula: `1 ${fromUnit.symbol} = ${roundTo(
      typeof toUnit.fromBase === 'function'
        ? toUnit.fromBase(typeof fromUnit.toBase === 'function' ? fromUnit.toBase(1) : fromUnit.toBase)
        : (typeof fromUnit.toBase === 'function' ? fromUnit.toBase(1) : fromUnit.toBase) * toUnit.fromBase,
      6
    )} ${toUnit.symbol}`,
  };
}

export function convertDigitalSpeed(amount: number, fromUnit: string, toUnit: string) {
  // Base unit: bits per second (bps)
  const multipliers: Record<string, number> = {
    bps: 1,
    Kbps: 1000,
    Mbps: 1000000,
    Gbps: 1000000000,
    Bps: 8,
    KBps: 8000,
    MBps: 8000000,
    GBps: 8000000000,
  };
  const fromMult = multipliers[fromUnit] || 1;
  const toMult = multipliers[toUnit] || 1;
  const bps = amount * fromMult;
  return roundTo(bps / toMult, 4);
}

export function convertFuelEconomy(value: number, fromUnit: 'kml' | 'mpg_us' | 'mpg_uk' | 'l100km') {
  if (value <= 0) return { kml: 0, mpg_us: 0, mpg_uk: 0, l100km: 0 };
  let kml = 0;
  if (fromUnit === 'kml') kml = value;
  else if (fromUnit === 'mpg_us') kml = value * 0.425144;
  else if (fromUnit === 'mpg_uk') kml = value * 0.354006;
  else if (fromUnit === 'l100km') kml = 100 / value;

  return {
    kml: roundTo(kml, 2),
    mpg_us: roundTo(kml / 0.425144, 2),
    mpg_uk: roundTo(kml / 0.354006, 2),
    l100km: roundTo(100 / kml, 2),
  };
}
