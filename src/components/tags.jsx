import React from "react";
import Link from "gatsby-link";
const _ = require("lodash")

export default function Tags({ list = [] }) {
    return (
        <p className="posttags">
            {list.map(tag =>
                <span key={tag} style={{ marginRight: "1em" }}>
                    <Link to={`/tags/${_.kebabCase(tag)}`}>{tag}</Link>
                </span>
            )}
        </p>
    );
}