import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { PredictOutputDto } from './dto/output/predict-output.dto.ts';

export class NeuroResolver {
  private apiResolver = new ApiResolverUtil('neuro');
  private token = localStorage.getItem('token');

  public async predict(userId: number) {
    return await this.apiResolver.request<null, PredictOutputDto[]>(
      `predict/${userId}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    ).catch((_) => { return [] })
  }
}