// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import * as S from './Banner.styled';

const Banner = () => {
  return (
    <S.Banner>
      <S.ImageContainer>
        <S.BannerImg />
      </S.ImageContainer>
      <S.TextContainer>
        <S.EyebrowLabel>Better Stack Store</S.EyebrowLabel>
        <S.Title>
          Explore the universe,{' '}
          <S.TitleAccent>closer than ever</S.TitleAccent>
        </S.Title>
        <S.Subtitle>
          Premium telescopes, eyepieces, and astronomy accessories — curated for
          enthusiasts and professionals alike.
        </S.Subtitle>
        <Link href="#hot-products">
          <S.GoShoppingButton>Shop now</S.GoShoppingButton>
        </Link>
      </S.TextContainer>
    </S.Banner>
  );
};

export default Banner;
