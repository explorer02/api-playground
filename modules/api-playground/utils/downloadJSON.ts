export const downloadJSON = (data: string, filename: string) => {
  // Create a Blob from the JSON string
  const blob = new Blob([data], { type: 'application/json' });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element (link)
  const anchor = document.createElement('a');

  // Set the anchor's href attribute to the temporary URL
  anchor.href = url;

  // Set the download attribute to specify the filename
  anchor.download = filename;

  // Simulate a click event to trigger the download
  anchor.click();

  // Clean up the temporary URL and anchor element after the download starts
  setTimeout(() => {
    URL.revokeObjectURL(url);
    anchor.remove();
  }, 0);
};
