import React from "react";
import Link from "gatsby-link";

import TagList from '../components/taglist';

import Logo from "./logowide.png";
import normalize from "./normalize.css";
import prismvs from "./prism-vs.css";
import style from "./index.css";

class Template extends React.Component {
  render() {
    const { children } = this.props
    const tagList = this.props.data.allMarkdownRemark.group;

    return (
      <div className="container">
        <header>
          <Link to={'/'}>
            <h1><img src={Logo} /></h1>
          </Link>
        </header>

        {children()}

        <footer>
          <hr />
          <div className="categories">
            <h3>Categories</h3>
            <TagList list={tagList || []} />
          </div>
          <hr />
          <div className="footermenu">
            <Link to={"/about"}>About</Link>
          </div>
          <div className="copy">
            (c) 2012-2018 Dalian Spacekey Information Technology Ltd.
          </div>
        </footer>
      </div>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.func,
  location: React.PropTypes.object,
  route: React.PropTypes.object,
}

export default Template

export const pageQuery = graphql`
  query FooterTagsQuery {
    allMarkdownRemark {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
