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
      <S.FooterInner>
        <S.Brand>
          <S.BrandLogoIcon>BS</S.BrandLogoIcon>
          <S.BrandLabel>Better Stack Store</S.BrandLabel>
        </S.Brand>
        <S.Links>
          <a href="https://betterstack.com" target="_blank" rel="noreferrer">
            Better Stack
          </a>
          <a href="https://github.com/open-telemetry/opentelemetry-demo" target="_blank" rel="noreferrer">
            Source Code
          </a>
        </S.Links>
        <S.Meta>
          <span>Demo store — not a real shop</span>
          <span data-cy={CypressFields.SessionId}>
            session: {sessionId ? sessionId.slice(0, 12) + '…' : '—'}
          </span>
          <span>© {currentYear} Better Stack</span>
          <PlatformFlag />
        </S.Meta>
      </S.FooterInner>
    </S.Footer>
  );
};

export default Footer;
