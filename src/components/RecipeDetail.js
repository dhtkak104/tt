import React, {useEffect, useState} from "react";
import axios from 'axios';

export default function RecipeDetail(props) {
    const {match}=props;
    const [detail, setDetail] = useState({});
    useEffect(()=>{
        axios.get('http://localhost:3355/recipe_detail',{
            params:{
                no:match.params.no
            }
        }).then((result)=>{
            setDetail(result.data);
        })
    },[])

    debugger;
    if(detail.foodmake === undefined){
        detail.foodmake = '';
    }
    const food = detail.foodmake.split('^');
    const data = food.map((m, index)=>
        <li key={index}>{m}</li>
    )
    return (
        <div className={"row"} style={{"margin":"0px auto", "width":"900px"}}>
            <table className={"table"}>
                <tbody>
                    <tr>
                        <td colSpan={"3"}>
                            <img src={detail.poster} width={"700"} height={"350"}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={"3"}>
                            <h3>{detail.title}</h3>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={"3"}>
                            {detail.content}
                        </td>
                    </tr>
                    <tr>
                        <td className={"text-center"}><img src={"/inwon.png"}/></td>
                        <td className={"text-center"}><img src={"/time.png"}/></td>
                        <td className={"text-center"}><img src={"/who.png"}/></td>
                    </tr>
                    <tr>
                        <td className={"text-center"}>{detail.info1}</td>
                        <td className={"text-center"}>{detail.info2}</td>
                        <td className={"text-center"}>{detail.info3}</td>
                    </tr>
                    <tr>
                        <td colSpan={"3"}>
                            <table className={"table"}>

                            </table>
                            <h3>요리방법</h3>
                            <ul>
                                {data}
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}