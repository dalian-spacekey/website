import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import get from "lodash/get"
import Tags from "../components/tags";
import AdSense from "react-adsense";

const NavLink = props => {
    if (!props.test) {
        return <Link to={props.url}>{props.text}</Link>;
    } else {
        return <span />;
    }
};

const IndexPage = ({pathContext}) => {
    const { group, index, first, last } = pathContext;
    const previousUrl = index - 1 == 1 ? "" : (index - 1).toString();
    const nextUrl = (index + 1).toString();
    const siteTitle = "Spacekey";

    return (
        <div className="contents">
            <Helmet title={`${siteTitle}`} />
            {group.map(({ node }) => {
                const title = get(node, "frontmatter.title") || node.fields.slug;
                return (
                    <div key={node.fields.slug}>
                        <h1>
                            <Link to={node.fields.slug}>
                                {title}
                            </Link>
                        </h1>
                        <div className="postdata">
                            <Tags list={node.frontmatter.tags || []} />
                            <p className="postdate">{node.frontmatter.date}</p>
                        </div>
                        <div className="postbody">
                            <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                            <p className="postmore"><Link to={node.fields.slug}>
                                &gt;&gt;&gt;
                            </Link></p>
                        </div>
                        <AdSense.Google
                            client="ca-pub-4343024996209944"
                            slot="2071710325"
                            format="auto" />
                    </div>
                )
            })}
            <div className="pagelink">
                <p className="previous"><NavLink test={first} url={previousUrl} text="&lt;Previous" /></p>
                <p className="next"><NavLink test={last} url={nextUrl} text="Next&gt;" /></p>
            </div>
        </div>
    );
};

export default IndexPage;