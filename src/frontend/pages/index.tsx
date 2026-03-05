// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import * as S from '../styles/Home.styled';
import { useQuery } from '@tanstack/react-query';
import ApiGateway from '../gateways/Api.gateway';
import Banner from '../components/Banner';
import { CypressFields } from '../utils/enums/CypressFields';
import { useCurrency } from '../providers/Currency.provider';
import { useEffect } from 'react';
import Analytics from '../utils/analytics';

const Home: NextPage = () => {
  const { selectedCurrency } = useCurrency();
  const { data: productList = [] } = useQuery({
    queryKey: ['products', selectedCurrency],
    queryFn: () => ApiGateway.listProducts(selectedCurrency),
  });

  useEffect(() => {
    Analytics.pageViewed('Home');
  }, []);

  return (
    <Layout>
      <Head>
        <title>Better Stack Store</title>
      </Head>
      <S.Home data-cy={CypressFields.HomePage}>
        <Banner />
        <S.Container>
          <S.Row>
            <S.Content>
              <S.HotProducts>
                <S.SectionHeader>
                  <S.HotProductsTitle
                    data-cy={CypressFields.HotProducts}
                    id="hot-products"
                  >
                    Featured Products
                  </S.HotProductsTitle>
                  {productList.length > 0 && (
                    <S.ProductCount>{productList.length} items</S.ProductCount>
                  )}
                </S.SectionHeader>
                <ProductList productList={productList} />
              </S.HotProducts>
            </S.Content>
          </S.Row>
        </S.Container>
      </S.Home>
    </Layout>
  );
};

export default Home;
