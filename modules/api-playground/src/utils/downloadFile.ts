import { Language } from '@/constants/language';

const LANGAUGE_VS_MIME_TYPE = {
  [Language.GRAPHQL]: 'application/octet-stream',
  [Language.JSON]: 'application/json',
  [Language.JAVASCRIPT]: 'text/javascript',
  [Language.TYPESCRIPT]: 'application/typescript',
};

const LANGAUGE_VS_EXTENSION = {
  [Language.GRAPHQL]: 'gql',
  [Language.JSON]: 'json',
  [Language.JAVASCRIPT]: 'js',
  [Language.TYPESCRIPT]: 'ts',
};

export const downloadFile = (data: string, filename: string, language: Language) => {
  // Create a Blob from the JSON string
  const blob = new Blob([data], { type: LANGAUGE_VS_MIME_TYPE[language] });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element (link)
  const anchor = document.createElement('a');

  // Set the anchor's href attribute to the temporary URL
  anchor.href = url;

  // Set the download attribute to specify the filename
  anchor.download = `${filename}.${LANGAUGE_VS_EXTENSION[language]}`;

  // Simulate a click event to trigger the download
  anchor.click();

  // Clean up the temporary URL and anchor element after the download starts
  setTimeout(() => {
    URL.revokeObjectURL(url);
    anchor.remove();
  }, 0);
};
