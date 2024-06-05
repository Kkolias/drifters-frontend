

const IS_PRODUCTION = process.env.IS_PRODUCTION === 'true';
const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT === 'true';

export function isProduction(): boolean {
    if(typeof window === 'undefined') {
        return IS_PRODUCTION || IS_DEVELOPMENT // käytetään nyt alkuun samaa
    }
    return window.location.hostname !== 'localhost'
}