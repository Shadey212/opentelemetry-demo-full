// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Footer = styled.footer`
  padding: 40px 48px;
  background-color: ${({ theme }) => theme.colors.otelGray};
  border-top: 1px solid rgba(255,255,255,0.06);

  * {
    color: #64748b;
    font-size: 13px;
    font-weight: 400;
  }
`;

export const FooterInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${({ theme }) => theme.breakpoints.desktop} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BrandLogoIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.otelBlue};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: white !important;
  flex-shrink: 0;
`;

export const BrandLabel = styled.span`
  color: #94a3b8 !important;
  font-weight: 500 !important;
`;

export const Links = styled.div`
  display: flex;
  gap: 20px;

  a {
    color: #64748b !important;
    text-decoration: none;
    transition: color 150ms ease;

    &:hover {
      color: #94a3b8 !important;
    }
  }
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${({ theme }) => theme.breakpoints.desktop} {
    text-align: right;
  }
`;
