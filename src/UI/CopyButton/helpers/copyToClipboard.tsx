function fallbackCopyTextToClipboard(text: string) {
  let textArea: HTMLTextAreaElement | null = null;

  try {
    let success = false;

    if (!document?.body) {
      return false;
    }

    textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const result = document.execCommand('copy');
    success = !!result;

    if (result === false) {
      console.warn('Fallback: document.execCommand("copy") returned false');
    }

    return success;
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    return false;
  } finally {
    if (textArea && document?.body?.contains(textArea)) {
      document.body.removeChild(textArea);
    }
  }
}

export async function copyTextToClipboard(text: string) {
  if (
    typeof window === 'undefined' ||
    typeof window?.location === 'undefined'
  ) {
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
