// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import RouterLink from 'next/link';

export const Link = styled(RouterLink)`
  text-decoration: none;
  display: block;
`;

export const ProductCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.borderGray};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
    border-color: #d1d5db;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.backgroundGray};
  overflow: hidden;
`;

export const Image = styled.div<{ $src: string }>`
  width: 100%;
  height: 192px;
  background: ${({ $src }) => $src ? `url("${$src}")` : 'transparent'} no-repeat center;
  background-size: contain;
  transition: transform 300ms ease;

  ${ProductCard}:hover & {
    transform: scale(1.03);
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 208px;
  }
`;

export const QuickAddOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  transform: translateY(100%);
  transition: transform 180ms ease;
  display: flex;
  justify-content: center;

  ${ProductCard}:hover & {
    transform: translateY(0);
  }
`;

export const QuickAddButton = styled.button`
  background: ${({ theme }) => theme.colors.otelBlue};
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  letter-spacing: -0.1px;
  transition: background 150ms ease, color 150ms ease;

  &:hover {
    background: #4449A9;
    color: white;
  }
`;

export const CardBody = styled.div`
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLightGray};
  text-transform: capitalize;
  width: fit-content;
`;

export const ProductName = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textGray};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProductPrice = styled.p`
  margin: 0;
  margin-top: auto;
  padding-top: 8px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textGray};
`;
