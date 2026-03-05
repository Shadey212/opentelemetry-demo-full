// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import * as S from './Banner.styled';

const Banner = () => {
  return (
    <S.Banner>
      <S.TextContainer>
        <S.EyebrowLabel>New arrivals every week</S.EyebrowLabel>
        <S.Title>
          The universe,{' '}
          <S.TitleAccent>within reach.</S.TitleAccent>
        </S.Title>
        <S.Subtitle>
          Premium telescopes and astronomy gear — curated for stargazers,
          astrophotographers, and professionals. Free shipping over $100.
        </S.Subtitle>
        <Link href="#hot-products">
          <S.GoShoppingButton>Browse the collection</S.GoShoppingButton>
        </Link>
      </S.TextContainer>
    </S.Banner>
  );
};

export default Banner;
