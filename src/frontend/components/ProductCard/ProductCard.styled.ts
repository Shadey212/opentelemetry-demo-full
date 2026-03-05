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
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(15,23,42,0.12);
    border-color: #cbd5e1;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  background: #f1f5f9;
  overflow: hidden;
`;

export const Image = styled.div<{ $src: string }>`
  width: 100%;
  height: 180px;
  background: ${({ $src }) => $src ? `url("${$src}")` : 'transparent'} no-repeat center;
  background-size: contain;
  transition: transform 300ms ease;

  ${ProductCard}:hover & {
    transform: scale(1.04);
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 220px;
  }
`;

export const QuickAddOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 100%);
  transform: translateY(100%);
  transition: transform 200ms ease;
  display: flex;
  justify-content: center;

  ${ProductCard}:hover & {
    transform: translateY(0);
  }
`;

export const QuickAddButton = styled.button`
  background: ${({ theme }) => theme.colors.otelBlue};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 150ms ease;

  &:hover {
    background: #ea6c0a;
  }
`;

export const CardBody = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 2px 8px;
  text-transform: capitalize;
  letter-spacing: 0.2px;
  width: fit-content;
`;

export const ProductName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textGray};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProductPrice = styled.p`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.otelBlue};
`;
