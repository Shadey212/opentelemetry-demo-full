// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
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
  padding: 40px 0;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 56px 0 80px;
  }
`;

export const HotProducts = styled.div``;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGray};

  ${({ theme }) => theme.breakpoints.desktop} {
    margin-bottom: 32px;
  }
`;

export const HotProductsTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textGray};
  margin: 0;
  letter-spacing: -0.3px;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: 20px;
  }
`;

export const ProductCount = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLightGray};
  background: ${({ theme }) => theme.colors.backgroundGray};
  border: 1px solid ${({ theme }) => theme.colors.borderGray};
  border-radius: 100px;
  padding: 2px 10px;
`;

export const Home = styled.div`
  background: ${({ theme }) => theme.colors.backgroundGray};
  min-height: 100vh;
`;
