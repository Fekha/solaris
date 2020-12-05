import axios from 'axios'
import BaseApiService from './base'

class DiplomacyService extends BaseApiService {
    requestAlliance (gameId, toPlayerId) {
    return axios.put(this.BASE_URL + 'game/' + gameId + '/diplomacy/requestAlliance', {
      toPlayerId
    },
    { withCredentials: true })
  }
}

export default new DiplomacyService()
