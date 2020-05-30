import React from "react";

export default function RecipeDetail(props) {
    const {match}=props;
    return (
        <div>
            <h1>레시피상세보기 : {props.match.params.no}</h1>
            <h1>레시피상세보기 : {match.params.no}</h1>
        </div>
    )
}