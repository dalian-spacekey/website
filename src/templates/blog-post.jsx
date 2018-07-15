import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Tags from "../components/tags";
import Ad from "../components/ad";

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <div className="contents">
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <h1>{post.frontmatter.title}</h1>
        <div className="postdata">
          <Tags list={post.frontmatter.tags || []} />
          <p className="postdate">{post.frontmatter.date}</p>
        </div>
        <div className="postbody" dangerouslySetInnerHTML={{ __html: post.html }} />

        <Ad />
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        tags
      }
    }
  }
`
