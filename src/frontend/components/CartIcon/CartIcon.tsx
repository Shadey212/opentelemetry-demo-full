// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useState, useCallback } from 'react';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useCart } from '../../providers/Cart.provider';
import CartDropdown from '../CartDropdown';
import * as S from './CartIcon.styled';
import Analytics from '../../utils/analytics';

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    cart: { items },
  } = useCart();

  const handleOpen = useCallback(() => {
    Analytics.cartOpened(items.length);
    setIsOpen(true);
  }, [items.length]);

  return (
    <>
      <S.CartIcon data-cy={CypressFields.CartIcon} onClick={handleOpen}>
        <S.Icon src="/icons/CartIcon.svg" alt="Cart icon" title="Cart" />
        {!!items.length && <S.ItemsCount data-cy={CypressFields.CartItemCount}>{items.length}</S.ItemsCount>}
      </S.CartIcon>
      <CartDropdown productList={items} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CartIcon;
