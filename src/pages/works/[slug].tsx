// @ts-nocheck

import { CanopyEnvironment } from '@customTypes/canopy';
import Container from '@components/Shared/Container';
import FACETS from '@.canopy/facets.json';
import Layout from '@components/layout';
import MANIFESTS from '@.canopy/manifests.json';
import { Manifest } from '@iiif/presentation-3';
import Related from '@components/Related/Related';
import Viewer from '@components/Viewer/Viewer';
import WorkInner from '@components/Work/Inner';
import { buildManifestSEO } from '@lib/seo';
import { fetch } from '@iiif/vault-helpers/fetch';
import { shuffle } from 'lodash';
import { Slot, SlotContext } from '@src/blocks/directory';
import { fileSystemLoader } from '@src/blocks/server';

interface WorkProps {
  manifest: Manifest;
  related: any;
  slots: any;
  slug: string;
}

export default function Work({ manifest, related, slots, slug }: WorkProps) {
  const { id } = manifest;

  console.log(slots);

  return (
    <Layout>
      <SlotContext name="work" value={slug} slots={['work_header', 'work_footer']} cache={slots}>
        <Viewer iiifContent={id} />

        <Container>
          <Slot name="work_header" />
          <WorkInner manifest={manifest} />
          <Related collections={related} />
          <Slot name="work_footer" />
        </Container>
      </SlotContext>
    </Layout>
  );
}

export async function getStaticProps({ params }: { params: any }) {
  const { url, basePath } = process.env?.CANOPY_CONFIG as unknown as CanopyEnvironment;
  const baseUrl = basePath ? `${url}${basePath}` : url;
  const slots = await fileSystemLoader.query({ work: params.slug }, ['work_header', 'work_footer']);

  const { id, index } = MANIFESTS.find((item) => item.slug === params.slug) as any;
  const manifest = (await fetch(id)) as Manifest;

  /**
   * build the seo object
   */
  const seo = await buildManifestSEO(manifest, `/works/${params.slug}`);
  const related = FACETS.map((facet) => {
    const value = shuffle(facet.values.filter((entry) => entry.docs.includes(index)));
    return `${baseUrl}/api/facet/${facet.slug}/${value[0]?.slug}.json?sort=random`;
  });

  /**
   * scrub the manifest of any provider property
   */
  delete manifest.provider;

  return {
    props: { manifest, related, seo, slots, slug: params.slug },
  };
}

export async function getStaticPaths() {
  const paths = MANIFESTS.map((item) => ({
    params: { ...item },
  }));

  return {
    paths: paths,
    fallback: false,
  };
}
