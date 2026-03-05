// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import Button from '../components/Button';

export const ProductDetail = styled.div`
  padding: 24px 16px;
  max-width: 1200px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 48px;
  }
`;

export const Breadcrumb = styled.div`
  margin-bottom: 24px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLightGray};
  display: flex;
  align-items: center;
  gap: 6px;

  a {
    color: ${({ theme }) => theme.colors.textLightGray};
    text-decoration: none;
    &:hover { color: ${({ theme }) => theme.colors.otelBlue}; }
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.borderGray};
  border-radius: 16px;
  padding: 24px;

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: 45% 55%;
    padding: 40px;
  }
`;

export const Image = styled.div<{ $src: string }>`
  width: 100%;
  height: 240px;
  background: ${({ $src }) => `url("${$src}")`} no-repeat center;
  background-size: contain;
  border-radius: 12px;
  background-color: #f8fafc;

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 420px;
  }
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AddToCart = styled(Button)`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  height: 48px;

  ${({ theme }) => theme.breakpoints.desktop} {
    width: 240px;
  }
`;

export const Name = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.textGray};
  letter-spacing: -0.3px;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: 28px;
  }
`;

export const Text = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLightGray};
`;

export const Description = styled(Text)`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLightGray};
  font-weight: 400;
  line-height: 1.65;
  font-size: 15px;
`;

export const ProductPrice = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 26px;
  color: ${({ theme }) => theme.colors.otelBlue};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: 32px;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.borderGray};
  margin: 4px 0;
`;
