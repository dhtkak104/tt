import React, {Fragment, useState, useEffect}from "react";
import axios from "axios";
import {NavLink} from "react-router-dom";

export default function Recipe() {
    const [recipe, setRecipe] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(async ()=>{
        // 서버를 연결해서 데이터를 읽어온 후 => setRecipe에 저장
        await axios.get('http://localhost:3355/recipe',{
            params:{
                page:page
            }
        }).then((result)=>{
            setRecipe(result.data);
        })
    },[])

    useEffect(async()=>{
        await axios.get('http://localhost:3355/recipe_total')
        .then((result)=>{
            setTotal(result.data.total);
        })
    },[])

    const onPrev = () => {
        setPage(page>1?page-1:page);
        axios.get('http://localhost:3355/recipe',{
            params:{
                page:page
            }
        }).then((result)=>{
            setRecipe(result.data);
        })
    }
    const onNext = () => {
        setPage(page<total?page+1:page);
        axios.get('http://localhost:3355/recipe',{
            params:{
                page:page
            }
        }).then((result)=>{
            setRecipe(result.data);
        })
    }

    const html=recipe.map((m, index)=>
        <div key={index} className="col-md-4">
            <NavLink to={"/recipe_detail/"+m.no}>
                <div className="thumbnail">
                    <img src={m.poster} alt="Lights" style={{"width":"100%"}}/>
                    <div className="caption">
                        <p style={{"fontSize":"9pt"}}>{m.title.length>30?m.title.substring(0,30)+"...":m.title}</p>
                        <sub style={{"color":"gray"}}>{m.chef}</sub>
                    </div>
                </div>
            </NavLink>
        </div>

    )
    return (
        <Fragment>
            <h1>레시피</h1>
            <div className={"row"}>
                {html}
            </div>
            <div className={"row"}>
                <button className={"btn btn-lg btn-primary"} onClick={onPrev}>이전</button>
                {page} page / {total} pages
                <button className={"btn btn-lg btn-primary"} onClick={onNext}>다음</button>
            </div>
        </Fragment>
    )
}