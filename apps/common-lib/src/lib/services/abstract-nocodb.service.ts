import { map, Observable } from 'rxjs';
import { NocoDbResponse } from '../models/nocodb-response';

export abstract class NocodbHttpService {
  /**
   * Maps a NocoDbResponse object to the list of type T, with error handling for reaching the result limit.
   * @param data Observable of type NocoDbResponse<T> to map
   * @returns Observable of type T[] with error handling for result limit reached
   */
  protected mapNocoDbReponse<T>(data: Observable<NocoDbResponse<T>>) {
    return data.pipe(
      map((response: NocoDbResponse<T>) => {
        if (response.pageInfo.isLastPage === false) {
          throw new Error(
            `La limite de lignes de résultat est atteinte. Veuillez affiner vos filtres afin d'obtenir un résultat complet.`
          );
        } else {
          return response.list;
        }
      })
    );
  }
}
