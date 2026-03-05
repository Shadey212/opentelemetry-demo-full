// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import Button from '../Button';

export const Banner = styled.div`
  background: ${({ theme }) => theme.colors.otelGray};
  position: relative;
  overflow: hidden;
  padding: 72px 20px 80px;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(91,99,211,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 100px 48px 112px;
  }
`;

export const BannerImg = styled.img.attrs({
  src: '/images/Banner.png',
})`
  display: none;
`;

export const ImageContainer = styled.div`
  display: none;
`;

export const TextContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 760px;
  margin: 0 auto;
`;

export const EyebrowLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.otelBlue};
  background: rgba(91,99,211,0.12);
  border: 1px solid rgba(91,99,211,0.25);
  border-radius: 100px;
  padding: 5px 14px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: ${({ theme }) => theme.colors.otelBlue};
    border-radius: 50%;
    display: block;
  }
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.08;
  letter-spacing: -1px;
  margin: 0;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: 60px;
  }
`;

export const TitleAccent = styled.span`
  color: ${({ theme }) => theme.colors.otelBlue};
`;

export const Subtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #9ca3af;
  line-height: 1.65;
  margin: 0;
  max-width: 520px;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: 18px;
  }
`;

export const GoShoppingButton = styled(Button)`
  background: ${({ theme }) => theme.colors.otelBlue};
  border-color: ${({ theme }) => theme.colors.otelBlue};
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  height: 48px;
  padding: 0 28px;
  border-radius: 8px;
  transition: background 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    background: #4449A9;
    border-color: #4449A9;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(91,99,211,0.4);
  }
`;
