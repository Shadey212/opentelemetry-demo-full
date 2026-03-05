// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import Button from '../Button';

export const Banner = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.otelGray};
  position: relative;
  overflow: hidden;

  ${({ theme }) => theme.breakpoints.desktop} {
    flex-direction: row;
    min-height: 480px;
  }
`;

export const BannerImg = styled.img.attrs({
  src: '/images/Banner.png',
})`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
`;

export const ImageContainer = styled.div`
  height: 240px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.7) 100%);
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    height: auto;
    width: 55%;
    flex-shrink: 0;

    &::after {
      background: linear-gradient(to right, transparent 60%, ${({ theme }) => theme.colors.otelGray} 100%);
    }
  }
`;

export const TextContainer = styled.div`
  padding: 32px 20px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;

  ${({ theme }) => theme.breakpoints.desktop} {
    width: 45%;
    padding: 64px 64px 64px 48px;
  }
`;

export const EyebrowLabel = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.otelBlue};
  background: rgba(249,115,22,0.12);
  border: 1px solid rgba(249,115,22,0.25);
  border-radius: 4px;
  padding: 4px 10px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -0.5px;
  margin: 0;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: 48px;
  }
`;

export const TitleAccent = styled.span`
  color: ${({ theme }) => theme.colors.otelBlue};
`;

export const Subtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
  max-width: 380px;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: 17px;
  }
`;

export const GoShoppingButton = styled(Button)`
  background: ${({ theme }) => theme.colors.otelBlue};
  border-color: ${({ theme }) => theme.colors.otelBlue};
  color: white;
  font-size: 15px;
  font-weight: 600;
  height: 48px;
  padding: 0 28px;
  border-radius: 10px;
  transition: background 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    background: #ea6c0a;
    border-color: #ea6c0a;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(249,115,22,0.35);
  }
`;
