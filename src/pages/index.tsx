import { ArrowRightIcon, GitHubLogoIcon } from '@radix-ui/react-icons';

import Button from '../components/Shared/Button/Button';
import { ButtonWrapper } from '../components/Shared/Button/Button.styled';
import { CanopyEnvironment } from '@customTypes/canopy';
import Container from '@components/Shared/Container';
import FACETS from '@.canopy/facets.json';
import Heading from '../components/Shared/Heading/Heading';
import Hero from '@components/Hero/Hero';
import { HeroWrapper } from '../components/Hero/Hero.styled';
import Layout from '@components/layout';
import { LocaleString } from '@hooks/useLocale';
import React from 'react';
import Related from '../components/Related/Related';
import { canopyManifests } from '@lib/constants/canopy';
import { createCollection } from '../lib/iiif/constructors/collection';
import { getRelatedFacetValue } from '../lib/iiif/constructors/related';
import { useCanopyState } from '@context/canopy';
import { Slot, SlotContext } from '../blocks/directory';
import { fileSystemLoader } from '@src/blocks/server';

interface IndexProps {
  featuredItem: any;
  collections: string[];
  slots: any;
}

const Index: React.FC<IndexProps> = ({ featuredItem, collections, slots }) => {
  const { canopyState } = useCanopyState();
  const {
    config: { baseUrl },
  } = canopyState;

  const hero = {
    ...featuredItem,
    items: featuredItem.items.map((item: any) => {
      return {
        ...item,
        homepage: [
          {
            id: `${baseUrl}/works/`,
            type: 'Text',
            label: item.label,
          },
        ],
      };
    }),
  };

  return (
    <Layout>
      <SlotContext cache={slots}>
        <HeroWrapper>
          <Hero collection={hero} />
        </HeroWrapper>
        <Container>
          <Slot name="homepage-header">
            <Slot.About
              title="About Canopy"
              description={`<strong>Canopy IIIF</strong> is a purely <a href="https://iiif.io/">IIIF</a> [...]`}
              primaryButtonLabel="Read More"
              primaryButtonLink="/about"
              secondaryButtonLabel="View Code"
              secondaryButtonLink="https://github.com/canopy-iiif/canopy-iiif"
            />
          </Slot>

          <Related collections={collections} title={LocaleString('homepageHighlightedWorks')} />
        </Container>
      </SlotContext>
    </Layout>
  );
};

export async function getStaticProps() {
  const slots = await fileSystemLoader.query({}, ['homepage-header']);

  const manifests = canopyManifests();

  // @ts-ignore
  const { featured, metadata, baseUrl } = process.env?.CANOPY_CONFIG as unknown as CanopyEnvironment;

  const randomFeaturedItem = manifests[Math.floor(Math.random() * manifests.length)];
  const featuredItem = await createCollection(featured ? featured : [randomFeaturedItem.id]);

  const collections = FACETS.map((facet) => {
    const value = getRelatedFacetValue(facet.label);
    return `${baseUrl}/api/facet/${facet.slug}/${value.slug}.json?sort=random`;
  });

  return {
    props: { metadata, featuredItem, collections, slots },
    revalidate: 3600,
  };
}

export default Index;
