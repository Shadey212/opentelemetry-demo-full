// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image';
import styled from 'styled-components';

export const CartIcon = styled.a`
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  transition: background 150ms ease, border-color 150ms ease;
  margin-left: 8px;

  &:hover {
    background: rgba(255,255,255,0.15);
    border-color: rgba(255,255,255,0.2);
  }
`;

export const Icon = styled(Image).attrs({
  width: '18',
  height: '18',
})`
  filter: invert(1) opacity(0.85);
`;

export const ItemsCount = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otelBlue};
`;
