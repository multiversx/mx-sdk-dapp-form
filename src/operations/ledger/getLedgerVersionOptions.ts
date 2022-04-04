import {
  ledgerHashSignMinimumVersion,
  ledgerMultiAccountMinimumVersion,
  ledgerSignAuthTokenMinimumVersion,
  ledgerWithWhitelistedTokensMinimumVersion
} from 'constants/index';

function compareVersions(a: string, b: string) {
  let i, diff;
  const regExStrip0 = /(\.0+)+$/;
  const segmentsA = a.replace(regExStrip0, '').split('.');
  const segmentsB = b.replace(regExStrip0, '').split('.');
  const l = Math.min(segmentsA.length, segmentsB.length);

  for (i = 0; i < l; i++) {
    diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff) {
      return diff;
    }
  }
  return segmentsA.length - segmentsB.length;
}

export function getLedgerVersionOptions(version: string) {
  const sortedVersions = [
    ledgerMultiAccountMinimumVersion,
    ledgerHashSignMinimumVersion,
    ledgerSignAuthTokenMinimumVersion,
    ledgerWithWhitelistedTokensMinimumVersion,
    version
  ].sort((a, b) => compareVersions(a, b));

  const indexOfMultiAccount = sortedVersions.indexOf(
    ledgerMultiAccountMinimumVersion
  );
  const indexOfHashSign = sortedVersions.indexOf(ledgerHashSignMinimumVersion);
  const indexOfSignAuthToken = sortedVersions.indexOf(
    ledgerSignAuthTokenMinimumVersion
  );
  const indexOfWhitelistedTokens = sortedVersions.indexOf(
    ledgerWithWhitelistedTokensMinimumVersion
  );
  const indexOfVersion = sortedVersions.indexOf(version);

  return {
    ledgerWithMultiAccount: indexOfVersion >= indexOfMultiAccount,
    ledgerWithHashSign: indexOfVersion >= indexOfHashSign,
    ledgerWithSignAuthToken: indexOfVersion >= indexOfSignAuthToken,
    ledgerWithWhitelistedTokens: indexOfVersion >= indexOfWhitelistedTokens
  };
}

export default getLedgerVersionOptions;
