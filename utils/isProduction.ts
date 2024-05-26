
const IS_PRODUCTION = process.env.IS_PRODUCTION === 'true';

export function isProduction(): boolean {
    if(typeof window === 'undefined') {
        return IS_PRODUCTION
    }
    return window.location.hostname !== 'localhost'
}