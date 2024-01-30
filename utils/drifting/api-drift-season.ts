import type { IDriftSeason } from "~/interfaces/drift-season.interface";

const DRIFT_SEASON_ENDPOINTS = {
    GET_ALL: '/drift-season/get-all',
    GET_BY_ID: '/drift-season/get-by-id',
    CREATE: '/drift-season/create-drift-season',
    ADD_DRIVER_TO_SEASON: '/drift-season/add-driver-to-season',
    ADD_MANY_DRIVERS_TO_SEASON: '/drift-season/add-many-drivers-to-season',
    ADD_LEADERBOARD_TO_SEASON: '/drift-season/add-leaderboard-to-season',
    ADD_EVENT_TO_SEASON: '/drift-season/add-event-to-season',
}

export class DriftSeasonApi extends ApiUtil {


    async getAllDriftSeasons(): Promise<IDriftSeason[]> {
        try {
            const permits = await this.get({ url: DRIFT_SEASON_ENDPOINTS.GET_ALL })

            return permits
        } catch (error) {
            console.error(error)
            return []
        }

    }

    async getDriftSeasonById(id: string): Promise<IDriftSeason | null> {
        try {
            const permit = await this.get({ url: DRIFT_SEASON_ENDPOINTS.GET_BY_ID, query: { id } })

            return permit
        } catch (error) {
            console.error(error)
            return null
        }

    }

    // async createDriftSeason(payload:
    //     { firstName: string, lastName: string, age: number }): Promise<IFishingPermit | null> {
    //     try {
    //         const permit = await this.post({ url: DRIFT_SEASON_ENDPOINTS.CREATE, payload })

    //         return permit
    //     } catch (error) {
    //         console.error(error)
    //         return null
    //     }

    // }

    // async addDriverToDriftSeason(payload:
    //     { permitId: string, specie: string, weightInGrams: number }): Promise<IFishingPermit | null> {
    //     try {
    //         const permit = await this.post({ url: DRIFT_SEASON_ENDPOINTS.ADD_DRIVER_TO_SEASON, payload })

    //         return permit
    //     } catch (error) {
    //         console.error(error)
    //         return null
    //     }

    // }
}

export default new FishingPermitApi()