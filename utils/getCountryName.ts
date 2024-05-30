import text from '~/lang/country.lang'

export function getCountryName(countryRaw: string): string {
    if(!countryRaw) return 'N/A';
    const parsedCountryRaw = countryRaw.toLowerCase().replace(/ /g, '') as keyof typeof text.fi;
    const countryName = text?.fi?.[parsedCountryRaw] || 'N/A'
    return countryName;
}