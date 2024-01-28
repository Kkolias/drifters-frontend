import type { IFishingPermit, LakeId } from "~/interfaces/fishing-permit.interface";

const FISHING_PERMITS_ENDPOINTS = {
    GET_ALL: '/fishing-permit/get-all',
    GET_BY_ID: '/fishing-permit/get-by-id',
    CREATE: '/fishing-permit/create',
    ADD_CATCH_TO_PERMIT: '/fishing-permit/add-catch-to-permit'
}

export class FishingPermitApi extends ApiUtil {


    async getAllFishingPermits(): Promise<IFishingPermit[]> {
        try {
            const permits = await this.get({ url: FISHING_PERMITS_ENDPOINTS.GET_ALL })

            return permits
        } catch (error) {
            console.error(error)
            return []
        }

    }

    async getFishingPermitById(id: string): Promise<IFishingPermit | null> {
        try {
            const permit = await this.get({ url: FISHING_PERMITS_ENDPOINTS.GET_BY_ID, query: { id } })

            return permit
        } catch (error) {
            console.error(error)
            return null
        }

    }

    async createFishingPermit(payload:
        { firstName: string, lastName: string, email: string, lakeId: LakeId, startsAt: string, endsAt: string }): Promise<IFishingPermit | null> {
        try {
            const permit = await this.post({ url: FISHING_PERMITS_ENDPOINTS.CREATE, payload })

            return permit
        } catch (error) {
            console.error(error)
            return null
        }

    }

    async addCatchToPermit(payload:
        { permitId: string, specie: string, weightInGrams: number }): Promise<IFishingPermit | null> {
        try {
            const permit = await this.post({ url: FISHING_PERMITS_ENDPOINTS.ADD_CATCH_TO_PERMIT, payload })

            return permit
        } catch (error) {
            console.error(error)
            return null
        }

    }
}

export default new FishingPermitApi()