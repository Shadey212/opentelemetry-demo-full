// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled, { css } from 'styled-components';

const Button = styled.button<{ $type?: 'primary' | 'secondary' | 'link' }>`
  background-color: ${({ theme }) => theme.colors.otelBlue};
  color: #ffffff;
  display: inline-block;
  border: solid 1px ${({ theme }) => theme.colors.otelBlue};
  padding: 8px 20px;
  outline: none;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.4;
  border-radius: 7px;
  height: 40px;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease, color 150ms ease;

  &:hover {
    background: #4449A9;
    border-color: #4449A9;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(91,99,211,0.35);
  }

  ${({ $type = 'primary' }) =>
    $type === 'secondary' &&
    css`
      background: transparent;
      color: ${({ theme }) => theme.colors.textGray};
      border-color: ${({ theme }) => theme.colors.borderGray};
      font-weight: 600;

      &:hover {
        background: ${({ theme }) => theme.colors.backgroundGray};
        border-color: #d1d5db;
        box-shadow: none;
        transform: none;
        color: ${({ theme }) => theme.colors.textGray};
      }
    `};

  ${({ $type = 'primary' }) =>
    $type === 'link' &&
    css`
      background: none;
      color: ${({ theme }) => theme.colors.otelBlue};
      border: none;
      box-shadow: none;
      transform: none;
      padding: 8px 0;
      height: auto;
      font-weight: 600;

      &:hover {
        background: none;
        box-shadow: none;
        transform: none;
        color: #4449A9;
      }
    `};
`;

export default Button;
