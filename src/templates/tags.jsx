import React from "react";
import Helmet from 'react-helmet'
import PropTypes from "prop-types";
import Link from "gatsby-link";
import AdSense from "react-adsense";

const Tags = ({ pathContext, data }) => {
    const { tag } = pathContext;
    const { edges, totalCount } = data.allMarkdownRemark;

    return (
        <div className="titlelist">
            <Helmet title={`${tag} | Spacekey`} />

            <h1>{tag}({totalCount})</h1>
            <ul className="titlelist">
                {edges.map(({ node }) => {
                    const { title, date } = node.frontmatter;
                    return (
                        <li key={node.fields.slug}>
                            <Link to={node.fields.slug}>{title}</Link>({date})
                        </li>
                    );
                })}
            </ul>

            <div className="ad">
                <AdSense.Google
                    client="ca-pub-4343024996209944"
                    slot="2071710325"
                    format="auto" />
            </div>
        </div>
    );
};

Tags.propTypes = {
    pathContext: PropTypes.shape({
        tag: PropTypes.string.isRequired,
    }),
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.shape({
            totalCount: PropTypes.number.isRequired,
            edges: PropTypes.arrayOf(
                PropTypes.shape({
                    node: PropTypes.shape({
                        frontmatter: PropTypes.shape({
                            title: PropTypes.string.isRequired,
                        }),
                    }),
                }).isRequired
            ),
        }),
    }),
};

export default Tags;

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            tags
            date(formatString: "YYYY-MM-DD")
          }
        }
      }
    }
  }
`;