import axios from 'axios';
import { translateFolderId, translateApiKey } from '../api/apiConf.ts';

export async function useTranslation(wordToTranslate: string, targetLang: string) {
  try {
    const response = await axios.post(
      'https://cors-anywhere.herokuapp.com/https://translate.api.cloud.yandex.net/translate/v2/translate',
      {
        folderId: translateFolderId,
        texts: wordToTranslate.split(' '),
        targetLanguageCode: targetLang,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${translateApiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) { return '' }
}