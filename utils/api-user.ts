import type { AxiosError } from "axios"


const USER_ENDPOINTS = {
  LOGIN: '/user/login',
  SIGN_UP: '/user/sign-up',
  GET_BY_TOKEN: '/user/get-by-token'
}


export class ApiUser extends ApiUtil {

  async login(email: string, password: string): Promise<string> {
    try {

      const { success, error } = await this.post({ url: USER_ENDPOINTS.LOGIN, payload: { email, password } })

      if (success?.length) {
        this.setToken(success)
        return ''
      }
      return error
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || 'Unexpected error'
      return errorMessage
    }
  }

  async signUp({ email, password, firstName, lastName }: { email: string, password: string, firstName: string, lastName: string }): Promise<string> {
    try {
      const { success, error } = await this.post({ url: USER_ENDPOINTS.SIGN_UP, payload: { email, password, firstName, lastName } })

      if (success?.length) {
        this.setToken(success)
        return ''
      }
      return error

    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || 'Unexpected error'
      return errorMessage
    }
  }

  async getUserByToken() {
    const user = await this.get({ url: USER_ENDPOINTS.GET_BY_TOKEN })
    return user
  }
}

export default new ApiUser()