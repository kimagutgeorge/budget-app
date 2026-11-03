export function useMoney(currency = 'KES') {
  const fmt = new Intl.NumberFormat('en-KE', { style: 'currency', currency, maximumFractionDigits: 0 })
  return {
    format: (minor: number) => fmt.format(minor / 100),
    toMinor: (major: number | string) => Math.round(Number(major) * 100),
  }
}
