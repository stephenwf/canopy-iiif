import { block } from '@page-blocks/react';
import Heading from '@components/Shared/Heading/Heading';
import React from 'react';
import { z } from 'zod';
import { ButtonWrapper } from '@components/Shared/Button/Button.styled';
import Button from '@components/Shared/Button/Button';
import { ArrowRightIcon, GitHubLogoIcon } from '@radix-ui/react-icons';

export const About = block(
  {
    label: 'About section',
    props: z.object({
      title: z.string(),
      description: z.string(),
      primaryButtonLabel: z.string().optional(),
      primaryButtonLink: z.string().optional(),
      secondaryButtonLabel: z.string().optional(),
      secondaryButtonLink: z.string().optional(),
    }),
    examples: [
      {
        label: 'Example',
        context: {},
        props: {
          title: 'About Canopy',
          description: `
            <strong>Canopy IIIF</strong> is a purely <a href="https://iiif.io/">IIIF</a> sourced site generator using
            Next.js. Canopy is an experimental application that will standup a browseable and searchable digital
            collections style site entirely from a
            <a href="https://iiif.io/api/presentation/3.0/#51-collection">IIIF Collection</a> and the resources it
            references.
          `,
          primaryButtonLabel: 'Read More',
          primaryButtonLink: '/about',
          secondaryButtonLabel: 'View Code',
          secondaryButtonLink: 'https://github.com/canopy-iiif/canopy-iiif',
        },
      },
    ],
  },
  function About(props) {
    return (
      <>
        <Heading as="h2">{props.title}</Heading>
        <div>
          {props.description ? <p dangerouslySetInnerHTML={{ __html: props.description }}></p> : null}
          <ButtonWrapper>
            {props.primaryButtonLabel && props.primaryButtonLink ? (
              <Button href={props.primaryButtonLink} buttonType="primary">
                {props.primaryButtonLabel} &nbsp;
                <ArrowRightIcon />
              </Button>
            ) : null}
            {props.secondaryButtonLabel && props.secondaryButtonLink ? (
              <Button href={props.secondaryButtonLink} buttonType="secondary">
                {props.secondaryButtonLabel} &nbsp;
                <GitHubLogoIcon />
              </Button>
            ) : null}
          </ButtonWrapper>
        </div>
      </>
    );
  }
);
