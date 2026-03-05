// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding: 0 16px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 0 48px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export const Content = styled.div`
  width: 100%;
  ${({ theme }) => theme.breakpoints.desktop} {
    margin-top: 56px;
  }
`;

export const HotProducts = styled.div`
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoints.desktop} {
    margin-bottom: 80px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;

  ${({ theme }) => theme.breakpoints.desktop} {
    margin-bottom: 32px;
  }
`;

export const HotProductsTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textGray};
  margin: 0;
  letter-spacing: -0.3px;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: 28px;
  }
`;

export const ProductCount = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLightGray};
`;

export const Home = styled.div`
  @media (max-width: 767px) {
    ${Content} {
      width: 100%;
    }
  }
`;
