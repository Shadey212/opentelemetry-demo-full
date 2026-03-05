// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import styled from 'styled-components';

export const Header = styled.header`
  background-color: #ffffff;
  color: ${({ theme }) => theme.colors.textGray};
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGray};
`;

export const NavBar = styled.nav`
  height: 60px;
  font-size: 15px;

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 64px;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  max-width: 1280px;
  margin: 0 auto;

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
  width: 30px;
  height: 30px;
  background: ${({ theme }) => theme.colors.otelGray};
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: ${({ theme }) => theme.colors.otelBlue};
    border-radius: 3px;
    top: 4px;
    left: 4px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: #ffffff;
    border-radius: 2px;
    bottom: 4px;
    right: 4px;
  }
`;

export const BrandText = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  line-height: 1;
`;

export const BrandName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textGray};
  letter-spacing: -0.3px;
`;

export const BrandTagline = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLightGray};
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
`;
