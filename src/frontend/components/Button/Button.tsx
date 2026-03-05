// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled, { css } from 'styled-components';

const Button = styled.button<{ $type?: 'primary' | 'secondary' | 'link' }>`
  background-color: ${({ theme }) => theme.colors.otelBlue};
  color: white;
  display: inline-block;
  border: solid 1px ${({ theme }) => theme.colors.otelBlue};
  padding: 8px 20px;
  outline: none;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.4;
  border-radius: 10px;
  height: 48px;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    background: #ea6c0a;
    border-color: #ea6c0a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(249,115,22,0.3);
  }

  ${({ $type = 'primary' }) =>
    $type === 'secondary' &&
    css`
      background: none;
      color: ${({ theme }) => theme.colors.otelBlue};
      border-color: ${({ theme }) => theme.colors.borderGray};

      &:hover {
        background: ${({ theme }) => theme.colors.backgroundGray};
        border-color: ${({ theme }) => theme.colors.otelBlue};
        box-shadow: none;
        color: ${({ theme }) => theme.colors.otelBlue};
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

      &:hover {
        background: none;
        box-shadow: none;
        transform: none;
        opacity: 0.8;
      }
    `};
`;

export default Button;
