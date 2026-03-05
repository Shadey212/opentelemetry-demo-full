// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useCallback, useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiGateway from '../gateways/Api.gateway';
import { CartItem, OrderResult, PlaceOrderRequest } from '../protos/demo';
import { IProductCart } from '../types/Cart';
import { useCurrency } from './Currency.provider';
import Analytics from '../utils/analytics';

interface IContext {
  cart: IProductCart;
  addItem(item: CartItem): void;
  emptyCart(): void;
  placeOrder(order: PlaceOrderRequest): Promise<OrderResult>;
}

export const Context = createContext<IContext>({
  cart: { userId: '', items: [] },
  addItem: () => {},
  emptyCart: () => {},
  placeOrder: () => Promise.resolve({} as OrderResult),
});

interface IProps {
  children: React.ReactNode;
}

export const useCart = () => useContext(Context);

const CartProvider = ({ children }: IProps) => {
  const { selectedCurrency } = useCurrency();
  const queryClient = useQueryClient();
  const mutationOptions = useMemo(
    () => ({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      },
    }),
    [queryClient]
  );

  const { data: cart = { userId: '', items: [] } } = useQuery({
    queryKey: ['cart', selectedCurrency],
    queryFn: () => ApiGateway.getCart(selectedCurrency),
  });
  const addCartMutation = useMutation({
    mutationFn: ApiGateway.addCartItem,
    ...mutationOptions,
  });

  const emptyCartMutation = useMutation({
    mutationFn: ApiGateway.emptyCart,
    ...mutationOptions,
  });

  const placeOrderMutation = useMutation({
    mutationFn: ApiGateway.placeOrder,
    ...mutationOptions,
  });

  const addItem = useCallback(
    (item: CartItem) => addCartMutation.mutateAsync({ ...item, currencyCode: selectedCurrency }),
    [addCartMutation, selectedCurrency]
  );

  const emptyCart = useCallback(() => {
    Analytics.cartEmptied();
    return emptyCartMutation.mutateAsync();
  }, [emptyCartMutation]);

  const placeOrder = useCallback(
    (order: PlaceOrderRequest) => {
      Analytics.checkoutStarted(cart.items.length);
      return placeOrderMutation.mutateAsync({ ...order, currencyCode: selectedCurrency }).then(result => {
        if (result?.orderId) {
          Analytics.orderPlaced(result.orderId);
        }
        return result;
      });
    },
    [placeOrderMutation, selectedCurrency, cart.items.length]
  );

  const value = useMemo(() => ({ cart, addItem, emptyCart, placeOrder }), [cart, addItem, emptyCart, placeOrder]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default CartProvider;
