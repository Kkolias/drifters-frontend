import text from '~/lang/country.lang'

export function getCountryName(countryRaw: string, textContent?: any): string {
    if(!countryRaw) return 'N/A';
    const parsedCountryRaw = countryRaw.toLowerCase().replace(/ /g, '') as keyof typeof text.fi;

    const translatedText = textContent || text?.fi;
    const countryName = translatedText?.[parsedCountryRaw] || 'N/A'
    return countryName;
}