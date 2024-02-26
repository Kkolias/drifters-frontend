import type { IDriftEvent } from "~/interfaces/drift-event.interface"
import driftEventApi from "~/utils/drifting/api-drift-event"


export class DriftEventAdminViewService {

  async getDriftEventById(id: string): Promise<IDriftEvent | null> {
    const r = await driftEventApi.getDriftEventById(id)

    return r
  }
}

export default new DriftEventAdminViewService()