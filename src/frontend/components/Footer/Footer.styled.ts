// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.otelGray};
  border-top: 1px solid rgba(255,255,255,0.07);
`;

export const FooterTop = styled.div`
  padding: 48px 20px;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 64px 48px;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
  }
`;

export const FooterBrand = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-column: 1;
  }
`;

export const FooterInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BrandLogoIcon = styled.div`
  width: 26px;
  height: 26px;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.colors.otelBlue};
    border-radius: 2px;
    top: 3px;
    left: 3px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 7px;
    height: 7px;
    background: rgba(255,255,255,0.5);
    border-radius: 1px;
    bottom: 3px;
    right: 3px;
  }
`;

export const BrandLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

export const BrandDescription = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  max-width: 240px;
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FooterColumnTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0 0 4px;
`;

export const FooterLink = styled.a`
  font-size: 13px;
  color: #6b7280;
  text-decoration: none;
  transition: color 150ms ease;
  display: block;

  &:hover {
    color: #d1d5db;
  }
`;

export const FooterBottom = styled.div`
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 20px;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 20px 48px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Links = styled.div`
  display: flex;
  gap: 20px;

  a {
    font-size: 12px;
    color: #4b5563;
    text-decoration: none;
    transition: color 150ms ease;

    &:hover {
      color: #9ca3af;
    }
  }
`;

export const Meta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  span {
    font-size: 12px;
    color: #4b5563;
  }
`;
