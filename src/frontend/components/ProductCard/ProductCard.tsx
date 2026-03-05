// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { CypressFields } from '../../utils/enums/CypressFields';
import { Product } from '../../protos/demo';
import ProductPrice from '../ProductPrice';
import * as S from './ProductCard.styled';
import { useState, useEffect, useCallback } from 'react';
import { useNumberFlagValue } from '@openfeature/react-sdk';
import { useCart } from '../../providers/Cart.provider';
import Analytics from '../../utils/analytics';

interface IProps {
  product: Product;
}

async function getImageWithHeaders(requestInfo: Request) {
  const res = await fetch(requestInfo);
  return await res.blob();
}

const ProductCard = ({
  product: {
    id,
    picture,
    name,
    categories = [],
    priceUsd = {
      currencyCode: 'USD',
      units: 0,
      nanos: 0,
    },
  },
}: IProps) => {
  const imageSlowLoad = useNumberFlagValue('imageSlowLoad', 0);
  const [imageSrc, setImageSrc] = useState<string>('');
  const { addItem } = useCart();

  useEffect(() => {
    const headers = new Headers();
    headers.append('x-envoy-fault-delay-request', imageSlowLoad.toString());
    headers.append('Cache-Control', 'no-cache');
    const requestInit = { method: 'GET', headers };
    const image_url = '/images/products/' + picture;
    const requestInfo = new Request(image_url, requestInit);
    getImageWithHeaders(requestInfo).then(blob => {
      setImageSrc(URL.createObjectURL(blob));
    });
  }, [imageSlowLoad, picture]);

  const handleQuickAdd = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      Analytics.addedToCart(id, name, 1, priceUsd);
      await addItem({ productId: id, quantity: 1 });
    },
    [id, name, priceUsd, addItem]
  );

  const handleCardClick = useCallback(() => {
    Analytics.productViewed(id, name, priceUsd);
  }, [id, name, priceUsd]);

  const primaryCategory = categories[0];

  return (
    <S.Link href={`/product/${id}`} onClick={handleCardClick}>
      <S.ProductCard data-cy={CypressFields.ProductCard}>
        <S.ImageWrapper>
          <S.Image $src={imageSrc} />
          <S.QuickAddOverlay>
            <S.QuickAddButton
              data-cy="product-card-quick-add"
              onClick={handleQuickAdd}
            >
              Quick add to cart
            </S.QuickAddButton>
          </S.QuickAddOverlay>
        </S.ImageWrapper>
        <S.CardBody>
          {primaryCategory && (
            <S.CategoryBadge>{primaryCategory}</S.CategoryBadge>
          )}
          <S.ProductName>{name}</S.ProductName>
          <S.ProductPrice>
            <ProductPrice price={priceUsd} />
          </S.ProductPrice>
        </S.CardBody>
      </S.ProductCard>
    </S.Link>
  );
};

export default ProductCard;
