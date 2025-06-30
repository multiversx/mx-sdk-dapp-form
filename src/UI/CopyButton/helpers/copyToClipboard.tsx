function fallbackCopyTextToClipboard(text: string) {
  try {
    let success = false;

    const textArea = document?.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document?.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document?.execCommand('copy');
    success = true;

    document?.body.removeChild(textArea);

    return success;
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    return false;
  }
}

export async function copyTextToClipboard(text: string) {
  if (typeof window != 'undefined' && typeof window?.location != 'undefined') {
    return false;
  }

  let success = false;

  if (!navigator.clipboard) {
    success = fallbackCopyTextToClipboard(text);
  } else {
    success = await navigator.clipboard.writeText(text).then(
      function done() {
        return true;
      },
      function error(err) {
        console.error('Async: Could not copy text: ', err);
        return false;
      }
    );
  }

  return success;
}
