// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import * as S from './Footer.styled';
import SessionGateway from '../../gateways/Session.gateway';
import { CypressFields } from '../../utils/enums/CypressFields';
import PlatformFlag from '../PlatformFlag';

const currentYear = new Date().getFullYear();
const { userId } = SessionGateway.getSession();

const Footer = () => {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(userId);
  }, []);

  return (
    <S.Footer>
      <S.FooterTop>
        <S.FooterBrand>
          <S.Brand>
            <S.BrandLogoIcon />
            <S.BrandLabel>Better Stack Store</S.BrandLabel>
          </S.Brand>
          <S.BrandDescription>
            A demo astronomy shop powered by OpenTelemetry and Better Stack observability.
          </S.BrandDescription>
        </S.FooterBrand>

        <S.FooterColumn>
          <S.FooterColumnTitle>Shop</S.FooterColumnTitle>
          <S.FooterLink href="/">All products</S.FooterLink>
          <S.FooterLink href="/#hot-products">Telescopes</S.FooterLink>
          <S.FooterLink href="/#hot-products">Accessories</S.FooterLink>
          <S.FooterLink href="/#hot-products">Books</S.FooterLink>
        </S.FooterColumn>

        <S.FooterColumn>
          <S.FooterColumnTitle>Better Stack</S.FooterColumnTitle>
          <S.FooterLink href="https://betterstack.com" target="_blank" rel="noreferrer">Home</S.FooterLink>
          <S.FooterLink href="https://betterstack.com/logs" target="_blank" rel="noreferrer">Logs</S.FooterLink>
          <S.FooterLink href="https://betterstack.com/uptime" target="_blank" rel="noreferrer">Uptime</S.FooterLink>
          <S.FooterLink href="https://betterstack.com/errors" target="_blank" rel="noreferrer">Errors</S.FooterLink>
        </S.FooterColumn>

        <S.FooterColumn>
          <S.FooterColumnTitle>Resources</S.FooterColumnTitle>
          <S.FooterLink href="https://betterstack.com/docs" target="_blank" rel="noreferrer">Docs</S.FooterLink>
          <S.FooterLink href="https://github.com/open-telemetry/opentelemetry-demo" target="_blank" rel="noreferrer">Source code</S.FooterLink>
          <S.FooterLink href="https://opentelemetry.io" target="_blank" rel="noreferrer">OpenTelemetry</S.FooterLink>
        </S.FooterColumn>
      </S.FooterTop>

      <S.FooterBottom>
        <S.Meta>
          <span>© {currentYear} Better Stack</span>
          <span>Demo store — not a real shop</span>
          <span data-cy={CypressFields.SessionId}>
            session: {sessionId ? sessionId.slice(0, 12) + '…' : '—'}
          </span>
          <PlatformFlag />
        </S.Meta>
        <S.Links>
          <a href="https://betterstack.com/privacy" target="_blank" rel="noreferrer">Privacy</a>
          <a href="https://betterstack.com/terms" target="_blank" rel="noreferrer">Terms</a>
        </S.Links>
      </S.FooterBottom>
    </S.Footer>
  );
};

export default Footer;
