import { buildUrlParams } from '@elrondnetwork/dapp-core/utils';

interface ReplyToDappBasicType {
  callbackUrl: string;
}
interface ReplyToDappUrlType extends ReplyToDappBasicType {
  urlParams?: { [key: string]: string };
  qsStr?: never;
}
interface ReplyToDappQsType extends ReplyToDappBasicType {
  urlParams?: never;
  qsStr?: string;
}

type ReplyToDappType = ReplyToDappUrlType | ReplyToDappQsType;

export function replyUrl({ callbackUrl, urlParams = {} }: ReplyToDappType) {
  let url = callbackUrl;
  if (Object.entries(urlParams).length > 0) {
    try {
      const { search, origin, pathname } = new URL(callbackUrl);
      const { nextUrlParams } = buildUrlParams(search, urlParams);
      url = `${origin}${pathname}?${nextUrlParams}`;
    } catch (err) {
      console.error('Unable to construct URL from: ', callbackUrl, err);
      return url;
    }
  }
  return url;
}

function replyQsUrl({ callbackUrl, qsStr }: ReplyToDappType) {
  const { search, origin, pathname } = new URL(callbackUrl);
  const newSearch = search ? `${search}&${qsStr}` : `?${qsStr}`;
  const url = `${origin}${pathname}${newSearch}`;
  return url;
}

export function replyToDapp({
  callbackUrl,
  urlParams = {},
  qsStr = ''
}: ReplyToDappType) {
  const url = qsStr
    ? replyQsUrl({ callbackUrl, qsStr })
    : replyUrl({ callbackUrl, urlParams });

  window.location.href = url;
}

export default replyToDapp;
