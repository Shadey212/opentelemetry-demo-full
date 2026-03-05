// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import styled from 'styled-components';

export const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.otelGray};
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(255,255,255,0.06);
`;

export const NavBar = styled.nav`
  height: 64px;
  font-size: 15px;

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 72px;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 0 48px;
  }
`;

export const NavBarBrand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
`;

export const BrandLogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.otelBlue};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  flex-shrink: 0;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

export const BrandName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.3px;
`;

export const BrandTagline = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.otelBlue};
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
`;
