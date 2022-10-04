// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ClickHouse Knowledge Base',
  tagline: 'with love from Tinybird',
  url: 'https://tinybird.co/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'tinybirdco',
  projectName: 'clickhouse-knowledge-base',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'ClickHouse Knowledge Base',
        logo: {
          alt: 'ClickHouse Knowledge Base Logo',
          src: 'img/clickhouse-kb-logo.svg',
        },
        items: [
          {
            type: 'html',
            position: 'left',
            value: '<span class="by-tinybird">by tinybird</span>',
          },
          {
            href: 'https://github.com/tinybirdco/clickhouse-knowledge-base',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        links: [
          {
            label: 'GitHub',
            href: 'https://github.com/ClickHouse/ClickHouse',
          },
          {
            label: 'StackOverflow',
            href: 'https://stackoverflow.com/questions/tagged/clickhouse',
          },
          {
            label: 'Slack',
            href: 'https://www.tinybird.co/join-our-slack-community',
          },
          {
            label: 'Twitter',
            href: 'https://twitter.com/tinybirdco',
          },
          {
            label: 'Blog',
            href: 'https://www.tinybird.co/blog',
          },
          {
            label: 'GitHub',
            href: 'https://github.com/tinybirdco',
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Tinybird.
        ClickHouse® is a registered trademark of ClickHouse, Inc. All Rights Reserved`,
      },
      prism: {
        theme: require('./custom-code-theme'),
      },
    }),
};

module.exports = config;
