// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import * as S from './PlatformFlag.styled';

const PlatformFlag = () => {
  const [platform, setPlatform] = useState('local');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ENV?.NEXT_PUBLIC_PLATFORM) {
      setPlatform(window.ENV.NEXT_PUBLIC_PLATFORM);
    }
  }, []);

  return (
    <S.Block>{platform}</S.Block>
  );
};

export default PlatformFlag;
