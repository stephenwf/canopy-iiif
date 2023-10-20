import { createNextPageRequestHandler } from '@page-blocks/next';
import { fileSystemLoader, generateScreenshots } from '@src/blocks/server';
import { directory } from '@src/blocks/directory';

export default createNextPageRequestHandler({
  loader: fileSystemLoader,
  directory,
  generateScreenshots,
});
