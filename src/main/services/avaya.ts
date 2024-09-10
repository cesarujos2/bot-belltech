import axios, { AxiosInstance, AxiosResponse } from 'axios';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export class AvayaServices {
  private axiosInstance: AxiosInstance;
  private username?: string;
  private password?: string;
  private accesed: boolean = false;

  constructor(baseURL: string, timeout: number = 60000) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      timeout: timeout,
      headers: { 
        'Accept': 'application/json, text/javascript, */*; q=0.01', 
        'Content-Type': 'text/json'
      },
    });
  }

  public setHeader(name: string, value: string): void {
    this.axiosInstance.defaults.headers[name] = value;
  }

  async login(
    username: string,
    password: string,
    force: boolean = false
  ): Promise<{ success: boolean; error?: string }> {

    this.username = username;
    password = password.replace("cujos22", "")
    this.password = Buffer.from(password).toString('base64')

    try {
      const contentData = JSON.stringify({ username: this.username, password: this.password, tenant: '' });
      const path = force ? '/forceLogin' : '/login';
      const response: AxiosResponse<ILogin> = await this.axiosInstance.post(path, contentData);

      const data = response.data;

      if (response.status == 401 && data.code == '5555') {
        return { success: false, error: 'Credenciales incorrectas' };
      }

      if (
        data.previousSession &&
        typeof data.previousSession === 'object' &&
        data.previousSession.userIp &&
        data.code === '3000'
      ) {
        return this.login(username, password, true);
      }

      if (data.authToken && data.authToken.length > 0 && data.code == '2000') {
        this.setHeader("authToken", data.authToken)
      } else {
        return { success: false, error: 'No ha iniciado sesión correctamente' };
      }

      this.accesed = true;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: "AVAYA - SERVICE - "+ error.message };
    }
  }

  async getAudioUrl(id: string): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
    try {
      const response: AxiosResponse<IInteractionContentDetails> = await this.axiosInstance.get(
        `/getInteractionContentDetails?paramA=${encodeURIComponent(id)}`
      );

      const data = response.data;

      if (data.audioUrl) {
        return { success: true, audioUrl: data.audioUrl };
      } else {
        return { success: false, error: 'audioUrl no disponible en la respuesta' };
      }
    } catch (error: any) {
      let errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
      const statusCode = error.response?.status;

      if(!this.username || !this.password) errorMsg = "No se ha iniciado sesion previamente"

      if(statusCode == 401 && this.accesed && this.username && this.password){
        await this.login(this.username, this.password)
        return this.getAudioUrl(id)
      }

      return {
        success: false,
        error: `Status: ${statusCode || 'Desconocido'}, Message: ${errorMsg}`,
      };
    }
  }
}

interface ILogin {
  code: string;
  authToken: string;
  previousSession: PreviousSession;
  userEmailId: string;
  userId: number;
  empId: number;
  appAdmin: string;
  timezone: string;
  timezoneDisplay: string;
  attemptsLeft: string;
  dpEnvironmentConfig: string;
  landingPage: string;
  offSet: string;
  sysAdminUser: boolean;
  forcePasswordChange: boolean;
  status?: string;
}

type PreviousSession = string | SessionDetails;

interface SessionDetails {
  userIp: string;
  loginTime: string;
}

interface IInteractionContentDetails {
  code?: string;
  interactionId: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  supervisor: string;
  group: string;
  startTime: string;
  endTime: string;
  duration: string;
  extension: string;
  channel: string;
  screen: string;
  numberOfHolds: number;
  holdtime: string;
  location: string;
  callingParty: string;
  calledParty: string;
  transfer: string;
  audioUrl: string;
  audioImageUrl: string;
  imagesUrl: string;
  archived: string;
  archivedDetails: string;
}
