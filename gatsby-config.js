module.exports = {
  siteMetadata: {
    title: "Spacekey",
    author: "Spacekey",
    siteUrl: "https://spacekey.info",
    description: "Dalian Spacekey Information Technology"
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/posts`,
        name: "contents",
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt: true,
        excerpt_separator: '---',
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: "gatsby-remark-embed-gist",
            options: {
              username: 'dalian-spacekey',
              includeDefaultCss: true
            }
          },
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 640,
            }
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
            },
          },
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-38086284-1`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: ["/tags", "/tags/*"]
      }
    },
    {
      resolve: `gatsby-plugin-feed`
    }
  ],
}
