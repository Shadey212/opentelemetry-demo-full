// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Ad from '../../../components/Ad';
import Layout from '../../../components/Layout';
import ProductPrice from '../../../components/ProductPrice';
import Recommendations from '../../../components/Recommendations';
import ProductReviews from '../../../components/ProductReviews';
import Select from '../../../components/Select';
import { CypressFields } from '../../../utils/enums/CypressFields';
import ApiGateway from '../../../gateways/Api.gateway';
import { Product } from '../../../protos/demo';
import AdProvider from '../../../providers/Ad.provider';
import { useCart } from '../../../providers/Cart.provider';
import * as S from '../../../styles/ProductDetail.styled';
import { useCurrency } from '../../../providers/Currency.provider';
import ProductReviewProvider from '../../../providers/ProductReview.provider';
import ProductAIAssistantProvider from '../../../providers/ProductAIAssistant.provider';
import Analytics from '../../../utils/analytics';

const quantityOptions = new Array(10).fill(0).map((_, i) => i + 1);

const ProductDetail: NextPage = () => {
  const { push, query } = useRouter();
  const [quantity, setQuantity] = useState(1);
  const {
    addItem,
    cart: { items },
  } = useCart();
  const { selectedCurrency } = useCurrency();
  const productId = query.productId as string;

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  const {
    data: {
      name,
      picture,
      description,
      priceUsd = { units: 0, currencyCode: 'USD', nanos: 0 },
      categories,
    } = {} as Product,
  } = useQuery({
      queryKey: ['product', productId, 'selectedCurrency', selectedCurrency],
      queryFn: () => ApiGateway.getProduct(productId, selectedCurrency),
      enabled: !!productId,
    }
  ) as { data: Product };

  // Track product viewed when we have the product data
  useEffect(() => {
    if (name && productId) {
      Analytics.productViewed(productId, name, priceUsd);
      Analytics.pageViewed(`Product: ${name}`);
    }
  }, [productId, name, priceUsd]);

  const onAddItem = useCallback(async () => {
    Analytics.addedToCart(productId, name, quantity, priceUsd);
    await addItem({ productId, quantity });
    push('/cart');
  }, [addItem, productId, quantity, push, name, priceUsd]);

  return (
    <AdProvider
      productIds={[productId, ...items.map(({ productId }) => productId)]}
      contextKeys={[...new Set(categories)]}
    >
      <Head>
        <title>{name ? `${name} — Better Stack Store` : 'Better Stack Store'}</title>
      </Head>
      <Layout>
        <S.ProductDetail data-cy={CypressFields.ProductDetail}>
          <S.Container>
            <S.Image $src={"/images/products/" + picture} data-cy={CypressFields.ProductPicture} />
            <S.Details>
              <S.Name data-cy={CypressFields.ProductName}>{name}</S.Name>
              <S.ProductPrice>
                <ProductPrice price={priceUsd} />
              </S.ProductPrice>
              <S.Divider />
              <S.Description data-cy={CypressFields.ProductDescription}>{description}</S.Description>
              <S.Divider />
              <S.Text>Quantity</S.Text>
              <Select
                data-cy={CypressFields.ProductQuantity}
                onChange={event => setQuantity(+event.target.value)}
                value={quantity}
              >
                {quantityOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <S.AddToCart data-cy={CypressFields.ProductAddToCart} onClick={onAddItem}>
                <Image src="/icons/Cart.svg" height="15" width="15" alt="cart" /> Add To Cart
              </S.AddToCart>
            </S.Details>
          </S.Container>
          {productId && (
            <ProductAIAssistantProvider productId={productId}>
              <ProductReviewProvider productId={productId}>
                <ProductReviews />
              </ProductReviewProvider>
            </ProductAIAssistantProvider>
          )}
          <Recommendations />
        </S.ProductDetail>
        <Ad />
      </Layout>
    </AdProvider>
  );
};

export default ProductDetail;
