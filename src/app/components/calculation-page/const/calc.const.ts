export const YEAR_LIST = Array.from(
  {length: 6},
  (el, idx) => {
    return {
      value: 1 + idx,
      name: 2014 + idx
    }
  }
);

export const DISPLAYED_COLUMNS = [
  'position',
  'regionName',
  'value'
]
export const DISPLAYED_COLUMNS_CHAIN = [
  'position',
  'regionName',
  'comparablePairs',
  'value'
]
