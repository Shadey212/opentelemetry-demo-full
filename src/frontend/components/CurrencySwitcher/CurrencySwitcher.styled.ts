// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const CurrencySwitcher = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  color: #94a3b8;
`;

export const SelectedConcurrency = styled.span`
  font-size: 14px;
  text-align: center;
  font-weight: ${({ theme }) => theme.fonts.regular};
  color: #e2e8f0;
  position: absolute;
  left: 10px;
  z-index: 1;
  pointer-events: none;
`;

export const Arrow = styled.img.attrs({
  src: '/icons/Chevron.svg',
  alt: 'arrow',
})`
  position: absolute;
  right: 10px;
  width: 10px;
  height: 14px;
  pointer-events: none;
  filter: invert(1) opacity(0.5);
`;

export const Select = styled.select`
  -webkit-appearance: none;
  -webkit-border-radius: 0px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.08);
  color: #e2e8f0;
  font-weight: ${({ theme }) => theme.fonts.regular};
  border: 1px solid rgba(255,255,255,0.12);
  width: 110px;
  height: 36px;
  flex-shrink: 0;
  padding: 0 32px 0 32px;
  border-radius: 8px;
  transition: background 150ms ease, border-color 150ms ease;

  &:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.2);
  }

  option {
    background: #1e293b;
    color: #e2e8f0;
  }
`;
