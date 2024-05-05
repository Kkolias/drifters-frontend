export function isProduction(): boolean {
    return window.location.hostname !== 'localhost'
}