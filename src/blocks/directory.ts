import { createDirectory } from '@page-blocks/react';
import { About } from '@src/blocks/components/About';

export const directory = createDirectory({
  context: {},
  resolver: {
    type: 'tanstack-query',
    endpoint: '/api/page-blocks',
    screenshots: '/blocks',
  },
  blocks: {
    // Card,
    About,
  },
});

export const Blocks = directory.Blocks;

export const Slot = directory.Slot;

export const SlotContext = directory.SlotContext;

export const BlockArchive = directory.BlockArchive;
