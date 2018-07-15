import React from "react";
import Link from "gatsby-link";
const _ = require("lodash")

export default function TagList({ list = [] }) {
    return (
        <ul>
            {list.map(tag =>
                <li key={tag.fieldValue}>
                    <Link to={`/tags/${_.kebabCase(tag.fieldValue)}`}>
                        {tag.fieldValue} ({tag.totalCount})
                    </Link>
                </li>
            )}
        </ul>
    );
}