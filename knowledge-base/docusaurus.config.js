// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ClickHouse Knowledge Base',
  tagline: 'with love from Tinybird',
  url: 'https://tinybird.co/',
  baseUrl: '/clickhouse/knowledge-base/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'tinybirdco',
  projectName: 'clickhouse_knowledge_base',
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
      announcementBar: {
        id: 'try_tinybird',
        content:
          `<a href="https://www.tinybird.co">
            <strong>Like ClickHouse but hate complexity?</strong> 
            <span class="announcementBarUnderlined">Try Tinybird</span>
          </a>`,
        isCloseable: false,
      },
      navbar: {
        title: 'ClickHouse Knowledge Base',
        logo: {
          alt: 'ClickHouse Knowledge Base Logo',
          src: 'img/clickhouse-kb-logo.svg',
        },
        items: [
          {
            href: 'https://www.tinybird.co',
            label: 'Tinybird',
            position: 'right',
          },
          {
            href: 'https://github.com/tinybirdco/clickhouse_knowledge_base',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        links: [
          {
            label: 'Join us on Slack',
            href: 'https://www.tinybird.co/join-our-slack-community',
          },
          {
            label: 'Daily Tips on Twitter',
            href: 'https://twitter.com/ClickHouseTips',
          },
          {
            label: 'Tinybird GitHub',
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
