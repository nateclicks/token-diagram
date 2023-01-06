import * as React from 'react';
import { TKLanguage, getTranslation } from '~translations';

export function useTranslation(locale?: TKLanguage) {
  return React.useMemo(() => {
    return getTranslation(locale ?? navigator.language.split(/[-_]/)[0]);
  }, [locale]);
}
