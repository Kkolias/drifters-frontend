

const IS_PRODUCTION = process.env.IS_PRODUCTION === 'true';
const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT === 'true';

export function isProduction(): boolean {
    console.log('IS_PRODUCTION', IS_PRODUCTION)
    console.log('IS_DEVELOPMENT', IS_DEVELOPMENT)
    if(typeof window === 'undefined') {
        return IS_PRODUCTION || IS_DEVELOPMENT // käytetään nyt alkuun samaa
    }
    return window.location.hostname !== 'localhost'
}