// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const ProductList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
`;
